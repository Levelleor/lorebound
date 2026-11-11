import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateLocal, modelError, type ModelProfile } from '../src/lib/models.ts';
import { StoryCoordinator, type Generator } from '../src/lib/coordinator.ts';
import type { Snapshot } from '../src/lib/library.ts';

const profile: ModelProfile = { id: 'local', name: 'Local', kind: 'llamacpp', baseUrl: 'http://localhost:8081/v1', model: 'chosen', timeoutMs: 1000 };
const input = { input: 'Player prose.', history: ['Accepted prose.'] };
const encoder = new TextEncoder();
const chunk = (delta: object, finish: string | null = null) => ({ choices: [{ index: 0, delta, finish_reason: finish }] });
const event = (value: unknown) => `data: ${JSON.stringify(value)}\n\n`;
const ending = event(chunk({}, 'stop')) + 'data: [DONE]\n\n';

function response(text: string, bytewise = false): Response
{
  const bytes = encoder.encode(text);
  return new Response(new ReadableStream({
    start(controller)
    {
      if (bytewise) for (const byte of bytes) controller.enqueue(new Uint8Array([byte]));
      else controller.enqueue(bytes);
      controller.close();
    }
  }), { headers: { 'Content-Type': 'text/event-stream; charset=utf-8' } });
}

function fixture(generate: Generator)
{
  const snapshot: Snapshot = { schemaVersion: 4, epoch: 'epoch', adventure: { id: 'story', title: 'Story', version: 0 }, baseline: { schemaVersion: 1 }, turns: [] };
  let writes = 0;
  const coordinator = new StoryCoordinator(snapshot, {
    generate, generationError: modelError,
    storage: {
      read: async () => snapshot,
      list: async () => ({ schemaVersion: 4, epoch: 'epoch', adventures: [snapshot.adventure] }),
      commit: async () => { writes++; throw new Error('unexpected_commit'); }
    }
  });
  coordinator.setInput(input.input);
  return { coordinator, writes: () => writes };
}

test('DEV-004B: SSE framing survives byte-split UTF-8, BOM, CR/LF, comments and multiline data', async () =>
{
  for (const newline of ['\n', '\r', '\r\n'])
  {
    const previews: string[] = [];
    const stream = '\uFEFF: keepalive\n\nevent: message\ndata: {"choices":\ndata: [{"index":0,"delta":{"role":"assistant","content":"Café 🌙"},"finish_reason":null}]}\n\n'
      + event(chunk({ content: '\n\nA road.' })) + event(chunk({}, 'stop'))
      + event({ choices: [], usage: { completion_tokens: 5 } }) + 'data: [DONE]\n\n';
    const result = await generateLocal(profile, input, new AbortController().signal, async (_url, options) =>
    {
      const body = JSON.parse(String(options?.body));
      assert.equal(body.stream, true);
      assert.equal(body.model, profile.model);
      assert.deepEqual(options?.headers, { 'Content-Type': 'application/json' });
      assert.equal(options?.credentials, 'omit');
      assert.equal(options?.redirect, 'error');
      assert.equal(options?.referrerPolicy, 'no-referrer');
      return response(stream.replaceAll('\n', newline), true);
    }, text => previews.push(text));
    assert.equal(result, 'Café 🌙\n\nA road.');
    assert.deepEqual(previews, ['Café 🌙', result]);
  }
});

test('DEV-004B: partial output is visible but unacceptable; Stop and obsolete progress cannot revive it', async () =>
{
  const attempts: { progress: (text: string) => void; resolve: (text: string) => void; signal: AbortSignal }[] = [];
  const f = fixture(async (_input, signal, onProgress) => new Promise(resolve =>
  {
    attempts.push({ progress: onProgress!, resolve, signal });
  }));
  const first = f.coordinator.generate();
  attempts[0].progress('Incomplete preview.');
  assert.equal(f.coordinator.state.preview, 'Incomplete preview.');
  assert.equal(f.coordinator.state.candidate, null);
  await f.coordinator.accept();
  assert.equal(f.writes(), 0);
  f.coordinator.stop();
  assert.equal(attempts[0].signal.aborted, true);
  assert.equal(f.coordinator.state.preview, '');
  const second = f.coordinator.generate();
  attempts[0].progress('Obsolete preview.');
  attempts[0].resolve('Obsolete completion.');
  await first;
  assert.equal(f.coordinator.state.preview, '');
  attempts[1].progress('Current preview.');
  attempts[1].resolve('Current completion.');
  await second;
  assert.equal(f.coordinator.state.phase, 'ready');
  assert.equal(f.coordinator.state.preview, '');
  const retry = f.coordinator.retry();
  assert.equal(f.coordinator.state.candidate, null);
  attempts[1].progress('Late after completion.');
  assert.equal(f.coordinator.state.preview, '');
  attempts[2].progress('Retry preview.');
  f.coordinator.dispose();
  attempts[2].progress('After disposal.');
  attempts[2].resolve('After disposal.');
  await retry;
  assert.equal(f.writes(), 0);
});

