export const schemaVersion = 1;
export interface Adventure { id: string; title: string; version: number }
export interface Baseline { schemaVersion: number }
export interface Library { schemaVersion: number; epoch: string; adventures: Adventure[] }
export interface Snapshot { schemaVersion: number; epoch: string; adventure: Adventure; baseline: Baseline }
export interface CreateRequest { schemaVersion: number; epoch: string; operationId: string; adventureId: string; title: string; baseline: Baseline }
export interface CreateResult { snapshot: Snapshot; replayed: boolean }

// Domain defaults and intent are prepared in TypeScript; Go owns durable integrity.
export function prepareCreate(epoch: string, title: string, adventureId: string, operationId: string): CreateRequest {
  const normalized = title.trim() || 'Untitled Adventure';
  if ([...normalized].length > 160) throw new Error('title_too_long');
  return { schemaVersion, epoch, operationId, adventureId, title: normalized, baseline: { schemaVersion } };
}

function object(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
function adventure(value: unknown): value is Adventure {
  return object(value) && typeof value.id === 'string' && value.id.length > 0 && typeof value.title === 'string' && Number.isSafeInteger(value.version) && Number(value.version) >= 0;
}
function envelope(value: unknown): value is Record<string, unknown> {
  return object(value) && value.schemaVersion === schemaVersion && typeof value.epoch === 'string' && value.epoch.length > 0;
}
export function readLibrary(value: unknown): Library {
  if (!envelope(value) || !Array.isArray(value.adventures) || !value.adventures.every(adventure)) throw new Error('unsupported_library_response');
  return value as unknown as Library;
}
export function readSnapshot(value: unknown): Snapshot {
  if (!envelope(value) || !adventure(value.adventure) || !object(value.baseline) || value.baseline.schemaVersion !== schemaVersion) throw new Error('unsupported_library_response');
  return value as unknown as Snapshot;
}
export function readCreateResult(value: unknown): CreateResult {
  if (!object(value) || typeof value.replayed !== 'boolean') throw new Error('unsupported_library_response');
  return { snapshot: readSnapshot(value.snapshot), replayed: value.replayed };
}
