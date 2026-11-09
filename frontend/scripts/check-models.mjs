import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import path from 'node:path';

// Simulated compatible provider; HTTP/CORS, browser, host and SQLite are real.
export async function exerciseModels(browser, base, artifacts)
{
  let behavior = 'ok';
  let discoveryFails = true;
  let delayDiscovery = false;
  let delayedReceived = () => {};
  let calls = 0;
  let aborted = 0;
  const requests = [];
  const pending = new Set();
  const server = createServer(async (request, response) =>
  {
    const body = [];
    for await (const chunk of request) body.push(chunk);
    requests.push({ method: request.method, url: request.url, headers: request.headers, body: Buffer.concat(body).toString() });
    if (behavior !== 'cors') response.setHeader('Access-Control-Allow-Origin', base);
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'content-type');
    response.setHeader('Content-Type', 'application/json');
    if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return; }
    if (request.url === '/v1/models')
    {
      response.writeHead(discoveryFails ? 404 : 200);
      const finishDiscovery = () =>
      {
        response.end(JSON.stringify(discoveryFails ? { error: 'discovery unavailable' } : { data: [{ id: 'manual-fixture' }] }));
      };
      response.on('close', () => { if (!response.writableEnded) aborted++; });
      if (delayDiscovery)
      {
        response.flushHeaders();
        delayedReceived();
        const timer = setTimeout(() => { pending.delete(timer); finishDiscovery(); }, 2000);
        pending.add(timer);
      }
      else finishDiscovery();
      return;
    }
    if (request.url !== '/v1/chat/completions') { response.writeHead(404); response.end('{}'); return; }
    calls++;
    const selectedBehavior = behavior;
    const text = `Fixture continuation ${calls}.\n\nThe local road opens.`;
    const finish = () =>
    {
      if (selectedBehavior === 'auth') { response.writeHead(401); response.end('SECRET_PROVIDER_BODY'); return; }
      if (selectedBehavior === 'redirect') { response.writeHead(302, { Location: '/must-not-follow' }); response.end(); return; }
      response.end(JSON.stringify({ choices: [{ finish_reason: selectedBehavior === 'partial' ? 'length' : 'stop', message: { role: 'assistant', content: text } }] }));
    };
    response.on('close', () => { if (!response.writableEnded) aborted++; });
    if (selectedBehavior === 'delay')
    {
      response.flushHeaders();
      delayedReceived();
      const timer = setTimeout(() => { pending.delete(timer); finish(); }, 2000);
      pending.add(timer);
    }
    else finish();
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
    await page.getByLabel('Adventure title').fill('Local narration fixture');
    await page.getByRole('button', { name: 'Start blank adventure' }).click();
    await page.getByRole('heading', { name: 'Local narration fixture', exact: true }).waitFor();
    const id = new URL(page.url()).searchParams.get('adventure');
    const library = await page.evaluate(() => window.wails.Call.ByName('main.LibraryService.List'));
    const read = () => page.evaluate(({ epoch, id }) => window.wails.Call.ByName('main.LibraryService.Read', { schemaVersion: 4, epoch, adventureId: id }), { epoch: library.epoch, id });
    const settings = () => page.evaluate(epoch => window.wails.Call.ByName('main.LibraryService.ReadConnections', { schemaVersion: 4, epoch }), library.epoch);
    const before = await read();
    const openModels = async () =>
    {
      await page.getByRole('button', { name: 'Model settings', exact: true }).click();
      await page.getByRole('dialog').waitFor();
      await page.getByLabel('Connection name', { exact: true }).waitFor();
      await page.getByLabel('Connection name', { exact: true }).waitFor({ state: 'visible' });
      await page.waitForFunction(() => !document.querySelector('#connection-name')?.disabled);
    };
    await openModels();
    await page.getByLabel('Connection name', { exact: true }).fill('My llama.cpp');
    await page.getByLabel('API base URL', { exact: true }).fill(endpoint);
    await page.getByRole('button', { name: 'Discover models', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'enter a model ID manually' }).waitFor();
    assert.equal(await page.getByLabel('Model ID', { exact: true }).isEnabled(), true);
    await page.getByLabel('Model ID', { exact: true }).fill('manual-fixture');
    await page.getByRole('button', { name: 'Save and use profile', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    assert.deepEqual(await read(), before, 'Settings do not change canon');
    const selected = await settings();
    assert.equal(selected.profiles.length, 1);
    assert.equal(selected.profiles[0].kind, 'llamacpp');
    assert.equal(selected.mode, 'local');
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('.composer-heading').getByText('My llama.cpp · manual-fixture', { exact: true }).waitFor();
    await page.getByLabel('Story input', { exact: true }).fill('A browser sends this player passage.');
    await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    const proposal = page.getByRole('region', { name: 'Proposed turn', exact: true });
    await proposal.waitFor();
    assert.deepEqual(await read(), before);
    assert.equal(await page.getByRole('button', { name: 'Model settings', exact: true }).isDisabled(), true);
    const firstID = await proposal.getAttribute('data-turn-id');
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await page.getByRole('button', { name: 'Accept turn', exact: true }).waitFor();
    assert.notEqual(await proposal.getAttribute('data-turn-id'), firstID);
    assert.equal(calls, 2, 'Retry requests one replacement without automatic repeats');
    await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await page.locator('.accepted-turn').waitFor();
    const accepted = await read();
    assert.equal(accepted.adventure.version, 1);
    assert.match(JSON.stringify(accepted.turns), /Fixture continuation 2/);
    assert.doesNotMatch(JSON.stringify(accepted.turns), /Fixture continuation 1/);
    const post = requests.find(request => request.method === 'POST');
    assert.equal(post.headers.origin, base);
    assert.equal(post.headers.authorization, undefined);
    assert.equal(post.headers.cookie, undefined);
    assert.equal(post.headers.referer, undefined);
    const payload = JSON.parse(post.body);
    assert.equal(payload.model, 'manual-fixture');
    assert.equal(payload.stream, false);
    assert.equal(payload.messages.at(-1).content, 'A browser sends this player passage.');
    assert.equal(requests.filter(request => request.url === '/v1/models' && request.method === 'GET').length, 1);

    for (const failure of ['partial', 'auth', 'redirect', 'cors'])
    {
      behavior = failure;
      const input = `Preserve this input after ${failure}.`;
      await page.getByLabel('Story input', { exact: true }).fill(input);
      await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
      await page.getByRole('alert').waitFor();
      assert.equal(await proposal.count(), 0);
      assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), input);
      assert.equal((await page.getByRole('alert').innerText()).includes('SECRET_PROVIDER_BODY'), false);
      assert.deepEqual(await read(), accepted);
    }
    assert.equal(requests.some(request => request.url === '/must-not-follow'), false, 'Redirects are never followed');
    behavior = 'ok';
    discoveryFails = false;
    await openModels();
    await page.getByRole('button', { name: 'Discover models', exact: true }).click();
    await page.getByRole('status', { name: 'Model discovery result' }).filter({ hasText: 'Narration has not been tested' }).waitFor();
    await page.getByLabel('Request timeout (seconds)', { exact: true }).fill('1');
    if (artifacts)
    {
      for (const theme of ['dark', 'bright'])
      {
        await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
        for (const width of [390, 768, 1024, 1440])
        {
          await page.setViewportSize({ width, height: 900 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          assert.ok(await page.getByRole('dialog').evaluate(element => element.getBoundingClientRect().height) <= 810);
          await page.getByRole('dialog').evaluate(element => element.scrollTop = 0);
          await page.screenshot({ path: path.join(artifacts, `models-${theme}-${width}.png`) });
        }
      }
      await page.evaluate(() => document.documentElement.dataset.loreboundUi = 'dark');
    }
    await page.getByRole('button', { name: 'Save and use profile', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    behavior = 'delay';
    await page.getByLabel('Story input', { exact: true }).fill('Retain timed-out input.');
    await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'timed out' }).waitFor();
    assert.deepEqual(await read(), accepted);
    await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    await page.getByRole('button', { name: 'Stop generation', exact: true }).click();
    await page.waitForTimeout(1100);
    assert.equal(await proposal.count(), 0);
    assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), 'Retain timed-out input.');
    assert.deepEqual(await read(), accepted);
    assert.ok(aborted > 0, 'The real browser closes aborted HTTP response streams');

    const abortedBeforeNavigation = aborted;
    const navigationRequest = new Promise(resolve => { delayedReceived = resolve; });
    await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    await navigationRequest;
    await page.getByRole('button', { name: 'Library', exact: true }).click();
    await page.getByLabel('Adventure title').waitFor();
    await page.waitForTimeout(2100);
    assert.ok(aborted > abortedBeforeNavigation, 'Navigation aborts the in-flight provider request');
    await page.goto(`${base}/?adventure=${id}`, { waitUntil: 'networkidle' });
    await page.getByLabel('Story input', { exact: true }).waitFor();
    assert.equal(await proposal.count(), 0);
    assert.deepEqual(await read(), accepted);

    behavior = 'ok';
    await openModels();
    const concurrent = await settings();
    concurrent.profiles[0].name = 'Changed elsewhere';
    await page.evaluate(value => window.wails.Call.ByName('main.LibraryService.SaveConnections', value), {
      schemaVersion: 4, epoch: library.epoch, expectedRevision: concurrent.revision,
      mode: concurrent.mode, activeProfileId: concurrent.activeProfileId, profiles: concurrent.profiles
    });
    await page.getByLabel('Connection name', { exact: true }).fill('Retained stale form');
    await page.getByRole('button', { name: 'Save and use profile', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'changed elsewhere' }).waitFor();
    assert.equal(await page.getByLabel('Connection name', { exact: true }).inputValue(), 'Retained stale form');
    assert.equal((await settings()).profiles[0].name, 'Changed elsewhere');
    await page.getByRole('button', { name: 'Reload models', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#connection-name')?.value === 'Changed elsewhere');
    await page.getByRole('button', { name: 'New', exact: true }).click();
    await page.getByLabel('Connection name', { exact: true }).fill('Custom fixture');
    await page.getByLabel('Server type', { exact: true }).selectOption('custom');
    await page.getByLabel('API base URL', { exact: true }).fill(endpoint);
    await page.getByLabel('Model ID', { exact: true }).fill('manual-fixture');
    await page.getByRole('button', { name: 'Save and use profile', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    assert.equal((await settings()).profiles.length, 2);
    await openModels();
    await page.getByRole('button', { name: 'Delete profile', exact: true }).click();
    await page.getByRole('status', { name: 'Model discovery result' }).filter({ hasText: 'Profile deleted' }).waitFor();
    await page.getByRole('button', { name: 'Close model settings', exact: true }).click();
    const callCount = calls;
    await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'Choose and save a local profile' }).waitFor();
    assert.equal(calls, callCount);
    await openModels();
    await page.getByRole('button', { name: 'Use Simulation · No AI', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await page.locator('.composer-heading').getByText('Simulated generation · No AI connected', { exact: true }).waitFor();
    await openModels();
    await page.getByLabel('Saved connection', { exact: true }).selectOption(selected.activeProfileId);
    await page.getByRole('button', { name: 'Save and use profile', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    // Escape uses native modal focus restoration and aborts an unfinished probe.
    await openModels();
    delayDiscovery = true;
    const abortedBeforeProbe = aborted;
    const discoveryRequest = new Promise(resolve => { delayedReceived = resolve; });
    await page.getByRole('button', { name: 'Discover models', exact: true }).click();
    await discoveryRequest;
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    assert.equal(await page.getByRole('button', { name: 'Model settings', exact: true }).evaluate(element => element === document.activeElement), true);
    await page.waitForTimeout(2100);
    assert.ok(aborted > abortedBeforeProbe, 'Closing settings aborts discovery');
    assert.deepEqual(await read(), accepted);
    assert.deepEqual(errors, []);
    console.log('PASS: real browser direct compatible HTTP/CORS, optional discovery, manual model, Retry/acceptance, redacted failures/timeout/Stop, shared settings conflicts and explicit source selection; provider output is simulated');
  }
  finally
  {
    for (const timer of pending) clearTimeout(timer);
    await context.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
