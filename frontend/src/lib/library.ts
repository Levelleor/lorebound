import { isID, isObject, readTurns, type Turn } from './story.ts';

export const schemaVersion = 3;
export const baselineSchemaVersion = 1;
export interface Adventure { id: string; title: string; version: number }
export interface Baseline { schemaVersion: number }
export interface Library { schemaVersion: number; epoch: string; adventures: Adventure[] }
export interface Snapshot { schemaVersion: number; epoch: string; adventure: Adventure; baseline: Baseline; turns: Turn[] }
export interface CreateRequest { schemaVersion: number; epoch: string; operationId: string; adventureId: string; title: string; baseline: Baseline }
export interface CreateResult { snapshot: Snapshot; replayed: boolean }
interface CommitBase
{
  schemaVersion: number; epoch: string; operationId: string; adventureId: string;
  expectedVersion: number;
}
export interface AppendRequest extends CommitBase
{
  kind: 'append_story_turn';
  turn: Turn;
}
export interface UndoRequest extends CommitBase
{
  kind: 'undo_story_turn';
  turnId: string;
}
export type CommitRequest = AppendRequest | UndoRequest;
export interface CommitResult {
  schemaVersion: number; epoch: string; adventureId: string; operationId: string;
  version: number; turnId: string; replayed: boolean;
}

// Domain defaults and intent are prepared in TypeScript; Go owns durable integrity.
export function prepareCreate(epoch: string, title: string, adventureId: string, operationId: string): CreateRequest {
  const normalized = title.trim() || 'Untitled Adventure';
  if ([...normalized].length > 160) throw new Error('title_too_long');
  return { schemaVersion, epoch, operationId, adventureId, title: normalized, baseline: { schemaVersion: baselineSchemaVersion } };
}

function adventure(value: unknown): value is Adventure {
  return isObject(value) && isID(value.id) && typeof value.title === 'string' && Number.isSafeInteger(value.version) && Number(value.version) >= 0;
}
function envelope(value: unknown): value is Record<string, unknown> {
  return isObject(value) && value.schemaVersion === schemaVersion && typeof value.epoch === 'string' && value.epoch.length > 0;
}
export function readLibrary(value: unknown): Library {
  if (!envelope(value) || !Array.isArray(value.adventures) || !value.adventures.every(adventure)) throw new Error('unsupported_library_response');
  return value as unknown as Library;
}
export function readSnapshot(value: unknown): Snapshot {
  if (!envelope(value) || !adventure(value.adventure) || !isObject(value.baseline) || value.baseline.schemaVersion !== baselineSchemaVersion) throw new Error('unsupported_library_response');
  readTurns(value.turns, value.adventure.version);
  return value as unknown as Snapshot;
}
export function readCreateResult(value: unknown): CreateResult {
  if (!isObject(value) || typeof value.replayed !== 'boolean') throw new Error('unsupported_library_response');
  return { snapshot: readSnapshot(value.snapshot), replayed: value.replayed };
}
export function readCommitResult(value: unknown): CommitResult {
  if (!envelope(value) || !isID(value.adventureId) || !isID(value.operationId) || !isID(value.turnId) || !Number.isSafeInteger(value.version) || Number(value.version) < 1 || typeof value.replayed !== 'boolean') throw new Error('unsupported_commit_response');
  return value as unknown as CommitResult;
}
