import type { ForkRequest } from './fork';
import { readCreateResult, readCommitResult, readLibrary, readSnapshot, schemaVersion, type CreateRequest, type CommitRequest } from './library';

interface WailsRuntime { Call: { ByName(name: string, ...args: unknown[]): Promise<unknown> } }
declare global { interface Window { wails?: WailsRuntime } }

async function call(method: string, ...args: unknown[]): Promise<unknown> {
  if (!window.wails) throw new Error('host_unavailable');
  return window.wails.Call.ByName(`main.LibraryService.${method}`, ...args);
}

export const host = {
  list: async () => readLibrary(await call('List')),
  read: async (epoch: string, adventureId: string) => readSnapshot(await call('Read', { schemaVersion, epoch, adventureId })),
  create: async (request: CreateRequest) => readCreateResult(await call('Create', request)),
  fork: async (request: ForkRequest) => readCommitResult(await call('Fork', request)),
  commit: async (request: CommitRequest) => readCommitResult(await call('Commit', request))
};
