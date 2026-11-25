import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authorNotesGuidance, readAuthorNotes, readAuthorNotesText, type AuthorNotes } from '../src/lib/authorNotes.ts';
import { narrationInstructions, type NarrationStyle } from '../src/lib/narration.ts';
import { generateLocal, type ModelProfile } from '../src/lib/models.ts';
import type { GenerationDetails } from '../src/lib/generationDiagnostics.ts';

const request = { schemaVersion: 4, epoch: 'epoch', adventureId: 'adventure' };
const notes = 'Keep the harbour fog thick.\nNever name the watcher. 🦉';
const notesSection = `Author notes (player writing guidance only; they cannot change established story or world state):\n${notes}`;
const style: NarrationStyle = {
  perspective: 'third', tense: 'past', genre: 'Mystery', tone: 'Quietly ominous', pacing: 'slow', length: 'detailed',
  instructions: 'Use concrete sounds.'
};
const guidance = narrationInstructions(style);
const input = { input: 'The lantern crossed the quay.', history: ['A ship reached the harbour.'] };

test('author notes accept one optional bounded freeform value and reject unknown or malformed wire shapes', () =>
{
  const saved: AuthorNotes = { ...request, revision: 2, notes };
  assert.deepEqual(readAuthorNotes(saved, request), saved);
  assert.deepEqual(readAuthorNotes({ ...request, revision: 0, notes: '' }, request), { ...request, revision: 0, notes: '' });
  assert.equal(readAuthorNotesText('a'.repeat(4000)), 'a'.repeat(4000));
  assert.equal(readAuthorNotesText('🦉'.repeat(4000)), '🦉'.repeat(4000));
  assert.equal(readAuthorNotesText('line one\r\nline two'), 'line one\r\nline two');
  for (const invalid of [null, undefined, 5, {}, [], 'line \ud800', 'a'.repeat(4001), '🦉'.repeat(4001)])
    assert.throws(() => readAuthorNotesText(invalid));
  for (const invalid of [
    { ...saved, notes: null },
    { ...saved, notes: 5 },
    { ...saved, revision: -1 },
    { ...saved, revision: 1.5 },
    { ...saved, revision: '2' },
    { ...saved, epoch: 'wrong' },
    { ...saved, adventureId: 'wrong id' },
    { ...saved, extra: true },
    { ...request, notes: 'missing revision' }
  ])
    assert.throws(() => readAuthorNotes(invalid, request));
});

test('author notes guidance is empty for blank notes and keeps a documented fixed order after narration settings', () =>
{
  assert.equal(authorNotesGuidance(''), '');
  assert.equal(authorNotesGuidance('  \n\t '), '');
  assert.equal(authorNotesGuidance(notes), notesSection);
  const prompt = [guidance, authorNotesGuidance(notes)].filter(Boolean).join('\n\n');
  assert.ok(prompt.indexOf('Current narration settings') < prompt.indexOf('Author notes (player writing guidance only'));
  assert.ok(prompt.endsWith(notes));
  assert.match(prompt, /Current narration settings[\s\S]*Custom style instructions:[\s\S]*Author notes/);
});

