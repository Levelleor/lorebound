import { schemaVersion, type CommitRequest } from './library.ts';
import { isID, isObject, readDocument, readTurns } from './story.ts';

export interface SaveRecovery
{
  load(adventureId: string): CommitRequest | null;
  save(request: CommitRequest): void;
  clear(request: CommitRequest): void;
}

function readRequest(value: unknown, adventureId: string): CommitRequest
{
  const invalid = (): never => { throw new Error('invalid_save_recovery'); };
  if (!isObject(value) || value.schemaVersion !== schemaVersion || value.adventureId !== adventureId
    || !isID(adventureId) || !isID(value.operationId) || typeof value.epoch !== 'string' || !value.epoch
    || !Number.isSafeInteger(value.expectedVersion) || Number(value.expectedVersion) < 0
    || Number(value.expectedVersion) >= Number.MAX_SAFE_INTEGER) return invalid();

  const keys = ['schemaVersion', 'epoch', 'operationId', 'adventureId', 'expectedVersion', 'kind'];
  if (value.kind === 'append_story_turn')
  {
    keys.push('turn');
    if (!isObject(value.turn) || !Number.isSafeInteger(value.turn.order) || Number(value.turn.order) < 1
      || Number(value.turn.order) > Number(value.expectedVersion) + 1) return invalid();
    const turn = readTurns([{ ...value.turn, order: 1 }], 1)[0];
    if (turn.passages.length !== 2 || turn.events.length) return invalid();
  }
  else if (value.kind === 'undo_story_turn')
  {
    keys.push('turnId');
    if (!isID(value.turnId)) return invalid();
  }
  else if (value.kind === 'edit_authored_passage' || value.kind === 'edit_generated_passage')
  {
    keys.push('turnId', 'passageId', 'body', 'later');
    if (!isID(value.turnId) || !isID(value.passageId) || !['keep', 'truncate'].includes(String(value.later))) return invalid();
    readDocument(value.body);
  }
  else return invalid();
  if (Object.keys(value).length !== keys.length || !keys.every(key => Object.hasOwn(value, key))) return invalid();
  return value as unknown as CommitRequest;
}

// A transport journal for one confirmed request, never a browser copy of canon.
export class SessionSaveRecovery implements SaveRecovery
{
  private readonly storage: () => Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

  constructor(storage: () => Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>)
  {
    this.storage = storage;
  }

  private key(adventureId: string): string
  {
    return `lorebound:pending-story-save:${adventureId}`;
  }

  load(adventureId: string): CommitRequest | null
  {
    const encoded = this.storage().getItem(this.key(adventureId));
    if (encoded === null) return null;
    if (encoded.length > 1000000) throw new Error('invalid_save_recovery');
    const record: unknown = JSON.parse(encoded);
    if (!isObject(record) || Object.keys(record).length !== 2 || record.version !== 1) throw new Error('invalid_save_recovery');
    return readRequest(record.request, adventureId);
  }

  save(request: CommitRequest): void
  {
    readRequest(request, request.adventureId);
    const existing = this.load(request.adventureId);
    if (existing && JSON.stringify(existing) !== JSON.stringify(request)) throw new Error('save_recovery_conflict');
    const encoded = JSON.stringify({ version: 1, request });
    const storage = this.storage();
    storage.setItem(this.key(request.adventureId), encoded);
    if (storage.getItem(this.key(request.adventureId)) !== encoded) throw new Error('save_recovery_unavailable');
  }

  clear(request: CommitRequest): void
  {
    const existing = this.load(request.adventureId);
    if (!existing) return;
    if (JSON.stringify(existing) !== JSON.stringify(request)) throw new Error('save_recovery_conflict');
    const storage = this.storage();
    storage.removeItem(this.key(request.adventureId));
    if (storage.getItem(this.key(request.adventureId)) !== null) throw new Error('save_recovery_unavailable');
  }
}
