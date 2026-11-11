import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import path from 'node:path';

// Provider prose is simulated; Firefox streaming, Go and SQLite are real.
export async function exerciseStreaming(browser, base, artifacts)
{
  let behavior = 'ok';
  let release = () => {};
  let closed = Promise.resolve();
  let calls = 0;
  const requests = [];
  const frame = (content, finish = null, extra = {}) => `data: ${JSON.stringify({ choices: [{ index: 0, delta: { content, ...extra }, finish_reason: finish }] })}\n\n`;
  const server = createServer(async (request, response) =>
  {
    response.setHeader('Access-Control-Allow-Origin', base);
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'content-type');
    if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return; }
    const bytes = [];
    for await (const part of request) bytes.push(part);
    const body = JSON.parse(Buffer.concat(bytes).toString());
    requests.push({ body, headers: request.headers });
    const current = ++calls;
    if (!body.stream)
    {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: 'Completed response mode still works.' } }] }));
      return;
    }
    const selected = behavior;
    response.setHeader('Content-Type', 'text/event-stream');
    closed = new Promise(resolve => response.once('close', resolve));
    response.write(frame(`Harbour preview ${current}. Café 🌙\n\n${'shore'.repeat(30)}`));
    release = () =>
    {
      if (selected === 'truncated') { response.end(); return; }
      if (selected === 'malformed') { response.end('data: {SECRET_STREAM_BODY\n\n'); return; }
      if (selected === 'tool') { response.end(frame('', 'tool_calls', { tool_calls: [{ id: 'tool' }] }) + 'data: [DONE]\n\n'); return; }
      response.end(frame('\n\nThe lantern is lit.', selected === 'length' ? 'length' : 'stop') + 'data: [DONE]\n\n');
    };
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const context = await browser.newContext();
  let page = await context.newPage();
  const errors = [];
  context.on('page', opened => opened.on('pageerror', error => errors.push(error.message)));
  page.on('pageerror', error => errors.push(error.message));
  try
  {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByLabel('Adventure title').fill('Streaming fixture');
    await page.getByRole('button', { name: 'Start blank adventure' }).click();
    await page.getByRole('heading', { name: 'Streaming fixture', exact: true }).waitFor();
    const adventureUrl = page.url();
    const id = new URL(adventureUrl).searchParams.get('adventure');
    const library = await page.evaluate(() => window.wails.Call.ByName('main.LibraryService.List'));
    const read = () => page.evaluate(({ epoch, id }) => window.wails.Call.ByName('main.LibraryService.Read', { schemaVersion: 4, epoch, adventureId: id }), { epoch: library.epoch, id });
    await page.getByRole('button', { name: 'Model settings', exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('#connection-name')?.disabled);
    await page.getByRole('button', { name: 'New', exact: true }).click();
    await page.getByLabel('Connection name', { exact: true }).fill('Stream fixture');
    await page.getByLabel('API base URL', { exact: true }).fill(`http://127.0.0.1:${server.address().port}/v1`);
    await page.getByLabel('Model ID', { exact: true }).fill('stream-fixture');
    await page.getByLabel('Request timeout (seconds)', { exact: true }).fill('30');
    await page.getByRole('button', { name: 'Save and use profile', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    const before = await read();
    const proposal = () => page.getByRole('region', { name: 'Proposed turn', exact: true });
    const preview = () => page.getByRole('region', { name: 'Generating proposal', exact: true });
    const begin = async (text = 'Keep this player input.') =>
    {
      await page.getByLabel('Stream output', { exact: false }).check();
      await page.getByLabel('Story input', { exact: true }).fill(text);
      await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
      await preview().getByText(/Harbour preview/).waitFor();
      assert.equal(await page.getByRole('button', { name: 'Accept turn', exact: true }).count(), 0);
      assert.equal(await page.getByLabel('Stream output', { exact: false }).isDisabled(), true);
    };
    await begin();
    assert.deepEqual(await read(), before, 'Received prose does not change canon');
    for (const theme of ['dark', 'bright'])
    {
      await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
      for (const width of [390, 768, 1024, 1440])
      {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        const stop = page.getByRole('button', { name: 'Stop generation', exact: true });
        await stop.focus();
        assert.equal(await stop.evaluate(element => element === document.activeElement), true);
        assert.ok(await stop.evaluate(element => element.getBoundingClientRect().bottom <= innerHeight));
        await preview().scrollIntoViewIfNeeded();
        if (artifacts) await page.screenshot({ path: path.join(artifacts, `streaming-${theme}-${width}.png`) });
      }
    }
    release();
    await proposal().waitFor();
    assert.deepEqual(await read(), before);
    await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await page.locator('.accepted-turn').waitFor();
    const accepted = await read();
    assert.equal(accepted.adventure.version, 1);
    assert.match(JSON.stringify(accepted.turns), /The lantern is lit/);
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('.accepted-turn').waitFor();
    assert.deepEqual(await read(), accepted);
    assert.equal(await page.getByLabel('Stream output', { exact: false }).isChecked(), false, 'Streaming preference is session-only');

    // Retry removes the previous complete candidate even if the replacement fails.
    await begin();
    release();
    await proposal().waitFor();
    behavior = 'truncated';
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await preview().getByText(/Harbour preview/).waitFor();
    assert.equal(await proposal().count(), 0);
    release();
    await page.getByRole('alert').waitFor();
    assert.equal(await preview().count(), 0);
    for (const failure of ['length', 'tool', 'malformed'])
    {
      behavior = failure;
      await begin();
      release();
      await page.getByRole('alert').waitFor();
      assert.equal(await preview().count(), 0);
      assert.equal(await proposal().count(), 0);
      assert.doesNotMatch(await page.getByRole('alert').innerText(), /SECRET_STREAM_BODY/);
      assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), 'Keep this player input.');
      assert.deepEqual(await read(), accepted);
    }
    behavior = 'ok';
    await begin();
    const afterStop = closed;
    await page.getByRole('button', { name: 'Stop generation', exact: true }).click();
    await afterStop;
    release();
    assert.equal(await preview().count(), 0);
    assert.equal(await proposal().count(), 0);
    assert.deepEqual(await read(), accepted);

    for (const leave of ['navigation', 'reload', 'close'])
    {
      await begin(`Input retained after ${leave}.`);
      await page.getByRole('status', { name: 'Draft status' }).filter({ hasText: 'Draft saved' }).waitFor();
      const disconnected = closed;
      if (leave === 'navigation') await page.getByRole('button', { name: 'Library', exact: true }).click();
      if (leave === 'reload') await page.reload({ waitUntil: 'networkidle' });
      if (leave === 'close') { await page.close(); page = await context.newPage(); }
      await disconnected;
      release();
      await page.goto(adventureUrl, { waitUntil: 'networkidle' });
      await page.getByLabel('Story input', { exact: true }).waitFor();
      await page.getByRole('status', { name: 'Draft status' }).filter({ hasText: 'Draft saved' }).waitFor();
      assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), `Input retained after ${leave}.`);
      assert.equal(await preview().count(), 0);
      assert.equal(await proposal().count(), 0);
      assert.deepEqual(await read(), accepted);
    }
    await page.getByLabel('Stream output', { exact: false }).uncheck();
    await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    await proposal().getByText('Completed response mode still works.', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Discard', exact: true }).click();
    assert.deepEqual(await read(), accepted);
    assert.equal(requests.at(-1).body.stream, false);
    await page.getByRole('button', { name: 'Model settings', exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('#connection-name')?.disabled);
    await page.getByLabel('Request timeout (seconds)', { exact: true }).fill('1');
    await page.getByRole('button', { name: 'Save and use profile', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await begin();
    const timedOut = closed;
    await page.getByRole('alert').filter({ hasText: 'timed out' }).waitFor();
    await timedOut;
    release();
    assert.equal(await preview().count(), 0);
    assert.equal(await proposal().count(), 0);
    assert.deepEqual(await read(), accepted);
    assert.equal(requests.filter(request => request.body.stream).length, calls - 1, 'No hidden retry or completed-response fallback');
    for (const request of requests)
    {
      assert.equal(request.headers.origin, base);
      assert.equal(request.headers.cookie, undefined);
      assert.equal(request.headers.authorization, undefined);
      assert.equal(request.headers.referer, undefined);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: real Firefox SSE preview/explicit acceptance, Retry/failures/Stop/navigation/reload/close, retained drafts, completed mode and responsive controls; provider prose is simulated');
  }
  finally
  {
    await context.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
