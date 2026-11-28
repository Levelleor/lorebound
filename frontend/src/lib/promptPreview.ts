import type { GenerationInput } from './coordinator.ts';
import type { LoreEntry } from './lorebook.ts';
import type { ModelProfile } from './models.ts';
import type { NarrationStyle } from './narration.ts';
import { prepareLocalStoryPrompt, type StoryPromptSection } from './storyPrompt.ts';

const labels: Record<StoryPromptSection, string> = {
  systemStyle: 'System & style',
  authorNotes: 'Author notes',
  lorebook: 'Lorebook',
  history: 'Recent story',
  playerInput: 'Player input'
};

const encoder = new TextEncoder();

export function previewStoryPrompt(profile: ModelProfile, input: GenerationInput, style: NarrationStyle, notes: string, entries: readonly LoreEntry[])
{
  const { sections, context, lorebook } = prepareLocalStoryPrompt(input, style, notes, entries, profile.contextLimits);
  const rows = (Object.keys(labels) as StoryPromptSection[]).filter(section => sections[section]).map(section => ({
    section,
    label: labels[section],
    tokens: Math.ceil(encoder.encode(sections[section]).length / 4)
  }));
  const total = rows.reduce((sum, row) => sum + row.tokens, 0);
  const { contextWindowTokens: capacity, replyReserveTokens: replyAllowance } = profile;
  const overBy = capacity === undefined ? 0 : Math.max(0, total + (replyAllowance ?? 0) - capacity);
  return { rows, total, capacity, replyAllowance, overBy, context, skippedLore: lorebook?.omitted ?? [] };
}
