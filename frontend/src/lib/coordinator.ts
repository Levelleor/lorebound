import { readCommitResult, readSnapshot, schemaVersion, type CommitRequest, type CommitResult, type Library, type Snapshot } from './library.ts';
import { documentToText, plainTextToDocument, reconstruct, type Projection, type Turn } from './story.ts';

export interface GenerationInput
{
  input: string;
  history: string[];
}
export type Generator = (request: GenerationInput, signal: AbortSignal) => Promise<string>;
export interface StoryStorage
{
  commit(request: CommitRequest): Promise<CommitResult>;
  read(epoch: string, adventureId: string): Promise<Snapshot>;
  list(): Promise<Library>;
}
export interface CoordinatorState
{
  snapshot: Snapshot;
  input: string;
  phase: 'idle' | 'generating' | 'ready' | 'saving' | 'uncertain' | 'blocked';
  candidate: Turn | null;
  error: string;
  projection: Projection;
  refreshing: boolean;
}
interface Dependencies
{
  storage: StoryStorage;
  generate?: Generator;
  newId?: () => string;
  onChange?: (state: CoordinatorState) => void;
}

// Deliberately simulated narration. No provider connection or model quality is claimed.
export const simulatedGeneration: Generator = async (_request, signal) =>
{
  await new Promise<void>((resolve, reject) =>
  {
    const cancelled = () =>
    {
      clearTimeout(timer);
      reject(new Error('generation_cancelled'));
    };
    const timer = setTimeout(() =>
    {
      signal.removeEventListener('abort', cancelled);
      resolve();
    }, 450);
    if (signal.aborted) cancelled();
    else signal.addEventListener('abort', cancelled, { once: true });
  });
  return 'The story pauses on the edge of possibility.\n\nIts next direction is still yours to choose.';
};

function frozenCopy<T>(value: T): T
{
  const copy = structuredClone(value);
  function freeze(part: unknown): void
  {
    if (!part || typeof part !== 'object') return;
    Object.values(part).forEach(freeze);
    Object.freeze(part);
  }
  freeze(copy);
  return copy;
}

export class StoryCoordinator
{
  state: CoordinatorState;
  private readonly storage: StoryStorage;
  private readonly generator: Generator;
  private readonly newId: () => string;
  private readonly changed: (state: CoordinatorState) => void;
  private sequence = 0;
  private disposed = false;
  private abort: AbortController | null = null;
  private pending: CommitRequest | null = null;
  private refreshRequested = false;

  constructor(snapshot: Snapshot, dependencies: Dependencies)
  {
    const source = frozenCopy(readSnapshot(snapshot));
    const projection = reconstruct(source);
    this.state = {
      snapshot: source,
      projection,
      input: '',
      phase: projection.blocked ? 'blocked' : 'idle',
      candidate: null,
      error: projection.error,
      refreshing: false
    };
    this.storage = dependencies.storage;
    this.generator = dependencies.generate ?? simulatedGeneration;
    this.newId = dependencies.newId ?? (() => crypto.randomUUID());
    this.changed = dependencies.onChange ?? (() => {});
  }

  private update(next: Partial<CoordinatorState>): void
  {
    if (this.disposed) return;
    this.state = { ...this.state, ...next };
    this.changed(this.state);
  }

  private live(sequence: number): boolean
  {
    return !this.disposed && sequence === this.sequence;
  }

  get canRefresh(): boolean
  {
    return !this.disposed && !this.state.refreshing && !this.pending
      && (this.state.phase === 'idle' || this.state.phase === 'blocked');
  }

  setInput(input: string): void
  {
    // Background canonical reads must not swallow edits to noncanonical input.
    if (this.state.phase === 'idle') this.update({ input, error: '' });
  }

  async generate(): Promise<void>
  {
    if (this.disposed || this.state.phase !== 'idle' || this.state.refreshing || this.state.projection.blocked) return;
    await this.prepareCandidate();
  }

  async retry(): Promise<void>
  {
    if (this.disposed || this.state.phase !== 'ready' || !this.state.candidate
      || this.pending || this.state.refreshing || this.state.projection.blocked) return;
    await this.prepareCandidate();
  }

  private async prepareCandidate(): Promise<void>
  {
    const sequence = ++this.sequence;
    const snapshot = this.state.snapshot;
    this.abort?.abort();
    this.abort = new AbortController();
    this.update({ phase: 'generating', candidate: null, error: '' });
    let authored;
    try
    {
      authored = plainTextToDocument(this.state.input);
    }
    catch
    {
      this.abort = null;
      this.update({ phase: 'idle', error: 'Enter a story passage of 20,000 characters or fewer.' });
      this.refreshIfRequested();
      return;
    }

    try
    {
      // Provider-facing input contains natural prose only, never internal IDs.
      const text = await this.generator({
        input: documentToText(authored),
        history: this.state.projection.passages.map(passage => documentToText(passage.body))
      }, this.abort.signal);
      if (!this.live(sequence)) return;
      const candidate: Turn = {
        schemaVersion: 1,
        id: this.newId(),
        order: snapshot.adventure.version + 1,
        passages: [
          { id: this.newId(), source: 'authored', body: authored },
          { id: this.newId(), source: 'generated', body: plainTextToDocument(text) }
        ],
        events: []
      };
      // Validate the complete proposed history, including collisions with prior IDs.
      readSnapshot({
        ...snapshot,
        adventure: { ...snapshot.adventure, version: snapshot.adventure.version + 1 },
        turns: [...snapshot.turns, candidate]
      });
      this.update({ phase: 'ready', candidate: frozenCopy(candidate) });
    }
    catch
    {
      if (this.live(sequence)) this.update({
        phase: 'idle',
        candidate: null,
        error: 'The simulated response could not be prepared. Your text is retained; send it again when ready.'
      });
    }
    finally
    {
      if (this.live(sequence)) this.abort = null;
      this.refreshIfRequested();
    }
  }

