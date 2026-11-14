import { test } from 'node:test';
import assert from 'node:assert/strict';
import { discoverModels, generateLocal, readConnections, testConnection, type ModelProfile } from '../src/lib/models.ts';
import type { GenerationDetails } from '../src/lib/generationDiagnostics.ts';

const profile: ModelProfile = { id: 'ollama', name: 'Local Ollama', kind: 'ollama', baseUrl: 'http://127.0.0.1:11434/api', model: 'local-model:latest', timeoutMs: 1000 };
const input = { input: 'A new passage.', history: ['The accepted story.'] };
const signal = () => new AbortController().signal;
const message = (content: string, done = true, done_reason: unknown = done ? 'stop' : undefined) => ({ message: { role: 'assistant', content }, done, ...(done_reason === undefined ? {} : { done_reason }) });
const json = (value: unknown) => new Response(JSON.stringify(value));

function stream(values: unknown[], ending = '\n', chunks = 17): Response
{
  const bytes = new TextEncoder().encode(values.map(value => JSON.stringify(value)).join('\r\n') + ending);
  return new Response(new ReadableStream({
    start(controller)
    {
      for (let offset = 0; offset < bytes.length; offset += chunks) controller.enqueue(bytes.slice(offset, offset + chunks));
      controller.close();
    }
  }), { headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8' } });
}

test('DEV-004E: native Ollama profiles and optional discovery use /api/tags without story or credentials', async () =>
{
  const settings = { schemaVersion: 4, epoch: 'epoch', revision: 0, mode: 'local', activeProfileId: profile.id, profiles: [profile] };
  assert.deepEqual(readConnections(settings, 'epoch'), settings);
  const result = await discoverModels(profile, signal(), async (url, options) =>
  {
    assert.equal(url, `${profile.baseUrl}/tags`);
    assert.equal(options?.method, 'GET');
    assert.equal(options?.body, undefined);
    assert.equal(options?.credentials, 'omit');
    assert.equal(options?.redirect, 'error');
    assert.equal(options?.referrerPolicy, 'no-referrer');
    assert.deepEqual(options?.headers, {});
    return json({ models: [{ name: 'first' }, { name: 'first' }, { name: 'second' }] });
  });
  assert.deepEqual(result, ['first', 'second']);
  for (const value of [{ models: [{}] }, { models: [{ name: '\ud800' }] }, { error: 'PRIVATE', models: [] }, { data: [] }])
    await assert.rejects(discoverModels(profile, signal(), async () => json(value)), /Enter a model ID manually/);
});

test('DEV-004E: completed native requests capture settings, send prose and report only provided usage', async () =>
{
  const selected = { ...profile };
  const reports: GenerationDetails[] = [];
  let reply!: (response: Response) => void;
  const pending = generateLocal(selected, input, signal(), async (url, options) =>
  {
    assert.equal(url, `${profile.baseUrl}/chat`);
    assert.equal(options?.credentials, 'omit');
    const body = JSON.parse(String(options?.body));
    assert.equal(body.model, profile.model);
    assert.equal(body.stream, false);
    assert.deepEqual(Object.keys(body).sort(), ['messages', 'model', 'stream']);
    assert.match(body.messages[1].content, /The accepted story/);
    assert.equal(body.messages.at(-1).content, input.input);
    return new Promise(resolve => { reply = resolve; });
  }, undefined, details => reports.push(details));
  selected.model = 'different-model';
  selected.baseUrl = 'http://different-server/api';
  reply(json({ ...message('Prose. 🦉'), prompt_eval_count: 0, eval_count: 8, total_duration: 999 }));
  assert.equal(await pending, 'Prose. 🦉');
  assert.equal(reports.at(-1)?.requestedModel, profile.model);
  assert.deepEqual(reports.at(-1)?.usage, { prompt: 0, completion: 8, total: null });
  assert.doesNotMatch(JSON.stringify(reports), /total_duration|http:|Prose/);
});

test('DEV-004E: native NDJSON handles fragmented UTF-8, terminal content/usage and final lines without newline', async () =>
{
  for (const ending of ['\n', ''])
  {
    const progress: string[] = [];
    let details: GenerationDetails | null = null;
    const result = await generateLocal(profile, input, signal(), async (_url, options) =>
    {
      assert.equal(JSON.parse(String(options?.body)).stream, true);
      return stream([
        { ...message('', false), message: { role: 'assistant', content: '', thinking: 'PRIVATE_REASONING' } },
        message('Next 🦉', false),
        { ...message(' passage.'), prompt_eval_count: 10, eval_count: 0 }
      ], ending, 1);
    }, text => progress.push(text), value => { details = value; });
    assert.equal(result, 'Next 🦉 passage.');
    assert.deepEqual(progress, ['Next 🦉']);
    assert.deepEqual((details as GenerationDetails | null)?.usage, { prompt: 10, completion: 0, total: null });
    assert.doesNotMatch(result + JSON.stringify(details), /PRIVATE_REASONING/);
  }
});

test('DEV-004E: incomplete, malformed, tool, thinking-only, oversized and failed native output is rejected', async () =>
{
  const tool = { ...message('Do not accept'), message: { role: 'assistant', content: 'Do not accept', tool_calls: [{ function: { name: 'write' } }] } };
  const invalid = [message('partial', false), message('partial', true, 'length'), message('wrong', true, null),
    { ...message('wrong'), done: 'true' }, { ...message('wrong'), error: 'PRIVATE' }, tool,
    message(''), message('\ud800'), message('x'.repeat(20001)), { message: { role: 'user', content: 'wrong' }, done: true, done_reason: 'stop' }];
  for (const value of invalid)
  {
    for (const streaming of [false, true])
    {
      let usage: unknown = null;
      await assert.rejects(generateLocal(profile, input, signal(), async () => streaming ? stream([value]) : json(value), streaming ? () => {} : undefined, details => { usage = details.usage; }), /Ollama/);
      assert.equal(usage, null);
    }
  }
  for (const response of [
    stream([message('partial', false), { error: 'PRIVATE_ERROR' }]),
    new Response('{invalid\n', { headers: { 'Content-Type': 'application/x-ndjson' } }),
    new Response(new Uint8Array([255, 10]), { headers: { 'Content-Type': 'application/x-ndjson' } }),
    new Response('x'.repeat(1048577), { headers: { 'Content-Type': 'application/x-ndjson' } }),
    new Response('data: [DONE]\n\n', { headers: { 'Content-Type': 'text/event-stream' } })
  ]) await assert.rejects(generateLocal(profile, input, signal(), async () => response, () => {}), /Ollama/);
});

test('DEV-004E: missing or invalid native usage never rejects valid prose or invents totals', async () =>
{
  for (const counts of [{}, { prompt_eval_count: -1, eval_count: 1.5 }, { prompt_eval_count: '5', eval_count: Number.MAX_SAFE_INTEGER + 1 }, { prompt_eval_count: 4, eval_count: null }])
  {
    let usage: unknown;
    assert.equal(await generateLocal(profile, input, signal(), async () => json({ ...message('Valid prose.'), ...counts }), undefined, details => { usage = details.usage; }), 'Valid prose.');
    assert.deepEqual(usage, counts.prompt_eval_count === 4 ? { prompt: 4, completion: null, total: null } : null);
  }
});

test('DEV-004E: explicit native test uses a synthetic 32-token cap without forcing thinking or sending story', async () =>
{
  for (const reason of ['stop', 'length'])
  {
    assert.equal(await testConnection(profile, signal(), async (url, options) =>
    {
      assert.equal(url, `${profile.baseUrl}/chat`);
      assert.deepEqual(JSON.parse(String(options?.body)), { model: profile.model, stream: false, options: { num_predict: 32 }, messages: [{ role: 'user', content: 'Reply with OK.' }] });
      return json(message(reason === 'stop' ? 'OK.' : '', true, reason));
    }), reason === 'stop' ? 'complete' : 'limited');
  }
  await assert.rejects(testConnection(profile, signal(), async () => json(message(''))), /no text/);
  await assert.rejects(testConnection(profile, signal(), async () => json(message('Wrong reason.', true, ['stop']))), /Ollama/);
});

test('DEV-004E: Stop/timeout cancel native body reads; no terminal report survives failure', async t =>
{
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const timed of [false, true])
  {
    const controller = new AbortController();
    let cancelled = false;
    let requestSignal: AbortSignal | null = null;
    let reports = 0;
    const pending = generateLocal(profile, input, controller.signal, async (_url, options) =>
    {
      requestSignal = options!.signal!;
      return new Response(new ReadableStream({ cancel() { cancelled = true; } }), { headers: { 'Content-Type': 'application/x-ndjson' } });
    }, () => {}, () => { reports++; });
    await new Promise(resolve => queueMicrotask(resolve));
    if (timed) t.mock.timers.tick(1000);
    else controller.abort();
    await assert.rejects(pending, timed ? /timed out/ : undefined);
    assert.equal((requestSignal as AbortSignal | null)?.aborted, true);
    assert.equal(cancelled, true);
    assert.equal(reports, 1);
  }
});
