import { test } from 'node:test';
import assert from 'node:assert/strict';
import { discoverModels, endpointUrl, generateLocal, modelError, readConnections, type ModelProfile } from '../src/lib/models.ts';
import { StoryCoordinator } from '../src/lib/coordinator.ts';
import type { Snapshot } from '../src/lib/library.ts';

const profile: ModelProfile = { id: 'local', name: 'Local model', kind: 'llamacpp', baseUrl: 'http://127.0.0.1:8081/v1', model: 'chosen-model', timeoutMs: 1000 };
const complete = (text = 'A complete continuation.') => ({ choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: text } }] });
const json = (value: unknown) => new Response(JSON.stringify(value));

function fixture(fetcher: typeof fetch)
{
  let current: Snapshot = { schemaVersion: 4, epoch: 'epoch', adventure: { id: 'story', title: 'Story', version: 0 }, baseline: { schemaVersion: 1 }, turns: [] };
  let writes = 0;
  let id = 0;
  const coordinator = new StoryCoordinator(current, {
    generate: (input, signal) => generateLocal(profile, input, signal, fetcher), generationError: modelError,
    newId: () => `id-${++id}`,
    storage: {
      list: async () => ({ schemaVersion: 4, epoch: 'epoch', adventures: [current.adventure] }),
      read: async () => current,
      commit: async request =>
      {
        assert.equal(request.kind, 'append_story_turn');
        if (request.kind !== 'append_story_turn') throw new Error('unexpected_commit');
        writes++;
        current = { ...current, adventure: { ...current.adventure, version: 1 }, turns: [request.turn] };
        return { schemaVersion: 4, epoch: 'epoch', adventureId: 'story', operationId: request.operationId, version: 1, turnId: request.turn.id, replayed: false };
      }
    }
  });
  coordinator.setInput('The player’s next passage.');
  return { coordinator, writes: () => writes };
}

test('DEV-004A: fixed nonsecret settings reject credentials, unknown fields and invalid selections', () =>
{
  for (const url of ['javascript:alert(1)', 'file:///tmp/model', 'https://name:secret@host/v1', 'http://host/v1?key=x', 'http://host/v1#key', 'http://host/v1?', 'http:\\host', 'http://host/white space'])
    assert.throws(() => endpointUrl(url));
  assert.equal(endpointUrl('http://localhost:8081/v1/'), 'http://localhost:8081/v1');
  const settings = { schemaVersion: 4, epoch: 'epoch', revision: 1, mode: 'local', activeProfileId: 'local', profiles: [profile] };
  assert.deepEqual(readConnections(settings, 'epoch'), settings);
  for (const value of [{ ...settings, epoch: 'wrong' }, { ...settings, activeProfileId: 'missing' }, { ...settings, profiles: [profile, profile] }, { ...settings, profiles: [{ ...profile, apiKey: 'secret' }] }])
    assert.throws(() => readConnections(value, 'epoch'));
  for (const malformed of [['local'], ['simulation'], ['llamacpp'], ['custom'], {}, null])
  {
    assert.throws(() => readConnections({ ...settings, mode: malformed }, 'epoch'));
    assert.throws(() => readConnections({ ...settings, profiles: [{ ...profile, kind: malformed }] }, 'epoch'));
  }
});

test('DEV-004A: optional discovery sends no prose or credentials and needs no model ID', async () =>
{
  let calls = 0;
  const found = await discoverModels(profile, new AbortController().signal, async (url, options) =>
  {
    calls++;
    assert.equal(url, 'http://127.0.0.1:8081/v1/models');
    assert.equal(options?.method, 'GET');
    assert.equal(options?.body, undefined);
    assert.equal(options?.credentials, 'omit');
    assert.equal(options?.redirect, 'error');
    assert.equal(options?.referrerPolicy, 'no-referrer');
    assert.deepEqual(options?.headers, {});
    return json({ data: [{ id: 'first' }, { id: 'first' }, { id: 'second' }] });
  });
  assert.deepEqual(found, ['first', 'second']);
  assert.equal(calls, 1);
  await assert.rejects(discoverModels(profile, new AbortController().signal, async () => json({ data: [{ id: null }] })), /Enter a model ID manually/);
});