  stop(): void
  {
    if (this.state.phase !== 'generating') return;
    ++this.sequence;
    this.abort?.abort();
    this.abort = null;
    this.update({ phase: 'idle', candidate: null, error: '' });
    this.refreshIfRequested();
  }

  discard(): void
  {
    if (this.state.phase === 'generating')
    {
      this.stop();
      return;
    }
    if (this.state.phase !== 'ready') return;
    ++this.sequence;
    this.update({ phase: 'idle', candidate: null, error: '' });
    this.refreshIfRequested();
  }

  async accept(): Promise<void>
  {
    if (this.disposed || this.state.phase !== 'ready' || !this.state.candidate) return;
    this.pending = frozenCopy({
      schemaVersion,
      epoch: this.state.snapshot.epoch,
      adventureId: this.state.snapshot.adventure.id,
      operationId: this.newId(),
      expectedVersion: this.state.snapshot.adventure.version,
      kind: 'append_story_turn',
      turn: this.state.candidate
    });
    await this.save();
  }

  async retrySave(): Promise<void>
  {
    if (this.state.phase !== 'uncertain' || !this.pending || this.disposed) return;
    await this.save();
  }

  private async save(): Promise<void>
  {
    const request = this.pending;
    if (!request) return;
    const sequence = ++this.sequence;
    this.update({ phase: 'saving', error: '' });
    let committed = false;
    try
    {
      const result = readCommitResult(await this.storage.commit(request));
      if (!this.live(sequence)) return;
      if (result.epoch !== request.epoch || result.adventureId !== request.adventureId
        || result.operationId !== request.operationId || result.turnId !== request.turn.id
        || result.version !== request.expectedVersion + 1) throw new Error('unsupported_commit_response');
      committed = true;
      // A replayed receipt can refer to an older version. Always read current canon.
      this.refreshRequested = false;
      const snapshot = readSnapshot(await this.storage.read(request.epoch, request.adventureId));
      if (!this.live(sequence)) return;
      if (snapshot.epoch !== request.epoch || snapshot.adventure.id !== request.adventureId
        || snapshot.adventure.version < result.version
        || !snapshot.turns.some(turn => turn.id === result.turnId)) throw new Error('inconsistent_commit_read');
      const projection = reconstruct(snapshot);
      this.pending = null;
      this.update({
        snapshot: frozenCopy(snapshot),
        projection,
        input: '',
        candidate: null,
        phase: projection.blocked ? 'blocked' : 'idle',
        error: projection.error
      });
    }
    catch (cause)
    {
      if (!this.live(sequence)) return;
      const reason = String(cause);
      if (!committed && (reason.includes('stale_version') || reason.includes('wrong_epoch')))
      {
        this.pending = null;
        this.update({ candidate: null, phase: 'blocked', refreshing: true });
        this.refreshRequested = false;
        try
        {
          await this.refetch(sequence, 'The saved story or library changed. Your text is retained. Review the current story, then send it again to make a fresh proposal.');
        }
        finally
        {
          this.update({ refreshing: false });
        }
      }
      else if (!committed && /invalid_request|operation_id_conflict|unsupported_event|unsupported_history/.test(reason))
      {
        this.pending = null;
        this.update({
          phase: 'blocked',
          candidate: null,
          error: 'This turn could not be saved in the current format. Your text is retained. Reload the story before continuing.'
        });
      }
      else
      {
        // No fresh operation ID or candidate may be created until this attempt resolves.
        this.update({ phase: 'uncertain', error: 'The save could not be confirmed. Retry the same save to recover its result safely. Your text is retained.' });
      }
    }
    finally
    {
      this.refreshIfRequested();
    }
  }

  private async refetch(sequence: number, message = ''): Promise<void>
  {
    try
    {
      const library = await this.storage.list();
      const snapshot = readSnapshot(await this.storage.read(library.epoch, this.state.snapshot.adventure.id));
      if (!this.live(sequence)) return;
      if (snapshot.epoch !== library.epoch || snapshot.adventure.id !== this.state.snapshot.adventure.id) throw new Error('inconsistent_story_read');
      const projection = reconstruct(snapshot);
      this.update({
        snapshot: frozenCopy(snapshot),
        projection,
        phase: projection.blocked ? 'blocked' : 'idle',
        error: projection.error || message
      });
    }
    catch
    {
      if (this.live(sequence)) this.update({ phase: 'blocked', error: 'The current story could not be loaded. Your text is retained. Reload the story before continuing.' });
    }
  }

  private refreshIfRequested(): void
  {
    if (this.refreshRequested && this.canRefresh && this.state.phase === 'idle') void this.refresh();
  }

  requestRefresh(): void
  {
    if (this.disposed) return;
    this.refreshRequested = true;
    this.refreshIfRequested();
  }

  // Hints received during provisional or uncertain work wait for a safe read.
  // A hint during a read requests another coherent snapshot after that read.
  async refresh(): Promise<void>
  {
    if (this.disposed) return;
    this.refreshRequested = true;
    if (!this.canRefresh) return;

    this.update({ refreshing: true });
    const sequence = ++this.sequence;
    try
    {
      do
      {
        this.refreshRequested = false;
        await this.refetch(sequence, this.state.phase === 'idle' ? this.state.error : '');
      }
      while (this.refreshRequested && this.live(sequence) && this.state.phase === 'idle');
    }
    finally
    {
      this.update({ refreshing: false });
    }
  }

  dispose(): void
  {
    this.disposed = true;
    this.refreshRequested = false;
    ++this.sequence;
    this.abort?.abort();
    this.abort = null;
  }
}