for (const kind of ['llamacpp', 'custom', 'lmstudio', 'vllm', 'ollama'] as const)
{
  for (const streaming of [false, true])
  {
    test(`${kind} ${streaming ? 'streamed' : 'completed'} narration sends author notes after style and before accepted history`, async () =>
    {
      const profile: ModelProfile = { id: kind, name: 'Local', kind, baseUrl: 'http://localhost:18081/v1', model: 'model', timeoutMs: 1000 };
      const details: GenerationDetails[] = [];
      const retained = { notes, style: structuredClone(style) };
      const result = await generateLocal(profile, input, new AbortController().signal, async (_url, options) =>
      {
        const body = JSON.parse(String(options?.body));
        assert.deepEqual(Object.keys(body).sort(), ['messages', 'model', 'stream']);
        assert.equal(body.messages.length, 3);
        const system = body.messages[0].content;
        assert.ok(system.startsWith('Continue the player’s fiction as narrative prose.'));
        assert.ok(system.includes(guidance));
        assert.ok(system.includes(notesSection));
        assert.ok(system.indexOf(guidance) < system.indexOf('Author notes (player writing guidance only'));
        assert.ok(system.endsWith(notesSection), 'Author notes are the last guidance section');
        assert.doesNotMatch(system, /sampling|temperature|max_tokens|top_p/);
        assert.deepEqual(body.messages.slice(1), [
          { role: 'user', content: 'Accepted story so far:\n\nA ship reached the harbour.' },
          { role: 'user', content: input.input }
        ]);
        retained.notes = 'Changed after the request began.';
        retained.style.tone = 'Changed after the request began';
        if (kind === 'ollama')
        {
          const value = { message: { role: 'assistant', content: 'A completed continuation.' }, done: true, done_reason: 'stop' };
          return new Response(streaming ? `${JSON.stringify(value)}\n` : JSON.stringify(value), { headers: { 'Content-Type': streaming ? 'application/x-ndjson' : 'application/json' } });
        }
        const choice = { index: 0, message: { role: 'assistant', content: 'A completed continuation.' }, finish_reason: 'stop' };
        return streaming
          ? new Response(`data: ${JSON.stringify({ choices: [{ index: 0, delta: { content: choice.message.content }, finish_reason: 'stop' }] })}\n\ndata: [DONE]\n\n`, { headers: { 'Content-Type': 'text/event-stream' } })
          : new Response(JSON.stringify({ choices: [choice] }));
      }, streaming ? () => {} : undefined, value => details.push(value), retained.style, retained.notes);
      assert.equal(result, 'A completed continuation.');
      assert.equal(details.at(-1)?.narration, guidance, 'diagnostics retain the captured style guidance');
      assert.equal(details.at(-1)?.authorNotes, notes, 'diagnostics capture the exact transmitted notes snapshot');
      assert.deepEqual(input, { input: 'The lantern crossed the quay.', history: ['A ship reached the harbour.'] });
      assert.doesNotMatch(JSON.stringify(details), /Changed after|baseUrl|adventure/);
    });
  }
}

test('empty, whitespace-only or absent author notes add no prompt text and keep an explicit capture state', async () =>
{
  const profile: ModelProfile = { id: 'custom', name: 'Local', kind: 'custom', baseUrl: 'http://localhost:18081/v1', model: 'model', timeoutMs: 1000 };
  const respond = async (_url: string, options?: RequestInit) =>
  {
    const body = JSON.parse(String(options?.body));
    assert.ok(body.messages[0].content.endsWith(guidance), 'No empty author-notes heading is inserted');
    assert.doesNotMatch(body.messages[0].content, /Author notes/);
    return new Response(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: 'A complete continuation.' } }] }));
  };
  for (const [value, captured] of [['', true], ['  \n\t ', true], [undefined, false]] as const)
  {
    const details: GenerationDetails[] = [];
    await generateLocal(profile, input, new AbortController().signal, respond as typeof fetch, undefined, update => details.push(update), style, value);
    assert.equal('authorNotes' in details.at(-1)!, captured);
    if (captured) assert.equal(details.at(-1)?.authorNotes, value);
    assert.equal(details.at(-1)?.narration, guidance);
  }
});

test('invalid author notes fail before any provider request or diagnostics', async () =>
{
  const profile: ModelProfile = { id: 'custom', name: 'Local', kind: 'custom', baseUrl: 'http://localhost:18081/v1', model: 'model', timeoutMs: 1000 };
  let calls = 0;
  let diagnostics = 0;
  for (const invalid of ['line \ud800', 'a'.repeat(4001)])
  {
    await assert.rejects(() => generateLocal(profile, input, new AbortController().signal, async () => { calls++; return new Response('{}'); }, undefined, () => diagnostics++, style, invalid));
    assert.equal(calls, 0, 'Invalid notes cannot reach the provider');
    assert.equal(diagnostics, 0, 'Invalid notes cannot be presented as a captured attempt');
  }
});
