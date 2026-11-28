import { isObject } from './story.ts';

export const contextSections = ['authorNotes', 'history', 'lorebook', 'playerInput'] as const;
export type ContextSection = typeof contextSections[number];

export const contextSectionLabels: Record<ContextSection, string> = {
  authorNotes: 'Author notes',
  history: 'Accepted history',
  lorebook: 'Lorebook',
  playerInput: 'Player input'
};

export const contextPresets = {
  low: { authorNotes: 1000, history: 8000, lorebook: 2500, playerInput: 2000 },
  medium: { authorNotes: 2500, history: 24000, lorebook: 7500, playerInput: 4000 },
  high: { authorNotes: 4200, history: 64000, lorebook: 16000, playerInput: 8000 }
};

export type ContextPreset = keyof typeof contextPresets | 'custom';
export type ContextLimits = Record<ContextSection, number> & { preset: ContextPreset };

export const contextPresetLabels: Record<ContextPreset, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  custom: 'Custom'
};

export const maxContextCharacters = 1000000;

export function validContextLimit(section: ContextSection, value: unknown): value is number
{
  return typeof value === 'number' && Number.isInteger(value)
    && value >= (section === 'playerInput' ? 1 : 0) && value <= maxContextCharacters;
}

export function isContextLimits(value: unknown): value is ContextLimits
{
  return isObject(value) && Object.keys(value).length === 5
    && typeof value.preset === 'string' && Object.hasOwn(contextPresetLabels, value.preset)
    && contextSections.every(section => validContextLimit(section, value[section]));
}

export const promptSeparator = '\n\n';

export function characterCount(text: string): number
{
  let count = 0;
  for (const _ of text) count++;
  return count;
}
