import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modelError, testConnection } from '../src/lib/models.ts';

const connection = { baseUrl: 'http://127.0.0.1:8081/v1', model: 'entered-model', timeoutMs: 1000 };
const responseValue = (content: unknown = 'OK', finish: unknown = 'stop') => ({ choices: [{ finish_reason: finish, message: { role: 'assistant', content } }] });
const json = (value: unknown) => new Response(JSON.stringify(value));

test('DEV-004C: connection test sends one bounded synthetic request using a captured unsaved configuration', async () =>
{
  const selected = { ...connection };
  let respond!: (value: Response) => void;
  let calls = 0;
  const pending = testConnection(selected, new AbortController().signal, async (url, options) =>
  {
    calls++;
    assert.equal(url, `${connection.baseUrl}/chat/completions`);
    assert.equal(options?.method, 'POST');
    assert.equal(options?.credentials, 'omit');
    assert.equal(options?.mode, 'cors');
    assert.equal(options?.redirect, 'error');
    assert.equal(options?.referrerPolicy, 'no-referrer');
    assert.equal(options?.cache, 'no-store');
    assert.deepEqual(options?.headers, { 'Content-Type': 'application/json' });
    assert.deepEqual(JSON.parse(String(options?.body)), {
      model: 'entered-model', stream: false, max_tokens: 32,
      messages: [{ role: 'user', content: 'Reply with OK.' }]
    });
    return new Promise(resolve => { respond = resolve; });
  });
  selected.model = 'different-model';
  selected.baseUrl = 'http://different-server/v1';
  respond(json(responseValue()));
  assert.equal(await pending, 'complete');
  assert.equal(calls, 1);
});

test('DEV-004C: token-limited tests report their limit, including reasoning models without final text', async () =>
{
  for (const content of ['Partial', '', null])
    assert.equal(await testConnection(connection, new AbortController().signal, async () => json(responseValue(content, 'length'))), 'limited');
});

test('DEV-004C: invalid configuration never sends a test', async () =>
{
  let calls = 0;
  const fetcher: typeof fetch = async () => { calls++; return json(responseValue()); };
  for (const value of [
    { ...connection, model: '' }, { ...connection, model: 'x'.repeat(201) },
    { ...connection, model: '\ud800' }, { ...connection, timeoutMs: 0 },
    { ...connection, baseUrl: 'http://user:secret@host/v1' }, { ...connection, baseUrl: 'http://host/v1?key=secret' }
  ])
    await assert.rejects(testConnection(value, new AbortController().signal, fetcher));
  assert.equal(calls, 0);
});

test('DEV-004C: HTTP and browser-policy failures stay actionable and redacted without retry', async () =>
{
  for (const [status, message] of [[400, /HTTP 400/], [401, /requires access/], [403, /requires access/], [404, /API or model/], [429, /rate limited/], [500, /HTTP 500/]] as const)
  {
    let calls = 0;
    await assert.rejects(testConnection(connection, new AbortController().signal, async () =>
    {
      calls++;
      return new Response('SECRET_PROVIDER_BODY', { status });
    }), cause =>
    {
      assert.match(modelError(cause), message);
      assert.doesNotMatch(modelError(cause), /SECRET/);
      return true;
    });
    assert.equal(calls, 1);
  }
  await assert.rejects(testConnection(connection, new AbortController().signal, async () => { throw new Error('SECRET_TRANSPORT'); }), cause =>
  {
    assert.match(modelError(cause), /CORS\/origin/);
    assert.doesNotMatch(modelError(cause), /SECRET/);
    return true;
  });
});

test('DEV-004C: malformed, error, tool, refusal, empty and oversized responses cannot pass a test', async () =>
{
  const invalid = [
    {}, { error: 'SECRET', ...responseValue() }, { choices: [] },
    { choices: [responseValue().choices[0], responseValue().choices[0]] },
    responseValue('Partial', 'tool_calls'), responseValue('Text', ['stop']), responseValue('Text', null),
    responseValue(''), responseValue(null), responseValue({ text: 'OK' }), responseValue('\ud800'),
    responseValue('x'.repeat(20001)),
    { choices: [{ finish_reason: 'stop', message: { role: 'user', content: 'OK' } }] },
    { choices: [{ finish_reason: 'length', message: { role: 'assistant', content: '', tool_calls: [{}] } }] },
    { choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: 'OK', refusal: 'SECRET' } }] }
  ];
  for (const value of invalid)
    await assert.rejects(testConnection(connection, new AbortController().signal, async () => json(value)));
  for (const response of [new Response('{SECRET'), new Response('x'.repeat(1048577)), new Response(new Uint8Array([0xff]))])
    await assert.rejects(testConnection(connection, new AbortController().signal, async () => response), cause =>
    {
      assert.doesNotMatch(modelError(cause), /SECRET/);
      return true;
    });
});

test('DEV-004C: Stop and timeout cancel a stalled JSON response body', async t =>
{
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const timedOut of [false, true])
  {
    const stop = new AbortController();
    let cancelled = false;
    let started!: () => void;
    const reading = new Promise<void>(resolve => { started = resolve; });
    const pending = testConnection(connection, stop.signal, async () => new Response(new ReadableStream({
      pull() { started(); },
      cancel() { cancelled = true; }
    })));
    await reading;
    const rejected = assert.rejects(pending, timedOut ? /timed out/ : /aborted/);
    if (timedOut) t.mock.timers.tick(1000);
    else stop.abort();
    await rejected;
    assert.equal(cancelled, true);
  }
});

test('DEV-004C: already stopped or late test replies cannot pass', async () =>
{
  const stop = new AbortController();
  let respond!: (value: Response) => void;
  const pending = testConnection(connection, stop.signal, async () => new Promise(resolve => { respond = resolve; }));
  stop.abort();
  respond(json(responseValue()));
  await assert.rejects(pending);
  let called = false;
  await assert.rejects(testConnection(connection, stop.signal, async () => { called = true; return json(responseValue()); }));
  assert.equal(called, false);
});
