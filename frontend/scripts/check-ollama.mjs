import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import path from 'node:path';

// Ollama replies are simulated; browser HTTP/CORS/abort and Go/SQLite are real.
export async function exerciseOllama(browser, base, artifacts)
{
  let behavior = 'ok';
  let discoveryFails = true;
  let release = () => {};
  let received = () => {};
  let closed = Promise.resolve();
  const requests = [];
  const row = (content, done = false, extra = {}) => JSON.stringify({ message: { role: 'assistant', content }, done, ...extra }) + '\n';
  const server = createServer(async (request, response) =>
  {
    if (behavior !== 'cors') response.setHeader('Access-Control-Allow-Origin', base);
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'content-type');
    if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return; }
    const bytes = [];
    for await (const part of request) bytes.push(part);
    const body = bytes.length ? JSON.parse(Buffer.concat(bytes).toString()) : null;
    requests.push({ path: request.url, method: request.method, body, headers: request.headers });
    response.setHeader('Content-Type', 'application/json');
    if (request.url === '/api/tags')
    {
      response.writeHead(discoveryFails ? 404 : 200);
      response.end(JSON.stringify(discoveryFails ? { error: 'Not available' } : { models: [{ name: 'native-fixture' }] }));
      return;
    }
    if (request.url !== '/api/chat' || behavior === 'missing') { response.writeHead(404); response.end('PRIVATE'); return; }
    if (!body.stream)
    {
      if (behavior === 'delay-test')
      {
        closed = new Promise(resolve => response.once('close', resolve));
        response.flushHeaders();
        received();
        release = () => response.end(row('Late test.', true, { done_reason: 'stop' }));
        return;
      }
      response.end(row(body.options ? 'OK.' : 'Completed native prose.', true, { done_reason: behavior === 'length' ? 'length' : 'stop', prompt_eval_count: 11, eval_count: 4 }));
      return;
    }
    const selected = behavior;
    response.setHeader('Content-Type', 'application/x-ndjson');
    closed = new Promise(resolve => response.once('close', resolve));
    response.write(row('Native preview. Café 🦉'));
    release = () =>
    {
      if (selected === 'truncated') { response.end(); return; }
      if (selected === 'error') { response.end(JSON.stringify({ error: 'PRIVATE_NATIVE_BODY' }) + '\n'); return; }
      response.end(row(' The path opens.', true, { done_reason: selected === 'length' ? 'length' : 'stop', prompt_eval_count: 11, eval_count: 4 }));
    };
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try
  {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByLabel('Adventure title').fill('Native Ollama fixture');
    await page.getByRole('button', { name: 'Start blank adventure' }).click();
    await page.getByRole('heading', { name: 'Native Ollama fixture', exact: true }).waitFor();
    const adventureUrl = page.url();
    const id = new URL(adventureUrl).searchParams.get('adventure');
    const library = await page.evaluate(() => window.wails.Call.ByName('main.LibraryService.List'));
    const read = () => page.evaluate(({ epoch, id }) => window.wails.Call.ByName('main.LibraryService.Read', { schemaVersion: 4, epoch, adventureId: id }), { epoch: library.epoch, id });
    const settings = () => page.evaluate(epoch => window.wails.Call.ByName('main.LibraryService.ReadConnections', { schemaVersion: 4, epoch }), library.epoch);
    const before = await read();
    const openModels = async () =>
    {
      await page.getByRole('button', { name: 'Model settings', exact: true }).click();
      await page.waitForFunction(() => !document.querySelector('#connection-name')?.disabled);
    };
    const capture = async name =>
    {
      if (!artifacts) return;
      for (const theme of ['dark', 'bright'])
      {
        await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
        for (const width of [390, 768, 1024, 1440])
        {
          await page.setViewportSize({ width, height: 900 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          if (name === 'settings') await page.getByRole('dialog').evaluate(element => { element.scrollTop = 0; });
          else
          {
            await page.locator('.generation-inspector').scrollIntoViewIfNeeded();
            assert.equal(await page.locator('.generation-inspector').evaluate(element => element.scrollWidth <= element.clientWidth), true);
            assert.ok(await page.getByRole('button', { name: 'Accept turn', exact: true }).evaluate(element => element.getBoundingClientRect().bottom <= innerHeight));
          }
          await page.screenshot({ path: path.join(artifacts, `ollama-${name}-${theme}-${width}.png`) });
        }
      }
      await page.evaluate(() => document.documentElement.dataset.loreboundUi = 'dark');
    };
    await openModels();
    await page.getByRole('button', { name: 'New', exact: true }).click();
    await page.getByLabel('Connection name', { exact: true }).fill('Ollama fixture');
    await page.getByLabel('Server type', { exact: true }).selectOption('ollama');
    assert.equal(await page.getByLabel('API base URL', { exact: true }).inputValue(), 'http://127.0.0.1:11434/api');
    await page.getByText(/OLLAMA_ORIGINS/).waitFor();
    await page.getByLabel('API base URL', { exact: true }).fill(`http://127.0.0.1:${server.address().port}/api`);
    await page.getByLabel('Server type', { exact: true }).selectOption('custom');
    await page.getByLabel('Server type', { exact: true }).selectOption('ollama');
    assert.match(await page.getByLabel('API base URL', { exact: true }).inputValue(), new RegExp(`:${server.address().port}/api$`), 'Switching types preserves an edited endpoint');
    await page.getByRole('button', { name: 'Discover models', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'enter a model ID manually' }).waitFor();
    await page.getByLabel('Model ID', { exact: true }).fill('native-fixture');
    discoveryFails = false;
    await page.getByRole('button', { name: 'Discover models', exact: true }).click();
    await page.getByRole('status', { name: 'Model discovery result' }).waitFor();
    const settingsBeforeTest = await settings();
    for (const mode of ['missing', 'length', 'ok'])
    {
      behavior = mode;
      await page.getByRole('button', { name: 'Test connection', exact: true }).click();
      await page.getByLabel('Connection test result', { exact: true }).filter({ hasText: mode === 'missing' ? 'could not find' : mode === 'length' ? '32-token limit' : 'Connection successful' }).waitFor();
      assert.deepEqual(await settings(), settingsBeforeTest);
      assert.deepEqual(await read(), before);
    }
    behavior = 'delay-test';
    const testArrived = new Promise(resolve => { received = resolve; });
    await page.getByRole('button', { name: 'Test connection', exact: true }).click();
    await testArrived;
    await page.getByRole('button', { name: 'Stop connection test', exact: true }).click();
    await closed;
    release();
    await page.getByLabel('Connection test result', { exact: true }).filter({ hasText: 'stopped' }).waitFor();
    assert.deepEqual(await settings(), settingsBeforeTest);
    assert.deepEqual(await read(), before);
    behavior = 'ok';
    await capture('settings');
    await page.getByRole('button', { name: 'Save and use profile', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('.composer-heading').getByText('Ollama fixture · native-fixture', { exact: true }).waitFor();
    assert.equal((await settings()).profiles.find(profile => profile.name === 'Ollama fixture').kind, 'ollama');
    const begin = async () =>
    {
      await page.getByLabel('Story input', { exact: true }).fill('Keep this native input.');
      await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    };
    await begin();
    await page.getByRole('button', { name: 'Accept turn', exact: true }).waitFor();
    assert.deepEqual(await read(), before);
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await page.getByRole('button', { name: 'Accept turn', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await page.locator('.accepted-turn').waitFor();
    let accepted = await read();
    assert.equal(accepted.adventure.version, 1);
    assert.match(JSON.stringify(accepted.turns), /Completed native prose/);
    await page.getByLabel('Stream output', { exact: false }).check();
    await begin();
    await page.getByRole('region', { name: 'Generating proposal', exact: true }).getByText(/Native preview/).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Accept turn', exact: true }).count(), 0);
    assert.deepEqual(await read(), accepted);
    release();
    await page.getByRole('button', { name: 'Accept turn', exact: true }).waitFor();
    await page.locator('.generation-inspector summary').focus();
    await page.keyboard.press('Enter');
    await page.locator('.generation-inspector dd').getByText('Ollama', { exact: true }).waitFor();
    await page.locator('.generation-inspector dd').getByText('Not reported', { exact: true }).waitFor();
    assert.match(await page.locator('.generation-inspector').innerText(), /11[\s\S]*4/);
    await capture('diagnostics');
    await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await page.waitForFunction(() => document.querySelectorAll('.accepted-turn').length === 2);
    accepted = await read();
    assert.equal(accepted.adventure.version, 2);
    assert.match(JSON.stringify(accepted.turns), /Native preview.*The path opens/);
    for (const mode of ['length', 'truncated', 'error'])
    {
      behavior = mode;
      await begin();
      await page.getByRole('region', { name: 'Generating proposal', exact: true }).waitFor();
      release();
      await page.getByRole('alert').waitFor();
      assert.equal(await page.getByRole('button', { name: 'Accept turn', exact: true }).count(), 0);
      assert.doesNotMatch(await page.getByRole('alert').innerText(), /PRIVATE/);
      assert.deepEqual(await read(), accepted);
      assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), 'Keep this native input.');
    }
    for (const mode of ['missing', 'cors'])
    {
      behavior = mode;
      await begin();
      await page.getByRole('alert').waitFor();
      assert.deepEqual(await read(), accepted);
    }
    behavior = 'ok';
    await begin();
    await page.getByRole('region', { name: 'Generating proposal', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Stop generation', exact: true }).click();
    await closed;
    release();
    await page.locator('.generation-inspector summary').getByText('Generation details · Stopped', { exact: true }).waitFor();
    assert.deepEqual(await read(), accepted);
    await begin();
    await page.getByRole('region', { name: 'Generating proposal', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Library', exact: true }).click();
    await closed;
    release();
    await page.goto(adventureUrl, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.generation-inspector').count(), 0);
    assert.deepEqual(await read(), accepted);
    await openModels();
    await page.getByLabel('Request timeout (seconds)', { exact: true }).fill('1');
    await page.getByRole('button', { name: 'Save and use profile', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await page.getByLabel('Stream output', { exact: false }).check();
    await begin();
    await page.getByRole('alert').filter({ hasText: 'timed out' }).waitFor();
    await closed;
    assert.deepEqual(await read(), accepted);
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.generation-inspector').count(), 0);
    for (const request of requests)
    {
      assert.equal(request.headers.origin, base);
      assert.equal(request.headers.authorization, undefined);
      assert.equal(request.headers.cookie, undefined);
      assert.equal(request.headers.referer, undefined);
      assert.ok(['/api/tags', '/api/chat'].includes(request.path));
    }
    const testRequest = requests.find(request => request.body?.options);
    assert.deepEqual(testRequest.body.options, { num_predict: 32 });
    assert.deepEqual(testRequest.body.messages, [{ role: 'user', content: 'Reply with OK.' }]);
    assert.deepEqual(errors, []);
    console.log('PASS: simulated native Ollama discovery/test/completed/NDJSON, real Firefox transport/cancellation and Go/SQLite isolation');
  }
  finally
  {
    await context.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
