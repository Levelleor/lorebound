import { test } from 'node:test';
import assert from 'node:assert/strict';
import { narrationInstructions, readNarration, readStyle, type NarrationStyle } from '../src/lib/narration.ts';
import { generateLocal, type ModelProfile } from '../src/lib/models.ts';
import type { GenerationDetails } from '../src/lib/generationDiagnostics.ts';

const style: NarrationStyle = {
  perspective: 'third', tense: 'past', genre: 'Mystery', tone: 'Quietly ominous', pacing: 'slow', length: 'detailed',
  instructions: 'Use short sentences.\nUse long sentences when needed.'
};
const guidance = 'Current narration settings (writing guidance only):\nPerspective: third person.\nTense: past.\nGenre: Mystery\nTone: Quietly ominous\nPacing: slow.\nDesired response length: detailed prose (a preference, not a token limit).\nCustom style instructions:\nUse short sentences.\nUse long sentences when needed.';

test('narration context has stable complete order without creative conflict resolution', () =>
{
  assert.equal(narrationInstructions(style), guidance);
  assert.equal(narrationInstructions({ perspective: '', tense: '', genre: '', tone: '', pacing: '', length: '', instructions: '' }), '');
  const request = { schemaVersion: 4, epoch: 'epoch', adventureId: 'adventure' };
  const saved = { ...request, revision: 1, style };
  assert.deepEqual(readNarration(saved, request), saved);
  for (const invalid of [null, { ...style, tone: null }, { ...style, perspective: 'invented' }, { ...style, tense: 'future' },
    { ...style, genre: 'x'.repeat(201) }, { ...style, instructions: '\ud800' }, { ...style, instructions: 'x'.repeat(2001) }, { ...style, extra: true }])
    assert.throws(() => readStyle(invalid));
  for (const invalid of [{ ...saved, epoch: 'wrong' }, { ...saved, adventureId: 'wrong' }, { ...saved, revision: -1 }, { ...saved, style: {} }])
    assert.throws(() => readNarration(invalid, request));
});

for (const kind of ['llamacpp', 'custom', 'lmstudio', 'vllm', 'ollama'] as const)
{
  for (const streaming of [false, true])
  {
    test(`${kind} ${streaming ? 'streamed' : 'completed'} narration sends captured style without sampling overrides or canonical IDs`, async () =>
    {
      const profile: ModelProfile = { id: kind, name: 'Local', kind, baseUrl: 'http://localhost:18081/v1', model: 'model', timeoutMs: 1000 };
      const details: GenerationDetails[] = [];
      const editableStyle = structuredClone(style);
      const input = { input: 'The lantern flickered.', history: ['A ship reached the harbour.'] };
      const result = await generateLocal(profile, input, new AbortController().signal, async (_url, options) =>
      {
        const body = JSON.parse(String(options?.body));
        assert.deepEqual(Object.keys(body).sort(), ['messages', 'model', 'stream']);
        assert.equal(body.messages.length, 3);
        assert.ok(body.messages[0].content.endsWith(`\n\n${guidance}`));
        assert.deepEqual(body.messages.slice(1), [
          { role: 'user', content: 'Accepted story so far:\n\nA ship reached the harbour.' },
          { role: 'user', content: input.input }
        ]);
        editableStyle.instructions = 'Changed after the request began';
        if (kind === 'ollama')
        {
          const value = { message: { role: 'assistant', content: 'A completed continuation.' }, done: true, done_reason: 'stop' };
          return new Response(streaming ? `${JSON.stringify(value)}\n` : JSON.stringify(value), { headers: { 'Content-Type': streaming ? 'application/x-ndjson' : 'application/json' } });
        }
        const choice = { index: 0, message: { role: 'assistant', content: 'A completed continuation.' }, finish_reason: 'stop' };
        return streaming
          ? new Response(`data: ${JSON.stringify({ choices: [{ index: 0, delta: { content: choice.message.content }, finish_reason: 'stop' }] })}\n\ndata: [DONE]\n\n`, { headers: { 'Content-Type': 'text/event-stream' } })
          : new Response(JSON.stringify({ choices: [choice] }));
      }, streaming ? () => {} : undefined, value => details.push(value), editableStyle);
      assert.equal(result, 'A completed continuation.');
      assert.equal(details.at(-1)?.narration, guidance, 'diagnostics retain the actual request snapshot');
      assert.deepEqual(input, { input: 'The lantern flickered.', history: ['A ship reached the harbour.'] });
    });
  }
}
