import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authorNotesGuidance } from '../src/lib/authorNotes.ts';
import type { ContextLimits } from '../src/lib/contextLimits.ts';
import type { GenerationDetails } from '../src/lib/generationDiagnostics.ts';
import { loreContext, type LoreEntry } from '../src/lib/lorebook.ts';
import { generateLocal, readProfile, type ModelProfile } from '../src/lib/models.ts';
import { prepareStoryPrompt } from '../src/lib/storyPrompt.ts';

const profile: ModelProfile = { id: 'local', name: 'Local', kind: 'custom', baseUrl: 'http://localhost:8080/v1', model: 'fixture', timeoutMs: 1000 };
const entry: LoreEntry = { id: 'short', revision: 1, kind: 'object', title: '🗝 Key', description: 'A small key.', included: true };
const limits: ContextLimits = { preset: 'custom', authorNotes: 0, history: 0, lorebook: 0, playerInput: 1 };

test('Context limits count complete sections, keep the newest history and skip oversized whole lore entries', () =>
{
  const notes = authorNotesGuidance('🦉');
  const lore = loreContext([entry]).text;
  const history = 'Accepted story so far:\n\n🦉\n\nNew';
  const accepted = ['Old passage', 'Older 🦉', 'New'];
  const entries = [
    { ...entry, id: 'long', title: 'Large entry', description: 'x'.repeat(500) },
    { ...entry, id: 'excluded', title: 'Excluded', included: false },
    entry
  ];
  const prompt = prepareStoryPrompt({ input: '🗝', history: accepted }, 'Style in full.', notes, entries, {
    ...limits, authorNotes: [...notes].length + 2, history: [...history].length, lorebook: [...lore].length + 2
  });
  assert.deepEqual(prompt.messages.map(message => message.content).slice(1), [history, '🗝']);
  assert.ok(prompt.messages[0].content.endsWith(`Style in full.\n\n${notes}\n\n${lore}`));
  assert.deepEqual(prompt.lorebook?.requested.map(entry => entry.title), ['Large entry', '🗝 Key']);
  assert.deepEqual(prompt.lorebook?.omitted?.map(entry => entry.title), ['Large entry']);
  assert.equal(prompt.context?.blocked, null);
  assert.equal(prompt.context?.historyTrimmed, true);
  assert.deepEqual(prompt.context?.counts, { authorNotes: [...notes].length + 2, history: [...history].length, lorebook: [...lore].length + 2, playerInput: 1 });
  assert.deepEqual(accepted, ['Old passage', 'Older 🦉', 'New']);
  assert.equal(entries.every((entry, index) => entry.included === (index !== 1)), true);

  const small = prepareStoryPrompt({ input: 'x', history: ['A'] }, '', '', [entry], {
    ...limits, history: 'Accepted story so far:\n\n'.length, lorebook: [...lore].length + 1
  });
  assert.equal(small.messages.length, 2);
  assert.equal(small.lorebook?.text, '');
  assert.equal(small.context?.counts.history, 0);
});

test('Generation rejects oversized author notes and player input before any provider dispatch', async () =>
{
  for (const [notes, playerInput, section] of [['🦉', 'x', 'author notes'], ['', '🗝🗝', 'player input']])
  {
    let details: GenerationDetails | undefined;
    await assert.rejects(generateLocal({ ...profile, contextLimits: limits }, { input: playerInput, history: [] },
      new AbortController().signal, async () => assert.fail('unexpected provider dispatch'), undefined,
      value => { details = value; }, undefined, notes, [entry]), new RegExp(`The ${section} section has \\d+ characters and its limit is [01]`));
    assert.ok(details?.context?.blocked);
  }
});

test('Model profiles read prior shapes and reject malformed context settings', () =>
{
  assert.deepEqual(readProfile(profile), profile);
  assert.deepEqual(readProfile({ ...profile, contextLimits: limits }).contextLimits, limits);
  for (const contextLimits of [null, { ...limits, preset: 'global' }, { ...limits, history: .5 }, { ...limits, lorebook: -1 }, { ...limits, playerInput: 0 }])
    assert.throws(() => readProfile({ ...profile, contextLimits }), /context limits are invalid/);
});
