import { characterCount, promptSeparator, type ContextLimits, type ContextSection } from './contextLimits.ts';
import type { GenerationInput } from './coordinator.ts';
import { loreContext, type LoreEntry } from './lorebook.ts';
import { authorNotesGuidance } from './authorNotes.ts';
import { narrationInstructions, type NarrationStyle } from './narration.ts';

export type StoryPromptSection = 'systemStyle' | ContextSection;

export interface StoryContextReport
{
  limits: ContextLimits;
  counts: Record<ContextSection, number>;
  historyTrimmed: boolean;
  blocked: ContextSection | null;
}

const instructions = 'Continue the player’s fiction as narrative prose. Return only the next continuation. Do not call tools or change application state.';
const historyHeading = `Accepted story so far:${promptSeparator}`;

function prepareHistory(passages: readonly string[], limit?: number): { text: string; trimmed: boolean }
{
  if (!passages.length) return { text: '', trimmed: false };
  if (limit === undefined) return { text: historyHeading + passages.join(promptSeparator), trimmed: false };

  let remaining = limit - historyHeading.length;
  const recent: string[] = [];
  let trimmed = false;
  for (let i = passages.length - 1; i >= 0; i--)
  {
    if (recent.length) remaining -= promptSeparator.length;
    const passage = passages[i];
    const length = characterCount(passage);
    if (remaining < length)
    {
      if (remaining > 0) recent.push(Array.from(passage).slice(-remaining).join(''));
      trimmed = true;
      break;
    }
    recent.push(passage);
    remaining -= length;
  }
  return { text: recent.length ? historyHeading + recent.reverse().join(promptSeparator) : '', trimmed };
}

export function prepareStoryPrompt(input: GenerationInput, narration: string, notes: string, entries?: readonly LoreEntry[], limits?: ContextLimits)
{
  const lorebook = entries === undefined ? undefined : loreContext(entries, limits?.lorebook);
  const history = prepareHistory(input.history, limits?.history);
  const sections: Record<StoryPromptSection, string> = {
    systemStyle: narration ? instructions + promptSeparator + narration : instructions,
    authorNotes: notes ? promptSeparator + notes : '',
    lorebook: lorebook?.text ? promptSeparator + lorebook.text : '',
    history: history.text,
    playerInput: input.input
  };
  const messages = [
    { role: 'system', content: sections.systemStyle + sections.authorNotes + sections.lorebook },
    ...(sections.history ? [{ role: 'user', content: sections.history }] : []),
    { role: 'user', content: sections.playerInput }
  ];
  if (!limits) return { messages, sections, lorebook };

  const counts = {
    authorNotes: characterCount(sections.authorNotes),
    history: characterCount(sections.history),
    lorebook: characterCount(sections.lorebook),
    playerInput: characterCount(sections.playerInput)
  };
  const blocked = counts.authorNotes > limits.authorNotes ? 'authorNotes'
    : counts.playerInput > limits.playerInput ? 'playerInput' : null;
  const context: StoryContextReport = { limits, counts, historyTrimmed: history.trimmed, blocked };
  return { messages, sections, lorebook, context };
}

export function prepareLocalStoryPrompt(input: GenerationInput, style?: NarrationStyle, authorNotes?: string, loreEntries?: readonly LoreEntry[], limits?: ContextLimits)
{
  const narration = style ? narrationInstructions(style) : '';
  const notes = authorNotes === undefined ? '' : authorNotesGuidance(authorNotes);
  return { ...prepareStoryPrompt(input, narration, notes, loreEntries, limits), narration };
}
