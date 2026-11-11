import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import path from 'node:path';

export async function exerciseConnectionTest(browser, base, artifacts)
{
  let behavior = 'ok';
  let received = () => {};
  let closed = () => {};
  let finishDelayed = () => {};
  const requests = [];
  const server = createServer(async (request, response) =>
  {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    if (behavior !== 'cors') response.setHeader('Access-Control-Allow-Origin', base);
    response.setHeader('Access-Control-Allow-Headers', 'content-type');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Content-Type', 'application/json');
    if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return; }
    requests.push({ url: request.url, headers: request.headers, body: JSON.parse(Buffer.concat(chunks).toString()) });
    if (behavior === 'auth') { response.writeHead(401); response.end('SECRET_PROVIDER_BODY'); return; }
    if (behavior === 'model') { response.writeHead(404); response.end('SECRET_MODEL_ERROR'); return; }
    if (behavior === 'redirect') { response.writeHead(302, { Location: '/must-not-follow' }); response.end(); return; }
    if (behavior === 'malformed') { response.end('{SECRET_INVALID_JSON'); return; }
    const reply = JSON.stringify({ choices: [{ finish_reason: behavior === 'length' ? 'length' : 'stop', message: {
      role: 'assistant', content: behavior === 'length' ? '' : 'SECRET_TEST_OUTPUT',
      ...(behavior === 'tool' ? { tool_calls: [{}] } : {})
    } }] });
    if (behavior === 'delay')
    {
      response.flushHeaders();
      response.on('close', closed);
      finishDelayed = () => response.end(reply);
      received();
    }
    else response.end(reply);
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const endpoint = `http://127.0.0.1:${server.address().port}/v1`;
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try
  {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByLabel('Adventure title').fill('Connection test fixture');
    await page.getByRole('button', { name: 'Start blank adventure' }).click();
    await page.getByLabel('Story input', { exact: true }).fill('Player prose must never enter a connection test.');
    await page.getByRole('status', { name: 'Draft status' }).filter({ hasText: 'Draft saved' }).waitFor();
    const id = new URL(page.url()).searchParams.get('adventure');
    const library = await page.evaluate(() => window.wails.Call.ByName('main.LibraryService.List'));
    const read = method => page.evaluate(({ method, epoch, id }) => window.wails.Call.ByName(`main.LibraryService.${method}`, {
      schemaVersion: 4, epoch, ...(method === 'ReadConnections' ? {} : { adventureId: id }),
      ...(method === 'ReadDraft' ? { target: 'composer_story' } : {})
    }), { method, epoch: library.epoch, id });
    const before = await read('Read');
    const draft = await read('ReadDraft');
    const settings = await read('ReadConnections');
    const result = page.getByLabel('Connection test result', { exact: true });
    const test = () => page.getByRole('button', { name: 'Test connection', exact: true }).click();
    const open = async () =>
    {
      await page.getByRole('button', { name: 'Model settings', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('#connection-name')?.disabled === false);
      await page.getByRole('button', { name: 'New', exact: true }).click();
      await page.getByLabel('API base URL', { exact: true }).fill(endpoint);
      await page.getByLabel('Request timeout (seconds)', { exact: true }).fill('1');
    };
    const prepareDelay = () =>
    {
      behavior = 'delay';
      return {
        received: new Promise(resolve => { received = resolve; }),
        closed: new Promise(resolve => { closed = resolve; })
      };
    };
    await open();
    assert.equal(requests.length, 0, 'Opening settings never tests automatically');
    await test();
    await result.filter({ hasText: 'Enter a model ID' }).waitFor();
    assert.equal(requests.length, 0);
    await page.getByLabel('Model ID', { exact: true }).fill('entered-fixture-model');
    assert.equal(await result.count(), 0, 'Editing clears a previous result');
    for (const kind of ['llamacpp', 'custom'])
    {
      await page.getByLabel('Server type', { exact: true }).selectOption(kind);
      await test();
      await result.filter({ hasText: 'complete text response' }).waitFor();
    }
    for (const field of ['#connection-name', '#model-base-url', '#model-id', '#model-timeout'])
    {
      const input = page.locator(field);
      const original = await input.inputValue();
      await input.fill(field === '#model-timeout' ? '2' : `${original}x`);
      assert.equal(await result.count(), 0, 'Every edited field invalidates test feedback');
      await input.fill(original);
      await test();
      await result.filter({ hasText: 'complete text response' }).waitFor();
    }
    if (artifacts)
    {
      for (const theme of ['dark', 'bright'])
      {
        await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
        for (const width of [390, 768, 1024, 1440])
        {
          await page.setViewportSize({ width, height: 900 });
          await result.scrollIntoViewIfNeeded();
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          assert.equal(await page.getByRole('dialog').evaluate(element => element.scrollWidth <= element.clientWidth && element.getBoundingClientRect().height <= 810), true);
          await page.screenshot({ path: path.join(artifacts, `connection-test-${theme}-${width}.png`) });
        }
      }
      await page.evaluate(() => document.documentElement.dataset.loreboundUi = 'dark');
    }
    behavior = 'length';
    await test();
    await result.filter({ hasText: '32-token limit' }).waitFor();
    for (const failure of ['auth', 'model', 'malformed', 'tool', 'redirect', 'cors'])
    {
      behavior = failure;
      await test();
      await page.getByRole('alert', { name: 'Connection test result' }).waitFor();
      assert.doesNotMatch(await result.innerText(), /SECRET/);
      assert.equal(await page.getByRole('button', { name: 'Save and use profile', exact: true }).isEnabled(), true);
    }
    const timeout = prepareDelay();
    await test();
    await timeout.received;
    await result.filter({ hasText: 'timed out' }).waitFor();
    await timeout.closed;
    finishDelayed();
    await page.setViewportSize({ width: 390, height: 900 });
    const stopped = prepareDelay();
    await test();
    await stopped.received;
    assert.equal(await page.getByLabel('Model ID', { exact: true }).isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: 'Save and use profile', exact: true }).isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: 'Discover models', exact: true }).isDisabled(), true);
    const stop = page.getByRole('button', { name: 'Stop connection test', exact: true });
    await stop.scrollIntoViewIfNeeded();
    assert.equal(await stop.evaluate(element =>
    {
      const bounds = element.getBoundingClientRect();
      return bounds.left >= 0 && bounds.right <= innerWidth && bounds.top >= 0 && bounds.bottom <= innerHeight;
    }), true, 'Stop remains visible and fits the narrow viewport');
    if (artifacts) await page.screenshot({ path: path.join(artifacts, 'connection-test-stop-dark-390.png') });
    await stop.focus();
    await page.keyboard.press('Enter');
    await result.filter({ hasText: 'test stopped' }).waitFor();
    await stopped.closed;
    const finishOld = finishDelayed;
    behavior = 'ok';
    await test();
    await result.filter({ hasText: 'complete text response' }).waitFor();
    finishOld();
    assert.match(await result.innerText(), /complete text response/);
    const escaped = prepareDelay();
    await test();
    await escaped.received;
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await escaped.closed;
    finishDelayed();
    assert.equal(await page.getByRole('button', { name: 'Model settings', exact: true }).evaluate(element => element === document.activeElement), true);
    await open();
    assert.equal(await result.count(), 0, 'Closing settings discards the result');
    await page.getByLabel('Model ID', { exact: true }).fill('entered-fixture-model');
    const reloaded = prepareDelay();
    await test();
    await reloaded.received;
    await page.reload({ waitUntil: 'networkidle' });
    await reloaded.closed;
    finishDelayed();
    assert.equal(await result.count(), 0);
    assert.equal(await page.getByRole('region', { name: 'Proposed turn', exact: true }).count(), 0);
    assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), draft.text);
    assert.deepEqual(await read('Read'), before);
    assert.deepEqual(await read('ReadDraft'), draft);
    assert.deepEqual(await read('ReadConnections'), settings, 'Testing never saves or selects a profile');
    for (const request of requests)
    {
      assert.equal(request.url, '/v1/chat/completions', 'No discovery, redirect or fallback endpoint');
      assert.equal(request.headers.authorization, undefined);
      assert.equal(request.headers.cookie, undefined);
      assert.equal(request.headers.referer, undefined);
      assert.equal(request.headers.origin, base);
      assert.deepEqual(request.body, { model: 'entered-fixture-model', stream: false, max_tokens: 32, messages: [{ role: 'user', content: 'Reply with OK.' }] });
    }
    // A failed optional test must not gate saving a manual profile.
    await open();
    await page.getByLabel('Connection name', { exact: true }).fill('Optional test fixture');
    await page.getByLabel('Model ID', { exact: true }).fill('entered-fixture-model');
    behavior = 'model';
    await test();
    await result.filter({ hasText: 'API or model' }).waitFor();
    await page.getByRole('button', { name: 'Save and use profile', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    assert.equal((await read('ReadConnections')).revision, settings.revision + 1);
    assert.deepEqual(await read('Read'), before);
    assert.deepEqual(errors, []);
    console.log('PASS: optional connection tests use unsaved settings and synthetic-only direct HTTP; redacted failures, token limit, Stop/Escape/reload, no settings/draft/canon writes; provider responses are simulated');
  }
  finally
  {
    await context.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
