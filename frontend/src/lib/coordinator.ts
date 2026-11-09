import { readCommitResult, readSnapshot, schemaVersion, type CommitRequest, type CommitResult, type EditRequest, type Library, type Snapshot } from './library.ts';
import { documentToText, plainTextToDocument, reconstruct, type Projection, type Turn } from './story.ts';
import { TextDraft, type DraftStatus, type DraftStorage } from './draft.ts';
import { TextHistory, type TextSelection } from './textHistory.ts';
import type { SaveRecovery } from './saveRecovery.ts';

export interface GenerationInput
{
  input: string;
  history: string[];
}
export type Generator = (request: GenerationInput, signal: AbortSignal, onProgress?: (text: string) => void) => Promise<string>;
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
  phase: 'idle' | 'generating' | 'ready' | 'undo-ready' | 'editing' | 'edit-ready' | 'edit-conflict' | 'discarding-edit' | 'saving' | 'uncertain' | 'blocked' | 'recovery-blocked';
  recovery: { summary: string; text: string } | null;
  edit: { turnId: string; passageId: string; order: number; source: 'authored' | 'generated'; text: string; draftStatus: DraftStatus; draftError: string; canUndo: boolean; canRedo: boolean; composing: boolean } | null;
  candidate: Turn | null;
  preview: string;
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
  recoveryStorage?: SaveRecovery;
  generate?: Generator;
  generationError?: (cause: unknown) => string;
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
  const position = target?.passages.findIndex(passage => passage.id === request.passageId) ?? -1;
  if (!target || position < 0) throw new Error('invalid_edit_target');
  return snapshot.turns.filter(turn => request.later === 'keep' || turn.order <= target.order)
    .map(turn => turn.id !== target.id ? turn : {
      ...turn,
      passages: turn.passages.filter((_passage, index) => request.later === 'keep' || index <= position)
        .map(passage => passage.id === request.passageId ? { ...passage, body: request.body } : passage)
    });
}

function assertRecoveredSave(snapshot: Snapshot, request: CommitRequest): void
{
  let applied: boolean;
  if (request.kind === 'append_story_turn')
  {
    applied = JSON.stringify(snapshot.turns.at(-1)) === JSON.stringify(request.turn);
  }
  else if (request.kind === 'undo_story_turn')
  {
    applied = !snapshot.turns.some(turn => turn.id === request.turnId);
  }
  else
  {
    const turn = snapshot.turns.find(turn => turn.id === request.turnId);
    const passage = turn?.passages.find(passage => passage.id === request.passageId);
    applied = Boolean(passage && passage.source === (request.kind === 'edit_authored_passage' ? 'authored' : 'generated')
      && JSON.stringify(passage.body) === JSON.stringify(request.body)
      && (request.later === 'keep' || (snapshot.turns.at(-1)?.id === turn?.id && turn?.passages.at(-1)?.id === passage.id)));
  }
  if (!applied) throw new Error('inconsistent_commit_read');
}

