import { characterCount, promptSeparator, type ContextLimits, type ContextSection } from './contextLimits.ts';
import type { GenerationInput } from './coordinator.ts';
import { loreContext, type LoreEntry } from './lorebook.ts';

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
  const system = [instructions, narration, notes, lorebook?.text].filter(Boolean).join(promptSeparator);
  const messages = [
    { role: 'system', content: system },
    ...(history.text ? [{ role: 'user', content: history.text }] : []),
    { role: 'user', content: input.input }
  ];
  if (!limits) return { messages, lorebook };

  const counts = {
    authorNotes: notes ? promptSeparator.length + characterCount(notes) : 0,
    history: characterCount(history.text),
    lorebook: lorebook?.text ? promptSeparator.length + characterCount(lorebook.text) : 0,
    playerInput: characterCount(input.input)
  };
  const blocked = counts.authorNotes > limits.authorNotes ? 'authorNotes'
    : counts.playerInput > limits.playerInput ? 'playerInput' : null;
  const context: StoryContextReport = { limits, counts, historyTrimmed: history.trimmed, blocked };
  return { messages, lorebook, context };
}
