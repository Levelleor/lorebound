import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loreContext, readLorebook, type LoreEntry } from '../src/lib/lorebook.ts';
import { generateLocal, type ModelProfile } from '../src/lib/models.ts';
import type { GenerationDetails } from '../src/lib/generationDiagnostics.ts';

const request = { schemaVersion: 4, epoch: 'epoch', adventureId: 'adventure' };
const first: LoreEntry = { id: 'internal-observatory-id', revision: 1, kind: 'place', title: 'Observatory', description: 'The shutters open at dusk.', included: true };
const excluded: LoreEntry = { ...first, id: 'internal-other-id', title: 'Secret Shoal', description: 'Unselected lore.', included: false };
const second: LoreEntry = { ...first, id: 'internal-bell-id', kind: 'object', title: 'Bell', description: 'One toll.', included: true };
const profile: ModelProfile = { id: 'profile', name: 'Test connection', kind: 'custom', baseUrl: 'http://localhost:8081/v1', model: 'fixture', timeoutMs: 1000 };
const input = { input: 'I head up the steps.', history: ['The sun is setting.'] };

test('Lorebook reads validate scope, identity and contents before generation', () =>
{
  assert.deepEqual(readLorebook({ ...request, entries: [] }, request).entries, []);
  for (const invalid of [
    { ...request, epoch: 'stale', entries: [] },
    { ...request, entries: [first, first] },
    { ...request, entries: [{ ...first, kind: 'constructor' }] },
    { ...request, entries: [{ ...first, revision: 0 }] },
    { ...request, entries: [{ ...first, description: '\ud800' }] },
    { ...request, entries: [{ ...first, included: 1 }] }
  ]) assert.throws(() => readLorebook(invalid, request), /unsupported_lorebook/);
});

test('Generation sends saved selected lore in order and retains the exact dispatched text', async () =>
{
  const entries = [{ ...first }, excluded, second];
  const expected = loreContext(entries);
  const updates: GenerationDetails[] = [];
  await generateLocal(profile, input, new AbortController().signal, async (_url, options) =>
  {
    const body = JSON.parse(String(options?.body));
    assert.deepEqual(Object.keys(body).sort(), ['messages', 'model', 'stream']);
    assert.ok(body.messages[0].content.endsWith(`\n\n${expected.text}`));
    assert.ok(body.messages[0].content.indexOf('Keep the pace steady.') < body.messages[0].content.indexOf('Lorebook ('));
    assert.match(body.messages[1].content, /Accepted story so far:/);
    assert.equal(body.messages[2].content, input.input);
    assert.doesNotMatch(JSON.stringify(body), /Secret Shoal|Unselected lore|internal-/);
    entries[0].description = 'A later edit.';
    return Response.json({ choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: 'The door creaks open.' } }] });
  }, undefined, details => updates.push(details), undefined, 'Keep the pace steady.', entries);
  assert.match(expected.text, /\[Place\] Observatory\nThe shutters open at dusk\.\n\n\[Object\] Bell\nOne toll\./);
  assert.deepEqual(updates.map(update => update.lorebook), [expected, expected]);
  assert.deepEqual(loreContext([excluded]), { requested: [], text: '' });
});

test('Context overflow is actionable for compatible and native streams and redacts provider text', async () =>
{
  const error = { error: { code: 'context_length_exceeded', message: 'Secret provider details.' } };
  const native = { error: 'The input length exceeds the context length. Secret provider details.' };
  const cases = [
    { kind: 'custom', progress: undefined, reply: Response.json(error, { status: 400 }) },
    { kind: 'llamacpp', progress: undefined, reply: Response.json({ error: { code: 400, type: 'exceed_context_size', message: 'Secret provider details.' } }, { status: 400 }) },
    { kind: 'vllm', progress: undefined, reply: Response.json({ error: { message: 'The maximum context length is 4096 tokens. However, you requested 5000 tokens. Secret provider details.' } }, { status: 400 }) },
    { kind: 'custom', progress: () => {}, reply: new Response(`event: error\ndata: ${JSON.stringify(error)}\n\n`, { headers: { 'Content-Type': 'text/event-stream' } }) },
    { kind: 'ollama', progress: () => {}, reply: new Response(`${JSON.stringify(native)}\n`, { headers: { 'Content-Type': 'application/x-ndjson' } }) }
  ] as const;
  for (const { kind, progress, reply } of cases)
  {
    await assert.rejects(generateLocal({ ...profile, kind }, input, new AbortController().signal, async () => reply, progress, undefined, undefined, undefined, [first]), cause =>
    {
      assert.match(String(cause), /exceeds the model’s context capacity/);
      assert.doesNotMatch(String(cause), /Secret provider details/);
      return true;
    });
  }
});
