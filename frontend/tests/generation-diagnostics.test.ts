import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateLocal, modelError, type ModelProfile } from '../src/lib/models.ts';
import { StoryCoordinator, type Generator } from '../src/lib/coordinator.ts';
import type { GenerationDetails } from '../src/lib/generationDiagnostics.ts';
import type { Snapshot } from '../src/lib/library.ts';

const profile: ModelProfile = { id: 'profile', name: 'Chosen connection', kind: 'custom', baseUrl: 'http://localhost:8081/v1', model: 'requested-model', timeoutMs: 1000 };
const input = { input: 'Private player prose.', history: ['Private accepted prose.'] };
const complete = (usage?: unknown) => ({ choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: 'A valid continuation.' } }], usage });
const frame = (value: unknown) => `data: ${JSON.stringify(value)}\n\n`;
const terminal = { choices: [{ index: 0, delta: { content: 'Valid streamed prose.' }, finish_reason: 'stop' }] };
const json = (usage?: unknown) => new Response(JSON.stringify(complete(usage)));
const sse = (text: string) => new Response(text, { headers: { 'Content-Type': 'text/event-stream' } });

function fixture(generate: Generator)
{
  const snapshot: Snapshot = { schemaVersion: 4, epoch: 'epoch', adventure: { id: 'story', title: 'Story', version: 0 }, baseline: { schemaVersion: 1 }, turns: [] };
  const coordinator = new StoryCoordinator(snapshot, {
    generate, generationError: modelError,
    storage: {
      read: async () => snapshot,
      list: async () => ({ schemaVersion: 4, epoch: 'epoch', adventures: [snapshot.adventure] }),
      commit: async () => { throw new Error('unexpected_commit'); }
    }
  });
  coordinator.setInput(input.input);
  return coordinator;
}

test('DEV-004D: completed diagnostics capture the actual request and whitelist optional usage fields', async () =>
{
  const selected = { ...profile };
  const updates: GenerationDetails[] = [];
  await generateLocal(selected, input, new AbortController().signal, async (_url, options) =>
  {
    const body = JSON.parse(String(options?.body));
    assert.deepEqual(Object.keys(body).sort(), ['messages', 'model', 'stream']);
    assert.equal(body.model, profile.model);
    selected.name = 'Edited'; selected.model = 'Edited'; selected.timeoutMs = 300000;
    return json({ prompt_tokens: 0, completion_tokens: 12, total_tokens: 99, secret: 'SECRET_USAGE' });
  }, undefined, details => updates.push(details));
  assert.deepEqual(updates, [
    { profileName: profile.name, server: profile.kind, requestedModel: profile.model, streaming: false, timeoutMs: 1000, usage: null },
    { profileName: profile.name, server: profile.kind, requestedModel: profile.model, streaming: false, timeoutMs: 1000, usage: { prompt: 0, completion: 12, total: 99 } }
  ]);
  assert.doesNotMatch(JSON.stringify(updates), /SECRET_USAGE|Private|baseUrl|messages|adventure/);
});

test('DEV-004D: absent or malformed usage never rejects valid prose or invents counts', async () =>
{
  const cases = [
    { usage: undefined, expected: null },
    { usage: 'SECRET', expected: null },
    { usage: { prompt_tokens: -1, completion_tokens: 1.5, total_tokens: Number.MAX_SAFE_INTEGER + 1 }, expected: null },
    { usage: { prompt_tokens: '12', completion_tokens: null, total_tokens: true }, expected: null },
    { usage: { completion_tokens: 0 }, expected: { prompt: null, completion: 0, total: null } }
  ];
  for (const { usage, expected } of cases)
  {
    let details: GenerationDetails | null = null;
    assert.equal(await generateLocal(profile, input, new AbortController().signal, async () => json(usage), undefined, value => { details = value; }), 'A valid continuation.');
    assert.deepEqual(details!.usage, expected);
    for (const body of [frame({ ...terminal, usage }), frame(terminal) + frame({ choices: [], usage: usage ?? null })])
    {
      await generateLocal(profile, input, new AbortController().signal, async (_url, options) =>
      {
        assert.equal('stream_options' in JSON.parse(String(options?.body)), false);
        return sse(body + 'data: [DONE]\n\n');
      }, () => {}, value => { details = value; });
      assert.deepEqual(details!.usage, expected);
    }
  }
});

