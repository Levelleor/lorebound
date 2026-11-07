import { readCommitResult, readSnapshot, schemaVersion, type CommitRequest, type CommitResult, type EditRequest, type Library, type Snapshot } from './library.ts';
import { documentToText, plainTextToDocument, reconstruct, type Projection, type Turn } from './story.ts';
import { TextDraft, type DraftStatus, type DraftStorage } from './draft.ts';

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
  phase: 'idle' | 'generating' | 'ready' | 'undo-ready' | 'editing' | 'edit-ready' | 'edit-conflict' | 'discarding-edit' | 'saving' | 'uncertain' | 'blocked';
  edit: { turnId: string; passageId: string; order: number; text: string; draftStatus: DraftStatus; draftError: string } | null;
  candidate: Turn | null;
  undoTurn: { id: string; order: number } | null;
  notice: string;
  error: string;
  projection: Projection;
  refreshing: boolean;
  draftStatus: DraftStatus;
  draftError: string;
}
interface Dependencies
{
  storage: StoryStorage;
  draftStorage?: DraftStorage;
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

function editedTurns(snapshot: Snapshot, request: EditRequest): Turn[]
{
  const target = snapshot.turns.find(turn => turn.id === request.turnId);
  if (!target || target.passages[1].id !== request.passageId) throw new Error('invalid_edit_target');
  return snapshot.turns.filter(turn => request.later === 'keep' || turn.order <= target.order)
    .map(turn => turn.id !== target.id ? turn : {
      ...turn,
      passages: turn.passages.map(passage => passage.id === request.passageId ? { ...passage, body: request.body } : passage)
    });
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
  private draftFlushed = false;
  private refreshRequested = false;
  readonly draft: TextDraft | null;
  private readonly draftEpoch: string;
  private readonly draftStorage?: DraftStorage;
  editDraft: TextDraft | null = null;

  constructor(snapshot: Snapshot, dependencies: Dependencies)
  {
    const source = frozenCopy(readSnapshot(snapshot));
    const projection = reconstruct(source);
    this.state = {
      snapshot: source,
      projection,
      input: '',
      edit: null,
      phase: projection.blocked ? 'blocked' : 'idle',
      candidate: null,
      undoTurn: null,
      notice: '',
      error: projection.error,
      refreshing: false,
      draftStatus: dependencies.draftStorage ? 'loading' : 'unsaved',
      draftError: ''
    };
    this.storage = dependencies.storage;
    this.generator = dependencies.generate ?? simulatedGeneration;
    this.newId = dependencies.newId ?? (() => crypto.randomUUID());
    this.changed = dependencies.onChange ?? (() => {});
    this.draftEpoch = source.epoch;
    this.draftStorage = dependencies.draftStorage;
    this.draft = dependencies.draftStorage ? new TextDraft(source.epoch, source.adventure.id,
      dependencies.draftStorage,
      input =>
      {
        if (this.state.phase === 'idle') this.update({ input });
      },
      (draftStatus, draftError) => this.update({ draftStatus, draftError })) : null;
    if (this.state.phase === 'idle') void this.draft?.restore();
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
    if (this.disposed || this.state.phase !== 'idle') return;
    this.update({ input, error: '', notice: '' });
    this.draft?.edit(input);
  }

  async generate(): Promise<void>
  {
    if (this.disposed || this.state.phase !== 'idle' || this.state.refreshing || this.state.projection.blocked) return;
    await this.prepareCandidate();
  }

  async startEdit(passageId: string): Promise<void>
  {
    if (this.disposed || this.state.phase !== 'idle' || this.state.refreshing || this.pending
      || this.state.projection.blocked || this.state.draftStatus === 'loading') return;
    const turn = this.state.snapshot.turns.find(turn => turn.passages[1].id === passageId);
    if (!turn) return;
    const text = documentToText(turn.passages[1].body);
    this.update({ phase: 'editing', error: '', notice: '', edit: {
      turnId: turn.id, passageId, order: turn.order, text,
      draftStatus: this.draftStorage ? 'loading' : 'unsaved', draftError: ''
    } });
    if (!this.draftStorage) return;
    this.editDraft = new TextDraft(this.state.snapshot.epoch, this.state.snapshot.adventure.id, this.draftStorage,
      text => { if (this.state.phase === 'editing') this.updateEdit({ text }); },
      (draftStatus, draftError) => this.updateEdit({ draftStatus, draftError }),
      600, `passage:${passageId}`, text);
    await this.editDraft.restore();
  }

  private updateEdit(next: Partial<NonNullable<CoordinatorState['edit']>>): void
  {
    if (this.state.edit) this.update({ edit: { ...this.state.edit, ...next } });
  }

  setEditText(text: string): void
  {
    if (this.disposed || this.state.phase !== 'editing') return;
    this.updateEdit({ text });
    this.editDraft?.edit(text);
    this.update({ error: '' });
  }

  reviewEdit(): void
  {
    if (this.disposed || this.state.phase !== 'editing' || !this.state.edit || this.state.edit.draftStatus === 'loading') return;
    try
    {
      plainTextToDocument(this.state.edit.text);
      this.editDraft?.pauseRestore();
      this.update({ phase: 'edit-ready', error: '' });
    }
    catch
    {
      this.update({ error: 'Enter a nonempty passage of 20,000 characters or fewer before confirming.' });
    }
  }

  continueEditing(): void
  {
    if (this.disposed || this.state.phase !== 'edit-ready') return;
    this.update({ phase: 'editing' });
  }

  async discardEdit(): Promise<void>
  {
    if (this.disposed || !this.state.edit || !['editing', 'edit-ready', 'edit-conflict'].includes(this.state.phase)) return;
    const phase = this.state.phase;
    this.update({ phase: 'discarding-edit', error: '' });
    try
    {
      await this.editDraft?.discard();
      this.editDraft?.dispose();
      this.editDraft = null;
      this.update({ phase: this.state.projection.blocked ? 'blocked' : 'idle', edit: null });
      this.refreshIfRequested();
    }
    catch
    {
      this.update({ phase, error: 'The draft discard could not be confirmed. Your edit is retained; try Discard again.' });
    }
  }

  async confirmEdit(later: 'keep' | 'truncate'): Promise<void>
  {
    if (this.disposed || this.state.phase !== 'edit-ready' || !this.state.edit || this.pending) return;
    if (this.state.snapshot.adventure.version === Number.MAX_SAFE_INTEGER)
    {
      this.update({ error: 'The edit could not be prepared because the adventure version limit was reached.' });
      return;
    }
    const edit = this.state.edit;
    const request: EditRequest = {
      schemaVersion, epoch: this.state.snapshot.epoch, adventureId: this.state.snapshot.adventure.id,
      expectedVersion: this.state.snapshot.adventure.version, operationId: this.newId(),
      kind: 'edit_generated_passage', turnId: edit.turnId, passageId: edit.passageId,
      body: plainTextToDocument(edit.text), later
    };
    const proposed = readSnapshot({ ...this.state.snapshot,
      adventure: { ...this.state.snapshot.adventure, version: request.expectedVersion + 1 },
      turns: editedTurns(this.state.snapshot, request) });
    if (reconstruct(proposed).blocked) return;
    this.draftFlushed = false;
    this.pending = frozenCopy(request);
    await this.save();
  }

  async reconsiderEdit(): Promise<void>
  {
    if (this.disposed || this.state.phase !== 'edit-conflict' || !this.state.edit || this.state.refreshing) return;
    this.update({ refreshing: true });
    const sequence = ++this.sequence;
    await this.refetch(sequence);
    if (!this.live(sequence)) return;
    const snapshot = this.state.snapshot;
    const target = snapshot.turns.find(turn => turn.passages[1].id === this.state.edit?.passageId);
    const ready = target && !this.state.error && !this.state.projection.blocked && snapshot.epoch === this.draftEpoch;
    this.update({ refreshing: false, phase: ready ? 'editing' : 'edit-conflict',
      error: ready ? 'Review your retained edit against the current story, then confirm a new decision.'
        : 'The edit target is unavailable or the library changed. Your text is retained for copying.' });
  }

  closeConflictedEdit(): void
  {
    if (this.disposed || this.state.phase !== 'edit-conflict' || this.state.refreshing) return;
    this.editDraft?.dispose();
    this.editDraft = null;
    this.update({ edit: null, phase: 'blocked', error: 'The edit was not applied. Reload the current story before continuing.' });
  }

  requestUndo(): void
  {
    if (this.disposed || this.state.phase !== 'idle' || this.state.refreshing
      || this.pending || this.state.projection.blocked || this.state.draftStatus === 'loading') return;
    const snapshot = this.state.snapshot;
    const turn = snapshot.turns.at(-1);
    if (!turn) return;
    if (snapshot.adventure.version === Number.MAX_SAFE_INTEGER)
    {
      this.update({ error: 'Undo could not be prepared because the adventure version limit was reached.' });
      return;
    }
    const prefix = readSnapshot({
      ...snapshot,
      adventure: { ...snapshot.adventure, version: snapshot.adventure.version + 1 },
      turns: snapshot.turns.slice(0, -1)
    });
    if (reconstruct(prefix).blocked) return;
    this.update({ phase: 'undo-ready', undoTurn: { id: turn.id, order: turn.order }, error: '', notice: '' });
  }

  async confirmUndo(): Promise<void>
  {
    if (this.disposed || this.state.phase !== 'undo-ready' || !this.state.undoTurn || this.pending) return;
    this.draftFlushed = false;
    this.pending = frozenCopy({
      schemaVersion,
      epoch: this.state.snapshot.epoch,
      adventureId: this.state.snapshot.adventure.id,
      operationId: this.newId(),
      expectedVersion: this.state.snapshot.adventure.version,
      kind: 'undo_story_turn',
      turnId: this.state.undoTurn.id
    });
    await this.save();
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
    this.update({ phase: 'generating', candidate: null, error: '', notice: '' });
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
        order: snapshot.turns.length + 1,
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
    if (this.state.phase === 'undo-ready')
    {
      this.update({ phase: 'idle', undoTurn: null, error: '' });
      this.refreshIfRequested();
      return;
    }
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
    this.draftFlushed = false;
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
      // Finish older autosaves before the canonical transaction consumes input.
      if (this.draft && !this.draftFlushed)
      {
        await this.draft.flush();
        if (!this.live(sequence)) return;
      }
      if (!this.draftFlushed)
      {
        await this.editDraft?.flush();
        if (!this.live(sequence)) return;
        this.draftFlushed = true;
      }
      const result = readCommitResult(await this.storage.commit(request));
      if (!this.live(sequence)) return;
      const appended = request.kind === 'append_story_turn';
      const turnId = appended ? request.turn.id : request.turnId;
      if (result.epoch !== request.epoch || result.adventureId !== request.adventureId
        || result.operationId !== request.operationId || result.turnId !== turnId
        || result.version !== request.expectedVersion + 1) throw new Error('unsupported_commit_response');
      committed = true;
      // A replayed receipt can refer to an older version. Always read current canon.
      this.refreshRequested = false;
      const snapshot = readSnapshot(await this.storage.read(request.epoch, request.adventureId));
      if (!this.live(sequence)) return;
      if (snapshot.epoch !== request.epoch || snapshot.adventure.id !== request.adventureId
        || snapshot.adventure.version < result.version) throw new Error('inconsistent_commit_read');
      const expectedTurns = appended
        ? [...this.state.snapshot.turns, request.turn]
        : request.kind === 'edit_generated_passage' ? editedTurns(this.state.snapshot, request)
        : this.state.snapshot.turns.slice(0, -1);
      if (snapshot.adventure.version === result.version
        && JSON.stringify(snapshot.turns) !== JSON.stringify(expectedTurns)) throw new Error('inconsistent_commit_read');
      const projection = reconstruct(snapshot);
      this.pending = null;
      if (appended) this.draft?.consumed();
      if (request.kind === 'edit_generated_passage')
      {
        this.editDraft?.consumed();
        this.editDraft?.dispose();
        this.editDraft = null;
      }
      const wasRemoved = appended && !snapshot.turns.some(turn => turn.id === result.turnId);
      const notice = appended
        ? wasRemoved ? 'The original save is confirmed. Its turn was later undone; the current story is shown.' : ''
        : request.kind === 'edit_generated_passage' ? 'Passage edit confirmed. The current saved story is shown.'
        : `Undo confirmed. Continuing from ${snapshot.turns.length ? `Turn ${snapshot.turns.length}` : 'the initial beginning'}.`;
      this.update({
        snapshot: frozenCopy(snapshot),
        projection,
        input: appended ? '' : this.state.input,
        candidate: null,
        undoTurn: null,
        edit: null,
        notice,
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
        this.update({ candidate: null, undoTurn: null, phase: 'blocked', refreshing: true });
        this.refreshRequested = false;
        try
        {
          await this.refetch(sequence, 'The saved story or library changed. Your input is retained. Review the current story before choosing a fresh action.');
        }
        finally
        {
          this.update({ refreshing: false, ...(this.state.edit ? { phase: 'edit-conflict' as const } : {}) });
        }
      }
      else if (!committed && /invalid_request|operation_id_conflict|unsupported_event|unsupported_history/.test(reason))
      {
        this.pending = null;
        this.update({
          phase: this.state.edit ? 'edit-conflict' : 'blocked',
          candidate: null,
          undoTurn: null,
          error: 'This change could not be saved in the current format. Your text is retained. Reload the story before continuing.'
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
      const preserveInput = Boolean(this.state.input && (message || this.state.error
        || snapshot.adventure.version !== this.state.snapshot.adventure.version
        || snapshot.epoch !== this.state.snapshot.epoch));
      this.update({
        snapshot: frozenCopy(snapshot),
        projection,
        phase: this.state.edit ? 'edit-conflict' : projection.blocked ? 'blocked' : 'idle',
        error: projection.error || message
      });
      if (!projection.blocked && !preserveInput && snapshot.epoch === this.draftEpoch) await this.draft?.restore();
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
    this.draft?.dispose();
    this.editDraft?.dispose();
  }
}
