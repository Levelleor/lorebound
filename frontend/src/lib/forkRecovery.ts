import { schemaVersion } from './library.ts';
import type { ForkRequest } from './fork.ts';
import { isID, isObject } from './story.ts';

export interface ForkAttempt
{
  request: ForkRequest;
  turnOrder: number;
}

export interface ForkRecovery
{
  load(sourceAdventureId: string): ForkAttempt | null;
  save(attempt: ForkAttempt): void;
  clear(attempt: ForkAttempt): void;
}

function readAttempt(value: unknown, sourceAdventureId: string): ForkAttempt
{
  const invalid = (): never => { throw new Error('invalid_fork_recovery'); };
  if (!isObject(value) || Object.keys(value).length !== 2 || !isObject(value.request)
    || !Number.isSafeInteger(value.turnOrder) || Number(value.turnOrder) < 1) return invalid();
  const request = value.request;
  const keys = ['schemaVersion', 'epoch', 'operationId', 'sourceAdventureId', 'expectedVersion', 'turnId', 'adventureId', 'title'];
  if (Object.keys(request).length !== keys.length || !keys.every(key => Object.hasOwn(request, key))
    || request.schemaVersion !== schemaVersion || request.sourceAdventureId !== sourceAdventureId
    || !isID(sourceAdventureId) || !isID(request.operationId) || !isID(request.turnId) || !isID(request.adventureId)
    || request.adventureId === sourceAdventureId || typeof request.epoch !== 'string' || !request.epoch
    || !Number.isSafeInteger(request.expectedVersion) || Number(request.expectedVersion) < Number(value.turnOrder)
    || typeof request.title !== 'string' || !request.title.isWellFormed() || !request.title.trim()
    || [...request.title].length > 160) return invalid();
  return { request: Object.freeze(request as unknown as ForkRequest), turnOrder: Number(value.turnOrder) };
}

// Only the immutable transport request and its receipt boundary survive reload.
export class SessionForkRecovery implements ForkRecovery
{
  private readonly storage: () => Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

  constructor(storage: () => Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>)
  {
    this.storage = storage;
  }

  private key(sourceAdventureId: string): string
  {
    return `lorebound:pending-fork:${sourceAdventureId}`;
  }

  load(sourceAdventureId: string): ForkAttempt | null
  {
    const encoded = this.storage().getItem(this.key(sourceAdventureId));
    if (encoded === null) return null;
    if (encoded.length > 8000) throw new Error('invalid_fork_recovery');
    const record: unknown = JSON.parse(encoded);
    if (!isObject(record) || Object.keys(record).length !== 2 || record.version !== 1) throw new Error('invalid_fork_recovery');
    return readAttempt(record.attempt, sourceAdventureId);
  }

  save(attempt: ForkAttempt): void
  {
    readAttempt(attempt, attempt.request.sourceAdventureId);
    const existing = this.load(attempt.request.sourceAdventureId);
    if (existing && JSON.stringify(existing) !== JSON.stringify(attempt)) throw new Error('fork_recovery_conflict');
    const encoded = JSON.stringify({ version: 1, attempt });
    if (encoded.length > 8000) throw new Error('invalid_fork_recovery');
    const storage = this.storage();
    storage.setItem(this.key(attempt.request.sourceAdventureId), encoded);
    if (storage.getItem(this.key(attempt.request.sourceAdventureId)) !== encoded) throw new Error('fork_recovery_unavailable');
  }

  clear(attempt: ForkAttempt): void
  {
    const existing = this.load(attempt.request.sourceAdventureId);
    if (!existing) return;
    if (JSON.stringify(existing) !== JSON.stringify(attempt)) throw new Error('fork_recovery_conflict');
    const storage = this.storage();
    storage.removeItem(this.key(attempt.request.sourceAdventureId));
    if (storage.getItem(this.key(attempt.request.sourceAdventureId)) !== null) throw new Error('fork_recovery_unavailable');
  }
}
