import { schemaVersion } from './library.ts';
import { isID, isObject } from './story.ts';

export interface NarrationStyle
{
  perspective: '' | 'first' | 'second' | 'third';
  tense: '' | 'past' | 'present';
  genre: string;
  tone: string;
  pacing: '' | 'slow' | 'balanced' | 'fast';
  length: '' | 'brief' | 'balanced' | 'detailed';
  instructions: string;
}

export interface NarrationRequest
{
  schemaVersion: number;
  epoch: string;
  adventureId: string;
}

export interface NarrationSettings extends NarrationRequest
{
  revision: number;
  style: NarrationStyle;
}

export type SaveNarration = NarrationRequest & { expectedRevision: number; style: NarrationStyle };

export function readStyle(value: unknown): NarrationStyle
{
  if (!isObject(value) || Object.keys(value).length !== 7
    || !['', 'first', 'second', 'third'].includes(value.perspective as string)
    || !['', 'past', 'present'].includes(value.tense as string)
    || !['', 'slow', 'balanced', 'fast'].includes(value.pacing as string)
    || !['', 'brief', 'balanced', 'detailed'].includes(value.length as string)
    || ![value.genre, value.tone, value.instructions].every((text, index) =>
      typeof text === 'string' && text.isWellFormed() && [...text].length <= (index === 2 ? 2000 : 200)))
    throw new Error('unsupported_narration_settings');
  return value as unknown as NarrationStyle;
}

export function readNarration(value: unknown, request: NarrationRequest): NarrationSettings
{
  if (!isObject(value) || Object.keys(value).length !== 5 || value.schemaVersion !== schemaVersion
    || value.epoch !== request.epoch || value.adventureId !== request.adventureId || !isID(value.adventureId)
    || !Number.isSafeInteger(value.revision) || Number(value.revision) < 0)
    throw new Error('unsupported_narration_settings');
  readStyle(value.style);
  return value as unknown as NarrationSettings;
}

// Stable creative guidance order; contradictions are left for the narrator to interpret.
export function narrationInstructions(value: NarrationStyle): string
{
  const style = readStyle(value);
  const lines = [
    style.perspective ? `Perspective: ${style.perspective} person.` : '',
    style.tense ? `Tense: ${style.tense}.` : '',
    style.genre.trim() ? `Genre: ${style.genre}` : '',
    style.tone.trim() ? `Tone: ${style.tone}` : '',
    style.pacing ? `Pacing: ${style.pacing}.` : '',
    style.length ? `Desired response length: ${style.length} prose (a preference, not a token limit).` : '',
    style.instructions.trim() ? `Custom style instructions:\n${style.instructions}` : ''
  ].filter(Boolean);
  return lines.length ? `Current narration settings (writing guidance only):\n${lines.join('\n')}` : '';
}
