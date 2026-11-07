import { readCommitResult, readSnapshot, schemaVersion, type CommitResult, type Snapshot } from './library.ts';
import { isID, reconstruct } from './story.ts';

export interface ForkRequest
{
  schemaVersion: number;
  epoch: string;
  operationId: string;
  sourceAdventureId: string;
  expectedVersion: number;
  turnId: string;
  adventureId: string;
  title: string;
}
export type ForkResult = CommitResult;
export interface ForkStorage
{
  fork(request: ForkRequest): Promise<ForkResult>;
  read(epoch: string, adventureId: string): Promise<Snapshot>;
}
export interface ForkState
{
  phase: 'editing' | 'saving' | 'uncertain' | 'rejected' | 'complete';
  error: string;
}

export function defaultForkTitle(sourceTitle: string): string
{
  return [...`fork: ${sourceTitle}`].slice(0, 160).join('');
}

export function prepareFork(source: Snapshot, turnId: string, title: string, adventureId: string, operationId: string): ForkRequest
{
  readSnapshot(source);
  const normalized = title.trim() || 'Untitled Fork';
  if (!normalized.isWellFormed() || [...normalized].length > 160) throw new Error('invalid_fork_title');
  if (reconstruct(source).blocked || !source.turns.some(turn => turn.id === turnId)
    || !isID(adventureId) || !isID(operationId) || adventureId === source.adventure.id) throw new Error('invalid_fork_boundary');
  return Object.freeze({
    schemaVersion,
    epoch: source.epoch,
    operationId,
    sourceAdventureId: source.adventure.id,
    expectedVersion: source.adventure.version,
    turnId,
    adventureId,
    title: normalized
  });
}

export class ForkController
{
  state: ForkState = { phase: 'editing', error: '' };
  private readonly source: Snapshot;
  private readonly storage: ForkStorage;
  private readonly changed: (state: ForkState) => void;
  private readonly newId: () => string;
  private pending: ForkRequest | null = null;
  private disposed = false;

  constructor(source: Snapshot, storage: ForkStorage, changed: (state: ForkState) => void,
    newId: () => string = () => crypto.randomUUID())
  {
    this.source = structuredClone(readSnapshot(source));
    this.storage = storage;
    this.changed = changed;
    this.newId = newId;
  }

  private update(phase: ForkState['phase'], error = ''): void
  {
    if (this.disposed) return;
    this.state = { phase, error };
    this.changed(this.state);
  }

  async submit(turnId: string, title: string): Promise<Snapshot | null>
  {
    if (this.disposed || (this.state.phase !== 'editing' && this.state.phase !== 'uncertain')) return null;
    try
    {
      this.pending ??= prepareFork(this.source, turnId, title, this.newId(), this.newId());
    }
    catch
    {
      this.update('editing', 'This turn could not be prepared for forking. Reload the story and try again.');
      return null;
    }
    const request = this.pending;
    this.update('saving');
    let copied = false;
    try
    {
      const result = readCommitResult(await this.storage.fork(request));
      if (this.disposed) return null;
      const boundary = this.source.turns.find(turn => turn.id === request.turnId)!;
      if (result.epoch !== request.epoch || result.operationId !== request.operationId
        || result.adventureId !== request.adventureId || result.turnId !== request.turnId
        || result.version !== boundary.order) throw new Error('inconsistent_fork_receipt');
      copied = true;
      // A recovered receipt may predate later destination commits.
      const snapshot = readSnapshot(await this.storage.read(request.epoch, request.adventureId));
      if (this.disposed) return null;
      if (snapshot.epoch !== request.epoch || snapshot.adventure.id !== request.adventureId
        || snapshot.adventure.version < result.version || reconstruct(snapshot).blocked
        || (snapshot.adventure.version === result.version
          && JSON.stringify(snapshot.turns) !== JSON.stringify(this.source.turns.slice(0, result.version)))) throw new Error('inconsistent_fork_read');
      this.pending = null;
      this.update('complete');
      return snapshot;
    }
    catch (cause)
    {
      if (this.disposed) return null;
      if (!copied && /stale_version|wrong_epoch|invalid_request|operation_id_conflict|adventure_exists|adventure_not_found|unsupported_history|unsupported_library/.test(String(cause)))
      {
        this.pending = null;
        this.update('rejected', 'The fork was rejected. Review the reloaded story before choosing a fresh fork.');
      }
      else
      {
        this.update('uncertain', 'The fork could not be confirmed. Recover the same fork before continuing to avoid creating a duplicate.');
      }
      return null;
    }
  }

  dispose(): void
  {
    this.disposed = true;
  }
}
