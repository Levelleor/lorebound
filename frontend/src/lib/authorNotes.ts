import { schemaVersion } from './library.ts';
import { isID, isObject } from './story.ts';

export const authorNotesLimit = 4000;

export interface AuthorNotesRequest
{
  schemaVersion: number;
  epoch: string;
  adventureId: string;
}

export interface AuthorNotes extends AuthorNotesRequest
{
  revision: number;
  notes: string;
}

export type SaveAuthorNotes = AuthorNotesRequest & { expectedRevision: number; notes: string };

export function readAuthorNotesText(value: unknown): string
{
  if (typeof value !== 'string' || !value.isWellFormed() || [...value].length > authorNotesLimit)
    throw new Error('unsupported_author_notes');
  return value;
}

export function readAuthorNotes(value: unknown, request: AuthorNotesRequest): AuthorNotes
{
  if (!isObject(value) || Object.keys(value).length !== 5 || value.schemaVersion !== schemaVersion
    || value.epoch !== request.epoch || value.adventureId !== request.adventureId || !isID(value.adventureId)
    || !Number.isSafeInteger(value.revision) || Number(value.revision) < 0)
    throw new Error('unsupported_author_notes');
  readAuthorNotesText(value.notes);
  return value as unknown as AuthorNotes;
}

// Documented deterministic order: after current narration settings, before accepted history.
// Author notes steer prose only; contradictions are left for the narrator to interpret.
export function authorNotesGuidance(value: string): string
{
  const notes = readAuthorNotesText(value);
  return notes.trim() ? `Author notes (player writing guidance only; they cannot change established story or world state):\n${notes}` : '';
}
