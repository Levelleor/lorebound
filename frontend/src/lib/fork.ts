import { readCommitResult, readSnapshot, schemaVersion, type CommitResult, type Snapshot } from './library.ts';
import { isID, reconstruct } from './story.ts';
import type { ForkAttempt, ForkRecovery } from './forkRecovery.ts';

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
  phase: 'editing' | 'saving' | 'uncertain' | 'blocked' | 'rejected' | 'complete';
  error: string;
  turnId: string;
  turnOrder: number;
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
  state: ForkState = { phase: 'editing', error: '', turnId: '', turnOrder: 0 };
  private readonly source: Snapshot;
  private readonly storage: ForkStorage;
  private readonly changed: (state: ForkState) => void;
  private readonly newId: () => string;
  private readonly recovery: ForkRecovery | undefined;
  private pending: ForkAttempt | null = null;
  private restored = false;
  private disposed = false;

  constructor(source: Snapshot, storage: ForkStorage, changed: (state: ForkState) => void,
    newId: () => string = () => crypto.randomUUID(), recovery?: ForkRecovery)
  {
    this.source = structuredClone(readSnapshot(source));
    this.storage = storage;
    this.changed = changed;
    this.newId = newId;
    this.recovery = recovery;
  }

  private update(phase: ForkState['phase'], error = ''): void
  {
    if (this.disposed) return;
    this.state = {
      phase, error,
      turnId: this.pending?.request.turnId ?? this.state.turnId,
      turnOrder: this.pending?.turnOrder ?? this.state.turnOrder
    };
    this.changed(this.state);
  }

  restore(): void
  {
    if (this.disposed || (this.state.phase !== 'editing' && this.state.phase !== 'blocked')) return;
    try
    {
      const stored = this.recovery?.load(this.source.adventure.id);
      if (stored && this.pending && JSON.stringify(stored) !== JSON.stringify(this.pending)) throw new Error('fork_recovery_conflict');
      this.pending ??= stored ?? null;
      this.restored = Boolean(this.pending);
      this.update(this.pending ? 'uncertain' : 'editing', this.pending
        ? 'A previous fork needs confirmation. Recover the same fork before continuing.' : '');
    }
    catch
    {
      this.update('blocked', 'Fork recovery is unavailable. Restore access to this tab’s session storage, then retry.');
    }
  }

  private clearPending(): boolean
  {
    try
    {
      if (this.pending) this.recovery?.clear(this.pending);
      this.pending = null;
      return true;
    }
    catch
    {
      this.update('blocked', 'The fork result could not be cleared from recovery. Restore session storage access, then retry.');
      return false;
    }
  }

  async submit(turnId: string, title: string): Promise<Snapshot | null>
  {
    if (this.disposed || (this.state.phase !== 'editing' && this.state.phase !== 'uncertain')) return null;
    try
    {
      this.pending ??= {
        request: prepareFork(this.source, turnId, title, this.newId(), this.newId()),
        turnOrder: this.source.turns.find(turn => turn.id === turnId)!.order
      };
    }
    catch
    {
      this.update('editing', 'This turn could not be prepared for forking. Reload the story and try again.');
      return null;
    }
    const attempt = this.pending;
    const request = attempt.request;
    try
    {
      this.recovery?.save(attempt);
    }
    catch
    {
      this.update('blocked', 'The fork request could not be saved for recovery. Restore session storage access, then retry.');
      return null;
    }
    this.update('saving');
    let copied = false;
    try
    {
      const result = readCommitResult(await this.storage.fork(request));
      if (this.disposed) return null;
      if (result.epoch !== request.epoch || result.operationId !== request.operationId
        || result.adventureId !== request.adventureId || result.turnId !== request.turnId
        || result.version !== attempt.turnOrder) throw new Error('inconsistent_fork_receipt');
      copied = true;
      // A recovered receipt may predate later destination commits.
      const snapshot = readSnapshot(await this.storage.read(request.epoch, request.adventureId));
      if (this.disposed) return null;
      if (snapshot.epoch !== request.epoch || snapshot.adventure.id !== request.adventureId
        || snapshot.adventure.version < result.version || reconstruct(snapshot).blocked
        || (snapshot.adventure.version === result.version
          && (snapshot.turns.length !== attempt.turnOrder || snapshot.turns.at(-1)?.id !== request.turnId))
        || (snapshot.adventure.version === result.version
          && (!this.restored || (this.source.epoch === request.epoch && this.source.adventure.version === request.expectedVersion))
          && JSON.stringify(snapshot.turns) !== JSON.stringify(this.source.turns.slice(0, result.version)))) throw new Error('inconsistent_fork_read');
      if (!this.clearPending()) return null;
      this.update('complete');
      return snapshot;
    }
    catch (cause)
    {
      if (this.disposed) return null;
      if (!copied && /stale_version|wrong_epoch|invalid_request|operation_id_conflict|adventure_exists|adventure_not_found|unsupported_history|unsupported_library/.test(String(cause)))
      {
        if (!this.clearPending()) return null;
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