test('DEV-004D: terminal SSE usage is informational and missing DONE still rejects the attempt', async () =>
{
  for (const body of [frame({ ...terminal, usage: { prompt_tokens: 7, completion_tokens: 2 } }), frame(terminal) + frame({ choices: [], usage: { prompt_tokens: 7, completion_tokens: 2 } })])
  {
    const coordinator = fixture((request, signal, progress, diagnostics) => generateLocal(profile, request, signal, async () => sse(body + 'data: [DONE]\n\n'), progress, diagnostics));
    await coordinator.generate();
    assert.equal(coordinator.state.phase, 'ready');
    assert.equal(coordinator.state.snapshot.adventure.version, 0);
    assert.equal(coordinator.state.diagnostics?.status, 'complete');
    assert.deepEqual(coordinator.state.diagnostics?.usage, { prompt: 7, completion: 2, total: null });
    assert.ok(Number.isInteger(coordinator.state.diagnostics?.elapsedMs));
    coordinator.dispose();
  }
  const failed = fixture((request, signal, progress, diagnostics) => generateLocal(profile, request, signal, async () => sse(frame({ ...terminal, usage: { total_tokens: 9 } })), progress, diagnostics));
  await failed.generate();
  assert.equal(failed.state.phase, 'idle');
  assert.equal(failed.state.candidate, null);
  assert.equal(failed.state.diagnostics?.status, 'failed');
  assert.equal(failed.state.diagnostics?.usage, null);
  assert.equal(failed.state.input, input.input);
  failed.dispose();
});

test('DEV-004D: observed elapsed time ends at validation, timeout or Stop and obsolete observers stay fenced', async t =>
{
  let clock = 10;
  t.mock.method(performance, 'now', () => clock);
  let reply!: (response: Response) => void;
  const coordinator = fixture((request, signal, _progress, diagnostics) => generateLocal(profile, request, signal, async () => new Promise(resolve => { reply = resolve; }), undefined, diagnostics));
  const pending = coordinator.generate();
  assert.equal(coordinator.state.diagnostics?.status, 'running');
  clock = 210;
  coordinator.stop();
  assert.equal(coordinator.state.diagnostics?.status, 'stopped');
  assert.equal(coordinator.state.diagnostics?.elapsedMs, 200);
  const stopped = structuredClone(coordinator.state.diagnostics);
  reply(json({ total_tokens: 99 }));
  await pending;
  assert.deepEqual(coordinator.state.diagnostics, stopped);
  coordinator.dispose();

  t.mock.timers.enable({ apis: ['setTimeout'] });
  const timeout = fixture((request, signal, _progress, diagnostics) => generateLocal(profile, request, signal, async (_url, options) => new Promise((_resolve, reject) =>
  {
    options!.signal!.addEventListener('abort', () => reject(options!.signal!.reason), { once: true });
  }), undefined, diagnostics));
  const waiting = timeout.generate();
  clock = 1210;
  t.mock.timers.tick(1000);
  await waiting;
  assert.equal(timeout.state.diagnostics?.status, 'failed');
  assert.equal(timeout.state.diagnostics?.elapsedMs, 1000);
  assert.match(timeout.state.error, /timed out/);
  timeout.dispose();
});

test('DEV-004D: Retry replaces diagnostics, fences old callbacks, and a new workspace or Simulation has no provider report', async () =>
{
  const details: GenerationDetails = { profileName: 'Captured', server: 'llamacpp', requestedModel: 'original', streaming: false, timeoutMs: 1000, usage: null };
  const observers: ((details: GenerationDetails) => void)[] = [];
  let attempts = 0;
  const coordinator = fixture(async (_request, _signal, _progress, diagnostics) =>
  {
    attempts++;
    observers.push(diagnostics!);
    if (attempts === 3) return 'Simulated prose.';
    diagnostics!({ ...details, requestedModel: `model-${attempts}` });
    if (attempts === 2) throw new Error('SECRET_ERROR');
    return 'Valid prose.';
  });
  await coordinator.generate();
  await coordinator.retry();
  assert.equal(coordinator.state.diagnostics?.requestedModel, 'model-2');
  assert.equal(coordinator.state.diagnostics?.status, 'failed');
  assert.doesNotMatch(coordinator.state.error, /SECRET_ERROR/);
  observers[0]({ ...details, requestedModel: 'obsolete' });
  assert.equal(coordinator.state.diagnostics?.requestedModel, 'model-2');
  await coordinator.generate();
  assert.equal(coordinator.state.diagnostics, null);
  coordinator.dispose();
  observers[2](details);
  assert.equal(coordinator.state.diagnostics, null);
  const fresh = fixture(async () => 'Valid prose.');
  assert.equal(fresh.state.diagnostics, null);
  fresh.dispose();
});
