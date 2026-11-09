import type { ForkRequest } from './fork';
import { readDraft, type Draft, type DraftRequest } from './draft';
import { readCreateResult, readCommitResult, readLibrary, readSnapshot, schemaVersion, type CreateRequest, type CommitRequest } from './library';
import { readConnections, type SaveConnections } from './models';

interface WailsRuntime
{
  Call: { ByName(name: string, ...args: unknown[]): Promise<unknown> };
}
declare global
{
  interface Window { wails?: WailsRuntime }
}

async function call(method: string, ...args: unknown[]): Promise<unknown>
{
  if (!window.wails) throw new Error('host_unavailable');
  return window.wails.Call.ByName(`main.LibraryService.${method}`, ...args);
}

export const host = {
  readConnections: async (epoch: string) => readConnections(await call('ReadConnections', { schemaVersion, epoch }), epoch),
  saveConnections: async (request: SaveConnections) => readConnections(await call('SaveConnections', request), request.epoch),
  list: async () => readLibrary(await call('List')),
  read: async (epoch: string, adventureId: string) => readSnapshot(await call('Read', { schemaVersion, epoch, adventureId })),
  create: async (request: CreateRequest) => readCreateResult(await call('Create', request)),
  fork: async (request: ForkRequest) => readCommitResult(await call('Fork', request)),
  readDraft: async (request: DraftRequest) => readDraft(await call('ReadDraft', request), request),
  saveDraft: async (request: Draft) => readDraft(await call('SaveDraft', request), request),
  deleteDraft: async (request: Draft) => { await call('DeleteDraft', request); },
  commit: async (request: CommitRequest) => readCommitResult(await call('Commit', request))
};