test('DEV-004A: browser narration captures chosen config, sends prose only and requires explicit acceptance', async () =>
{
  const f = fixture(async (url, options) =>
  {
    assert.equal(url, 'http://127.0.0.1:8081/v1/chat/completions');
    assert.equal(options?.credentials, 'omit');
    assert.equal(options?.redirect, 'error');
    const body = JSON.parse(String(options?.body));
    assert.equal(body.model, 'chosen-model');
    assert.equal(body.stream, false);
    assert.equal(body.messages.at(-1).content, 'The player’s next passage.');
    assert.equal(JSON.stringify(body).includes('adventureId'), false);
    return json(complete('New prose.\n\nAnother paragraph. 🦉'));
  });
  await f.coordinator.generate();
  assert.equal(f.coordinator.state.phase, 'ready');
  assert.equal(f.writes(), 0);
  await f.coordinator.accept();
  assert.equal(f.writes(), 1);
  assert.equal(f.coordinator.state.snapshot.adventure.version, 1);
  f.coordinator.dispose();
});

test('DEV-004A: failures never fall back, expose raw bodies or change canon/input', async () =>
{
  const invalid = [
    { choices: [] },
    { choices: [{ finish_reason: 'length', message: { role: 'assistant', content: 'Partial' } }] },
    { choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: 'Tool', tool_calls: [{}] } }] },
    complete(''), complete('x'.repeat(20001))
  ];
  const fetchers: (typeof fetch)[] = invalid.map(value => async () => json(value));
  fetchers.push(async () => new Response('RAW_SECRET_RESPONSE', { status: 401 }), async () => { throw new Error('RAW_SECRET_EXCEPTION'); });
  for (const fetcher of fetchers)
  {
    const f = fixture(fetcher);
    await f.coordinator.generate();
    assert.equal(f.coordinator.state.phase, 'idle');
    assert.equal(f.coordinator.state.candidate, null);
    assert.equal(f.coordinator.state.input, 'The player’s next passage.');
    assert.equal(f.writes(), 0);
    assert.doesNotMatch(f.coordinator.state.error, /RAW_SECRET/);
    assert.ok(f.coordinator.state.error);
    f.coordinator.dispose();
  }
});

test('DEV-004A: editing a profile cannot retarget an outstanding request', async () =>
{
  const selected = { ...profile };
  let reply!: (response: Response) => void;
  let requestBody = '';
  let requestURL = '';
  const pending = generateLocal(selected, { input: 'Continue here.', history: [] }, new AbortController().signal, async (url, options) =>
  {
    requestURL = String(url);
    requestBody = String(options?.body);
    return new Promise(resolve => { reply = resolve; });
  });
  selected.baseUrl = 'http://different-server/v1';
  selected.model = 'different-model';
  selected.timeoutMs = 300000;
  reply(json(complete()));
  assert.equal(await pending, 'A complete continuation.');
  assert.equal(requestURL, `${profile.baseUrl}/chat/completions`);
  assert.equal(JSON.parse(requestBody).model, profile.model);
});

test('DEV-004A: timeout aborts HTTP and discarded late responses cannot revive a stopped attempt', async t =>
{
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let timedSignal: AbortSignal | null = null;
  const timeout = fixture(async (_url, options) => new Promise((_resolve, reject) =>
  {
    timedSignal = options!.signal!;
    timedSignal.addEventListener('abort', () => reject(timedSignal!.reason), { once: true });
  }));
  const waiting = timeout.coordinator.generate();
  t.mock.timers.tick(1000);
  await waiting;
  assert.equal(timedSignal!.aborted, true);
  assert.match(timeout.coordinator.state.error, /timed out/);
  assert.equal(timeout.writes(), 0);
  timeout.coordinator.dispose();

  let resolve!: (value: Response) => void;
  let sentSignal: AbortSignal | null = null;
  const late = fixture(async (_url, options) =>
  {
    sentSignal = options!.signal!;
    return new Promise(yes => { resolve = yes; });
  });
  const generating = late.coordinator.generate();
  late.coordinator.stop();
  assert.equal(sentSignal!.aborted, true);
  resolve(json(complete('Must never return.')));
  await generating;
  assert.equal(late.coordinator.state.candidate, null);
  assert.equal(late.coordinator.state.phase, 'idle');
  assert.equal(late.writes(), 0);
  late.coordinator.dispose();
});

test('DEV-004A: oversized and malformed JSON cannot become a proposal; discovery is not a prerequisite', async () =>
{
  for (const response of [new Response('x'.repeat(1048577)), new Response('{invalid')])
  {
    const f = fixture(async () => response);
    await f.coordinator.generate();
    assert.equal(f.coordinator.state.candidate, null);
    assert.equal(f.writes(), 0);
    f.coordinator.dispose();
  }
  await assert.rejects(discoverModels(profile, new AbortController().signal, async () => new Response('', { status: 404 })));
  assert.equal(await generateLocal(profile, { input: 'Still usable.', history: ['Accepted prose.'] }, new AbortController().signal, async (_url, options) =>
  {
    assert.match(JSON.parse(String(options?.body)).messages[1].content, /Accepted prose/);
    return json(complete());
  }), 'A complete continuation.');
});