export class StoryCoordinator
{
  state: CoordinatorState;
  private readonly storage: StoryStorage;
  private readonly generator: Generator;
  private readonly generationError: (cause: unknown) => string;
  private readonly newId: () => string;
  private readonly changed: (state: CoordinatorState) => void;
  private sequence = 0;
  private disposed = false;
  private abort: AbortController | null = null;
  private pending: CommitRequest | null = null;
  private readonly recoveryStorage?: SaveRecovery;
  private recovered = false;
  private draftFlushed = false;
  private refreshRequested = false;
  readonly draft: TextDraft | null;
  private readonly draftEpoch: string;
  private readonly draftStorage?: DraftStorage;
  editDraft: TextDraft | null = null;
  private editHistory: TextHistory | null = null;

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
      preview: '',
      undoTurn: null,
      recovery: null,
      notice: '',
      error: projection.error,
      refreshing: false,
      draftStatus: dependencies.draftStorage ? 'loading' : 'unsaved',
      draftError: ''
    };
    this.storage = dependencies.storage;
    this.generator = dependencies.generate ?? simulatedGeneration;
    this.generationError = dependencies.generationError ?? (() => 'The response could not be prepared. Your text is retained; send it again when ready.');
    this.newId = dependencies.newId ?? (() => crypto.randomUUID());
    this.changed = dependencies.onChange ?? (() => {});
    this.draftEpoch = source.epoch;
    this.draftStorage = dependencies.draftStorage;
    this.recoveryStorage = dependencies.recoveryStorage;
    this.draft = dependencies.draftStorage ? new TextDraft(source.epoch, source.adventure.id,
      dependencies.draftStorage,
      input =>
      {
        if (this.state.phase === 'idle') this.update({ input });
      },
      (draftStatus, draftError) => this.update({ draftStatus, draftError })) : null;
    this.restoreSave();
  }

  restoreSave(): void
  {
    if (this.disposed || this.pending || !['idle', 'blocked', 'recovery-blocked'].includes(this.state.phase)) return;
    try
    {
      const request = this.recoveryStorage?.load(this.state.snapshot.adventure.id);
      if (request)
      {
        this.pending = frozenCopy(request);
        this.recovered = true;
        this.draftFlushed = true;
        const appended = request.kind === 'append_story_turn';
        const summary = appended ? 'Story turn acceptance'
          : request.kind === 'undo_story_turn' ? 'Committed turn Undo'
          : `Passage edit · ${request.later === 'keep' ? 'Keep Later Turns' : 'Delete All After Point'}`;
        const text = appended ? request.turn.passages.map(passage => documentToText(passage.body)).join('\n\n')
          : request.kind === 'undo_story_turn' ? '' : documentToText(request.body);
        this.update({ phase: 'uncertain', recovery: { summary, text },
          error: 'A previously confirmed save needs checking. Recover the same save before continuing; the saved story may already include it.' });
        return;
      }
      this.update({ phase: this.state.projection.blocked ? 'blocked' : 'idle', error: this.state.projection.error });
      if (this.state.phase === 'idle') void this.draft?.restore();
    }
    catch
    {
      this.update({ phase: 'recovery-blocked', error: 'The saved recovery record could not be read. Restore browser session storage access or use a compatible app version, then retry recovery. Story writes are blocked to protect an unresolved save.' });
    }
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
    this.update({ input, error: '', notice: '', recovery: null });
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
    const turn = this.state.snapshot.turns.find(turn => turn.passages.some(passage => passage.id === passageId));
    if (!turn) return;
    const passage = turn.passages.find(passage => passage.id === passageId)!;
    const text = documentToText(passage.body);
    this.editHistory = new TextHistory(text);
    this.update({ phase: 'editing', error: '', notice: '', recovery: null, edit: {
      turnId: turn.id, passageId, order: turn.order, source: passage.source, text,
      draftStatus: this.draftStorage ? 'loading' : 'unsaved', draftError: '',
      canUndo: false, canRedo: false, composing: false
    } });
    if (!this.draftStorage) return;
    this.editDraft = new TextDraft(this.state.snapshot.epoch, this.state.snapshot.adventure.id, this.draftStorage,
      text =>
      {
        if (this.state.phase !== 'editing') return;
        if (text !== this.state.edit?.text)
        {
          this.editHistory = new TextHistory(text);
          this.updateEdit({ text, canUndo: false, canRedo: false, composing: false });
        }
      },
      (draftStatus, draftError) => this.updateEdit({ draftStatus, draftError }),
      600, `passage:${passageId}`, text);
    await this.editDraft.restore();
  }

  private updateEdit(next: Partial<NonNullable<CoordinatorState['edit']>>): void
  {
    if (this.state.edit) this.update({ edit: { ...this.state.edit, ...next } });
  }

  selectEditText(selection: TextSelection): void
  {
    if (!this.canEditText || this.state.edit?.composing) return;
    this.editHistory?.select(selection);
  }

  private get canEditText(): boolean
  {
    return !this.disposed && this.state.phase === 'editing' && this.state.edit?.draftStatus !== 'loading';
  }

  setEditText(text: string, selection: TextSelection = { start: text.length, end: text.length, direction: 'none' }): void
  {
    if (!this.canEditText) return;
    if (!this.state.edit?.composing) this.editHistory?.record(text, selection);
    this.updateEdit({ text, canUndo: !this.state.edit?.composing && (this.editHistory?.canUndo ?? false), canRedo: !this.state.edit?.composing && (this.editHistory?.canRedo ?? false) });
    this.editDraft?.edit(text);
    this.update({ error: '' });
  }

  beginEditComposition(selection: TextSelection): void
  {
    if (!this.canEditText) return;
    this.selectEditText(selection);
    this.editDraft?.pauseRestore();
    this.updateEdit({ composing: true, canUndo: false, canRedo: false });
  }

  endEditComposition(text: string, selection: TextSelection): void
  {
    if (!this.canEditText || !this.state.edit?.composing) return;
    this.updateEdit({ composing: false });
    this.setEditText(text, selection);
  }

  moveEditHistory(direction: 'undo' | 'redo'): TextSelection | null
  {
    if (!this.canEditText || this.state.edit?.composing) return null;
    const entry = this.editHistory?.move(direction);
    if (!entry) return null;
    this.updateEdit({ text: entry.text, canUndo: this.editHistory!.canUndo, canRedo: this.editHistory!.canRedo });
    this.editDraft?.edit(entry.text);
    this.update({ error: '' });
    return entry.selection;
  }

  reviewEdit(): void
  {
    if (!this.canEditText || !this.state.edit || this.state.edit.composing) return;
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
      this.editHistory = null;
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
      kind: edit.source === 'authored' ? 'edit_authored_passage' : 'edit_generated_passage', turnId: edit.turnId, passageId: edit.passageId,
      body: plainTextToDocument(edit.text), later
    };
    const proposed = readSnapshot({ ...this.state.snapshot,
      adventure: { ...this.state.snapshot.adventure, version: request.expectedVersion + 1 },
      turns: editedTurns(this.state.snapshot, request) });
    if (reconstruct(proposed).blocked) return;
    this.editHistory = null;
    this.updateEdit({ canUndo: false, canRedo: false, composing: false });
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
    const target = snapshot.turns.find(turn => turn.passages.some(passage => passage.id === this.state.edit?.passageId));
    const ready = target && !this.state.error && !this.state.projection.blocked && snapshot.epoch === this.draftEpoch;
    if (ready && this.state.edit) this.editHistory = new TextHistory(this.state.edit.text);
    this.update({ refreshing: false, phase: ready ? 'editing' : 'edit-conflict',
      error: ready ? 'Review your retained edit against the current story, then confirm a new decision.'
        : 'The edit target is unavailable or the library changed. Your text is retained for copying.' });
  }

  closeConflictedEdit(): void
  {
    if (this.disposed || this.state.phase !== 'edit-conflict' || this.state.refreshing) return;
    this.editDraft?.dispose();
    this.editDraft = null;
    this.editHistory = null;
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
    this.update({ phase: 'undo-ready', undoTurn: { id: turn.id, order: turn.order }, error: '', notice: '', recovery: null });
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
    this.update({ phase: 'generating', candidate: null, preview: '', error: '', notice: '', recovery: null });
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
      }, this.abort.signal, preview =>
      {
        if (this.live(sequence) && this.state.phase === 'generating') this.update({ preview });
      });
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
      this.update({ phase: 'ready', candidate: frozenCopy(candidate), preview: '' });
    }
    catch (cause)
    {
      if (this.live(sequence)) this.update({
        phase: 'idle',
        candidate: null,
        preview: '',
        error: this.generationError(cause)
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
    this.update({ phase: 'idle', candidate: null, preview: '', error: '', notice: 'Generation stopped. Uncommitted output was discarded.' });
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

  private clearPending(): boolean
  {
    try
    {
      if (this.pending) this.recoveryStorage?.clear(this.pending);
      this.pending = null;
      return true;
    }
    catch
    {
      this.update({ phase: 'uncertain', error: 'The save result is available, but its recovery record could not be cleared. Restore browser session storage access, then recover the same save before continuing.' });
      return false;
    }
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
        if (this.editDraft)
        {
          await this.editDraft.flush();
          if (!this.live(sequence)) return;
        }
        this.draftFlushed = true;
      }
      // Record the immutable confirmed request before any canonical dispatch.
      try
      {
        this.recoveryStorage?.save(request);
      }
      catch
      {
        this.update({ phase: 'uncertain', error: 'Save recovery could not be stored in this browser session. Restore session storage access or free space, then recover the same save. No new save was sent by this attempt.' });
        return;
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
      if (snapshot.adventure.version === result.version)
      {
        if (this.recovered) assertRecoveredSave(snapshot, request);
        else
        {
          const expectedTurns = appended ? [...this.state.snapshot.turns, request.turn]
            : request.kind !== 'undo_story_turn' ? editedTurns(this.state.snapshot, request)
            : this.state.snapshot.turns.slice(0, -1);
          if (JSON.stringify(snapshot.turns) !== JSON.stringify(expectedTurns)) throw new Error('inconsistent_commit_read');
        }
      }
      const projection = reconstruct(snapshot);
      if (!this.clearPending()) return;
      const recovered = this.recovered;
      this.recovered = false;
      if (appended && !recovered) this.draft?.consumed();
      if (!appended && request.kind !== 'undo_story_turn')
      {
        this.editDraft?.consumed();
        this.editDraft?.dispose();
        this.editDraft = null;
        this.editHistory = null;
      }
      const wasRemoved = appended && !snapshot.turns.some(turn => turn.id === result.turnId);
      const notice = appended
        ? wasRemoved ? 'The original save is confirmed. Its turn was later undone; the current story is shown.' : ''
        : request.kind !== 'undo_story_turn' ? 'Passage edit confirmed. The current saved story is shown.'
        : `Undo confirmed. Continuing from ${snapshot.turns.length ? `Turn ${snapshot.turns.length}` : 'the initial beginning'}.`;
      this.update({
        snapshot: frozenCopy(snapshot),
        projection,
        input: appended ? '' : this.state.input,
        candidate: null,
        undoTurn: null,
        edit: null,
        recovery: null,
        notice,
        phase: projection.blocked ? 'blocked' : 'idle',
        error: projection.error
      });
      if (recovered && !projection.blocked) await this.draft?.restore();
    }
    catch (cause)
    {
      if (!this.live(sequence)) return;
      const reason = String(cause);
      if (!committed && (reason.includes('stale_version') || reason.includes('wrong_epoch')))
      {
        if (!this.clearPending()) return;
        this.recovered = false;
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
        if (!this.clearPending()) return;
        this.recovered = false;
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
    this.editHistory = null;
  }
}