test('DEV-004B: broken, incomplete, tool, refusal, empty and oversized streams discard the entire attempt', async () =>
{
  const prefix = event(chunk({ content: 'Partial prose.' }));
  const failures = [
    prefix,
    prefix + event(chunk({}, 'stop')),
    prefix + 'data: [DONE]\n\n',
    prefix + 'data: {RAW_SECRET\n\n',
    prefix + event({ error: { message: 'RAW_SECRET' } }),
    prefix + event(chunk({}, 'length')) + 'data: [DONE]\n\n',
    prefix + event(chunk({ tool_calls: [{ id: 'tool' }] })) + ending,
    prefix + event(chunk({ function_call: { name: 'tool' } })) + ending,
    prefix + event(chunk({ refusal: 'RAW_SECRET' })) + ending,
    prefix + event(chunk({ content: {} })) + ending,
    prefix + event(chunk({ role: 'user' })) + ending,
    prefix + event({ choices: [{ index: 1, delta: {}, finish_reason: 'stop' }] }) + 'data: [DONE]\n\n',
    prefix + event(chunk({}, 'stop')) + event(chunk({ content: 'After finish.' })) + 'data: [DONE]\n\n',
    prefix + 'event: error\ndata: {}\n\n',
    event(chunk({ content: '\ud800' })) + ending,
    event(chunk({ content: 'x'.repeat(20001) })) + ending,
    ':'.repeat(1048577),
    ending,
    event(chunk({ content: '   ' })) + ending,
    prefix + event(chunk({}, 'stop')) + 'data: [DONE]'
  ];
  for (const stream of failures)
  {
    const f = fixture((request, signal, progress) => generateLocal(profile, request, signal, async () => response(stream), progress));
    await f.coordinator.generate();
    assert.equal(f.coordinator.state.phase, 'idle');
    assert.equal(f.coordinator.state.preview, '');
    assert.equal(f.coordinator.state.candidate, null);
    assert.equal(f.coordinator.state.input, input.input);
    assert.equal(f.writes(), 0);
    assert.ok(f.coordinator.state.error);
    assert.doesNotMatch(f.coordinator.state.error, /RAW_SECRET/);
    f.coordinator.dispose();
  }
  for (const badResponse of [new Response('{}'), new Response(new Uint8Array([255]), { headers: { 'Content-Type': 'text/event-stream' } })])
    await assert.rejects(generateLocal(profile, input, new AbortController().signal, async () => badResponse, () => {}), /stream/);
});

test('DEV-004B: Stop and timeout cancel a stalled body after preview; DONE closes without waiting for EOF', async t =>
{
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const stop of [true, false])
  {
    let cancelled = false;
    let preview!: () => void;
    const visible = new Promise<void>(resolve => { preview = resolve; });
    const abort = new AbortController();
    const pending = generateLocal(profile, input, abort.signal, async () => new Response(new ReadableStream({
      start(controller) { controller.enqueue(encoder.encode(event(chunk({ content: 'Preview.' })))); },
      cancel() { cancelled = true; }
    }), { headers: { 'Content-Type': 'text/event-stream' } }), preview);
    const rejected = assert.rejects(pending, stop ? /AbortError/ : /timed out/);
    await visible;
    if (stop) abort.abort(); else t.mock.timers.tick(1000);
    await rejected;
    assert.equal(cancelled, true);
  }
  let cancelled = false;
  assert.equal(await generateLocal(profile, input, new AbortController().signal, async () => new Response(new ReadableStream({
    start(controller) { controller.enqueue(encoder.encode(event(chunk({ content: 'Complete.' })) + ending)); },
    cancel() { cancelled = true; }
  }), { headers: { 'Content-Type': 'text/event-stream' } }), () => {}), 'Complete.');
  assert.equal(cancelled, true);
});
