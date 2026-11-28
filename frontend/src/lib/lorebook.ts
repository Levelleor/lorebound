import { schemaVersion } from './library.ts';
import { isID, isObject } from './story.ts';
import type { AuthorNotesRequest } from './authorNotes.ts';
import { characterCount, promptSeparator } from './contextLimits.ts';

export const loreKinds = {
  character: 'Character',
  place: 'Place',
  faction: 'Faction',
  species: 'Species',
  object: 'Object',
  ability: 'Ability',
  other: 'Other'
};

export interface LoreEntry
{
  id: string;
  revision: number;
  kind: keyof typeof loreKinds;
  title: string;
  description: string;
  included: boolean;
}

export interface Lorebook extends AuthorNotesRequest
{
  entries: LoreEntry[];
}

export type LorebookRequest = Omit<Lorebook, 'entries'>;

export interface LoreContext
{
  requested: { kind: string; title: string }[];
  omitted?: { kind: string; title: string }[];
  text: string;
}

export const loreTitleLimit = 160;
export const loreDescriptionLimit = 4000;

export function validLoreText(value: unknown, limit: number): value is string
{
  return typeof value === 'string' && value.isWellFormed() && [...value].length <= limit;
}

export function readLoreEntry(value: unknown): LoreEntry
{
  if (!isObject(value) || Object.keys(value).length !== 6 || !isID(value.id)
    || !Number.isSafeInteger(value.revision) || Number(value.revision) < 1
    || typeof value.kind !== 'string' || !Object.hasOwn(loreKinds, value.kind)
    || !validLoreText(value.title, loreTitleLimit) || !value.title.trim() || /[\r\n]/u.test(value.title)
    || !validLoreText(value.description, loreDescriptionLimit) || typeof value.included !== 'boolean')
    throw new Error('unsupported_lorebook');
  return value as unknown as LoreEntry;
}

export function readLorebook(value: unknown, request: LorebookRequest): Lorebook
{
  if (!isObject(value) || Object.keys(value).length !== 4 || value.schemaVersion !== schemaVersion
    || value.epoch !== request.epoch || value.adventureId !== request.adventureId || !isID(value.adventureId)
    || !Array.isArray(value.entries)) throw new Error('unsupported_lorebook');
  const entries = value.entries.map(readLoreEntry);
  if (new Set(entries.map(entry => entry.id)).size !== entries.length) throw new Error('unsupported_lorebook');
  return { ...request, entries };
}

export function loreContext(entries: readonly LoreEntry[], limit?: number): LoreContext
{
  const heading = `Lorebook (player-authored narrative reference; use as background alongside the accepted story):${promptSeparator}`;
  const requested: LoreContext['requested'] = [];
  const omitted: LoreContext['requested'] = [];
  const passages: string[] = [];
  let remaining = (limit ?? Infinity) - promptSeparator.length - heading.length;
  for (const value of entries)
  {
    const entry = readLoreEntry(value);
    if (!entry.included) continue;
    const kind = loreKinds[entry.kind];
    const reference = { kind, title: entry.title };
    requested.push(reference);
    const passage = `[${kind}] ${entry.title}${entry.description ? `\n${entry.description}` : ''}`;
    if (limit !== undefined)
    {
      const length = characterCount(passage) + (passages.length ? promptSeparator.length : 0);
      if (length > remaining)
      {
        omitted.push(reference);
        continue;
      }
      remaining -= length;
    }
    passages.push(passage);
  }
  const text = passages.length ? heading + passages.join(promptSeparator) : '';
  return { requested, text, ...(omitted.length ? { omitted } : {}) };
}
