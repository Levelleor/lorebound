import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import path from 'node:path';

// Simulated LM Studio/vLLM contracts; browser HTTP/CORS and host/SQLite are real.
export async function exerciseNamedServers(browser, base, artifacts)
{
  let behavior = 'ok';
  let discoveryFails = false;
  let release = () => {};
  let disconnected = Promise.resolve();
  const requests = [];
  const frame = (text, finish = null) => `data: ${JSON.stringify({ choices: [{ index: 0, delta: { content: text }, finish_reason: finish }] })}\n\n`;
  const server = createServer(async (request, response) =>
  {
    response.setHeader('Access-Control-Allow-Origin', base);
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'content-type');
    if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return; }
    const bytes = [];
    for await (const chunk of request) bytes.push(chunk);
    const body = bytes.length ? JSON.parse(Buffer.concat(bytes).toString()) : null;
    requests.push({ url: request.url, method: request.method, body, headers: request.headers });
    response.setHeader('Content-Type', 'application/json');
    if (request.url === '/v1/models')
    {
      response.writeHead(discoveryFails ? 404 : 200);
      response.end(JSON.stringify({ data: [{ id: 'named-fixture' }] }));
      return;
    }
    if (request.url !== '/v1/chat/completions') { response.writeHead(404); response.end('{}'); return; }
    if (behavior === 'auth') { response.writeHead(401); response.end('SECRET_SERVER_ERROR'); return; }
    if (body.stream)
    {
      const selected = behavior;
      response.setHeader('Content-Type', 'text/event-stream');
      disconnected = new Promise(resolve => response.once('close', resolve));
      response.write(frame('Simulated named-server preview.'));
      release = () => response.end(selected === 'partial' ? '' : frame(' The road opens.', 'stop') + 'data: [DONE]\n\n');
      return;
    }
    response.end(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: 'Simulated named-server continuation.' } }] }));
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const endpoint = `http://127.0.0.1:${server.address().port}/v1`;
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try
  {
    for (const [kind, label, defaultUrl, guidance] of [
      ['lmstudio', 'LM Studio', 'http://127.0.0.1:1234/v1', 'Enable browser CORS'],
      ['vllm', 'vLLM', 'http://127.0.0.1:8000/v1', 'chat template']
    ])
    {
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.getByLabel('Adventure title').fill(`${label} contract fixture`);
      await page.getByRole('button', { name: 'Start blank adventure' }).click();
      await page.getByRole('heading', { name: `${label} contract fixture`, exact: true }).waitFor();
      const id = new URL(page.url()).searchParams.get('adventure');
      const library = await page.evaluate(() => window.wails.Call.ByName('main.LibraryService.List'));
      const read = () => page.evaluate(({ epoch, id }) => window.wails.Call.ByName('main.LibraryService.Read', { schemaVersion: 4, epoch, adventureId: id }), { epoch: library.epoch, id });
      const settings = () => page.evaluate(epoch => window.wails.Call.ByName('main.LibraryService.ReadConnections', { schemaVersion: 4, epoch }), library.epoch);
      const before = await read();
      await page.getByRole('button', { name: 'Model settings', exact: true }).click();
      await page.waitForFunction(() => !document.querySelector('#connection-name')?.disabled);
      await page.getByRole('button', { name: 'New', exact: true }).click();
      const select = page.getByLabel('Server type', { exact: true });
      await select.selectOption(kind);
      assert.equal(await page.getByLabel('API base URL', { exact: true }).inputValue(), defaultUrl);
      await page.getByText(new RegExp(guidance)).waitFor();
      await page.getByLabel('API base URL', { exact: true }).fill(endpoint);
      await select.selectOption('ollama');
      await select.selectOption(kind);
      assert.equal(await page.getByLabel('API base URL', { exact: true }).inputValue(), endpoint, 'Edited URLs survive type changes');
      await page.getByLabel('Connection name', { exact: true }).fill(`${label} simulated contract`);
      discoveryFails = kind === 'vllm';
      await page.getByRole('button', { name: 'Discover models', exact: true }).click();
      if (discoveryFails) await page.getByRole('alert').filter({ hasText: 'enter a model ID manually' }).waitFor();
      else await page.getByRole('status', { name: 'Model discovery result' }).waitFor();
      await page.getByLabel('Model ID', { exact: true }).fill('named-fixture');
      const unsaved = await settings();
      await page.getByRole('button', { name: 'Test connection', exact: true }).click();
      await page.getByRole('status', { name: 'Connection test result' }).filter({ hasText: 'Connection successful' }).waitFor();
      assert.deepEqual(await settings(), unsaved, 'Tests never save the entered profile');
      assert.deepEqual(requests.at(-1).body, { model: 'named-fixture', stream: false, max_tokens: 32, messages: [{ role: 'user', content: 'Reply with OK.' }] });
      for (const theme of ['dark', 'bright'])
      {
        await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
        for (const width of [390, 768, 1024, 1440])
        {
          await page.setViewportSize({ width, height: 900 });
          await page.getByRole('dialog').evaluate(element => element.scrollTop = 0);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          assert.equal(await page.getByRole('dialog').evaluate(element => element.scrollWidth <= element.clientWidth), true);
          if (artifacts) await page.screenshot({ path: path.join(artifacts, `named-${kind}-${theme}-${width}.png`) });
        }
      }
      await page.getByRole('button', { name: 'Save and use profile', exact: true }).click();
      await page.getByRole('dialog').waitFor({ state: 'detached' });
      const saved = await settings();
      assert.equal(saved.profiles.find(profile => profile.id === saved.activeProfileId).kind, kind);
      await page.reload({ waitUntil: 'networkidle' });
      await page.locator('.composer-heading').getByText(`${label} simulated contract · named-fixture`, { exact: true }).waitFor();
      await page.getByLabel('Story input', { exact: true }).fill('Retain this named-server input.');
      const generate = () => page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
      const proposal = page.getByRole('region', { name: 'Proposed turn', exact: true });
      await generate();
      await proposal.waitFor();
      await page.locator('.generation-inspector summary').click();
      const serverType = page.locator('.generation-inspector dt').filter({ hasText: /^Server type$/ }).locator('+ dd');
      assert.equal(await serverType.innerText(), label);
      assert.deepEqual(await read(), before);
      await page.getByRole('button', { name: 'Discard', exact: true }).click();
      await page.getByLabel('Stream output', { exact: false }).check();
      for (const outcome of ['partial', 'stop', 'accept'])
      {
        behavior = outcome === 'partial' ? 'partial' : 'ok';
        await generate();
        await page.getByRole('region', { name: 'Generating proposal', exact: true }).getByText('Simulated named-server preview.', { exact: true }).waitFor();
        assert.equal(await page.getByRole('button', { name: 'Accept turn', exact: true }).count(), 0);
        assert.deepEqual(await read(), before);
        if (outcome === 'stop')
        {
          const stopped = disconnected;
          await page.getByRole('button', { name: 'Stop generation', exact: true }).click();
          await stopped;
          release();
        }
        else
        {
          release();
          if (outcome === 'partial') await page.getByRole('alert').waitFor();
          else
          {
            await proposal.waitFor();
            assert.equal(await serverType.innerText(), label);
            assert.deepEqual(await read(), before);
            await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
            await page.locator('.accepted-turn').waitFor();
          }
        }
        if (outcome !== 'accept')
        {
          assert.equal(await proposal.count(), 0);
          assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), 'Retain this named-server input.');
          assert.deepEqual(await read(), before);
        }
      }
      const accepted = await read();
      assert.equal(accepted.adventure.version, 1);
      behavior = 'auth';
      await page.getByLabel('Story input', { exact: true }).fill('Keep after access failure.');
      await generate();
      await page.getByRole('alert').filter({ hasText: 'requires access' }).waitFor();
      assert.equal(await proposal.count(), 0);
      assert.doesNotMatch(await page.getByRole('alert').innerText(), /SECRET_SERVER_ERROR/);
      assert.deepEqual(await read(), accepted);
      behavior = 'ok';
    }
    for (const request of requests)
    {
      assert.equal(request.headers.origin, base);
      assert.equal(request.headers.cookie, undefined);
      assert.equal(request.headers.authorization, undefined);
      assert.equal(request.headers.referer, undefined);
      if (request.body) assert.equal(request.body.chat_template_kwargs, undefined);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: named LM Studio/vLLM defaults, URL preservation, optional discovery/manual model/tests, saved reload, completed/SSE diagnostics, explicit acceptance and Stop/error canon isolation; provider replies are simulated');
  }
  finally
  {
    await context.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
