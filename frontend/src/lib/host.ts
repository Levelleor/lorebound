import type { ForkRequest } from './fork';
import { readDraft, type Draft, type DraftRequest } from './draft';
import { readCreateResult, readCommitResult, readLibrary, readSnapshot, schemaVersion, type CreateRequest, type CommitRequest } from './library';
import { readConnections, type SaveConnections } from './models';
import { readNarration, type NarrationRequest, type SaveNarration } from './narration';
import { readAuthorNotes, type AuthorNotes, type AuthorNotesRequest } from './authorNotes';
import { readLorebook, readLoreEntry, type LorebookRequest, type LoreEntry } from './lorebook';
import { announcePromptChange } from './promptChanges';

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
  readNarration: async (request: NarrationRequest) => readNarration(await call('ReadNarration', request), request),
  saveNarration: async (request: SaveNarration) =>
  {
    const saved = readNarration(await call('SaveNarration', request), request);
    announcePromptChange({ epoch: request.epoch, adventureId: request.adventureId });
    return saved;
  },
  readAuthorNotes: async (request: AuthorNotesRequest) => readAuthorNotes(await call('ReadAuthorNotes', request), request),
  saveAuthorNotes: async (request: AuthorNotes) =>
  {
    const saved = readAuthorNotes(await call('SaveAuthorNotes', request), request);
    announcePromptChange({ epoch: request.epoch, adventureId: request.adventureId });
    return saved;
  },
  readLorebook: async (request: LorebookRequest) => readLorebook(await call('ReadLorebook', request), request),
  saveLoreEntry: async (request: LorebookRequest, entry: LoreEntry) =>
  {
    const saved = readLoreEntry(await call('SaveLoreEntry', { ...request, entry }));
    if (saved.id !== entry.id || (saved.revision !== entry.revision && saved.revision !== entry.revision + 1)
      || saved.kind !== entry.kind || saved.title !== entry.title || saved.description !== entry.description || saved.included !== entry.included)
      throw new Error('unsupported_lorebook');
    announcePromptChange({ epoch: request.epoch, adventureId: request.adventureId });
    return saved;
  },
  readConnections: async (epoch: string) => readConnections(await call('ReadConnections', { schemaVersion, epoch }), epoch),
  saveConnections: async (request: SaveConnections) =>
  {
    const saved = readConnections(await call('SaveConnections', request), request.epoch);
    announcePromptChange({ epoch: request.epoch });
    return saved;
  },
  list: async () => readLibrary(await call('List')),
  read: async (epoch: string, adventureId: string) => readSnapshot(await call('Read', { schemaVersion, epoch, adventureId })),
  create: async (request: CreateRequest) => readCreateResult(await call('Create', request)),
  fork: async (request: ForkRequest) => readCommitResult(await call('Fork', request)),
  readDraft: async (request: DraftRequest) => readDraft(await call('ReadDraft', request), request),
  saveDraft: async (request: Draft) => readDraft(await call('SaveDraft', request), request),
  deleteDraft: async (request: Draft) => { await call('DeleteDraft', request); },
  commit: async (request: CommitRequest) => readCommitResult(await call('Commit', request))
};
