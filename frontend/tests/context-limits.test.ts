import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authorNotesGuidance } from '../src/lib/authorNotes.ts';
import type { ContextLimits } from '../src/lib/contextLimits.ts';
import type { GenerationDetails } from '../src/lib/generationDiagnostics.ts';
import { loreContext, type LoreEntry } from '../src/lib/lorebook.ts';
import { generateLocal, readProfile, type ModelProfile } from '../src/lib/models.ts';
import { prepareStoryPrompt } from '../src/lib/storyPrompt.ts';
import { previewStoryPrompt } from '../src/lib/promptPreview.ts';
import type { NarrationStyle } from '../src/lib/narration.ts';

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

test('Next prompt estimates count the same rendered sections the provider receives', async () =>
{
  const style: NarrationStyle = { perspective: 'first', tense: '', genre: '', tone: '', pacing: '', length: '', instructions: '' };
  const notes = 'Keep the 🗝 visible.';
  const contextLimits = { ...limits, history: 27, authorNotes: 300, lorebook: 140, playerInput: 20 };
  const selected = { ...profile, contextLimits, contextWindowTokens: 120, replyReserveTokens: 100 };
  const input = { input: 'Qué 🦉', history: ['History to discard', 'Exit'] };
  const entries = [{ ...entry, id: 'large', description: 'x'.repeat(200) }, entry];
  const preview = previewStoryPrompt(selected, input, style, notes, entries);
  assert.equal(preview.context?.historyTrimmed, true);
  assert.equal(preview.skippedLore.length, 1);
  const mock: typeof fetch = async (_url, options) =>
  {
    const { messages } = JSON.parse(String(options?.body));
    const lore = '\n\n' + loreContext([entry]).text;
    const author = '\n\n' + authorNotesGuidance(notes);
    assert.ok(messages[0].content.endsWith(author + lore));
    const system = messages[0].content.slice(0, -(author.length + lore.length));
    assert.deepEqual(preview.rows.map(row => row.tokens), [system, author, lore, messages[1].content, messages[2].content]
      .map(part => Math.ceil(Buffer.byteLength(part) / 4)));
    return Response.json({ choices: [{ message: { role: 'assistant', content: 'The end.' }, finish_reason: 'stop' }] });
  };
  await generateLocal(selected, input, new AbortController().signal, mock, undefined, undefined, style, notes, entries);
  assert.equal(preview.total, preview.rows.reduce((sum, row) => sum + row.tokens, 0));
  assert.equal(preview.overBy, preview.total + 100 - 120);

  const blank = previewStoryPrompt({ ...profile, replyReserveTokens: 0 }, { input: '', history: [] }, style, '', []);
  assert.deepEqual(blank.rows.map(row => row.section), ['systemStyle']);
  assert.equal(blank.capacity, undefined);
  assert.equal(blank.replyAllowance, 0);
  assert.equal(blank.overBy, 0);
  const blocked = previewStoryPrompt({ ...profile, contextLimits: limits }, input, style, notes, entries);
  assert.equal(blocked.context?.blocked, 'authorNotes');
  assert.ok(blocked.context && blocked.context.counts.playerInput > blocked.context.limits.playerInput);
});

test('Model profile context capacity and reply allowance are optional whole numbers', () =>
{
  const configured = { ...profile, contextWindowTokens: 12000, replyReserveTokens: 0 };
  assert.deepEqual(readProfile(configured), configured);
  for (const settings of [{ contextWindowTokens: null }, { contextWindowTokens: 0 }, { contextWindowTokens: 1.5 },
    { replyReserveTokens: -1 }, { contextWindowTokens: 10, replyReserveTokens: 11 }])
    assert.throws(() => readProfile({ ...profile, ...settings }), /whole tokens/);
});
