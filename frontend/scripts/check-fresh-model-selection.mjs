import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import path from 'node:path';

// Provider replies/faults are simulated; Firefox, Wails, Go and SQLite are real.
export async function exerciseFreshModelSelection(browser, base, artifacts)
{
  const requests = [];
  let releaseStream = () => {};
  const frame = (content, finish_reason = null) => `data: ${JSON.stringify({ choices: [{ index: 0, delta: { content }, finish_reason }] })}\n\n`;
  const server = createServer(async (request, response) =>
  {
    response.setHeader('Access-Control-Allow-Origin', base);
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'content-type');
    if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return; }
    const bytes = [];
    for await (const chunk of request) bytes.push(chunk);
    const body = JSON.parse(Buffer.concat(bytes).toString());
    requests.push({ url: request.url, body });
    if (body.stream)
    {
      response.setHeader('Content-Type', 'text/event-stream');
      response.write(frame('Simulated selection preview.'));
      releaseStream = () => response.end(frame(' Complete.', 'stop') + 'data: [DONE]\n\n');
      return;
    }
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: 'Simulated fresh selection continuation.' } }] }));
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const context = await browser.newContext();
  const errors = [];
  context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
  let page = await context.newPage();
  const editor = await context.newPage();
  let releaseRead = () => {};
  try
  {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByLabel('Adventure title').fill('Fresh model selection contract');
    await page.getByRole('button', { name: 'Start blank adventure' }).click();
    await page.getByRole('heading', { name: 'Fresh model selection contract', exact: true }).waitFor();
    const id = new URL(page.url()).searchParams.get('adventure');
    await editor.goto(`${base}/?adventure=${id}`, { waitUntil: 'networkidle' });
    const library = await editor.evaluate(() => window.wails.Call.ByName('main.LibraryService.List'));
    const request = { schemaVersion: 4, epoch: library.epoch, adventureId: id };
    const call = (method, value = request) => editor.evaluate(({ method, value }) => window.wails.Call.ByName(`main.LibraryService.${method}`, value), { method, value });
    const settings = () => call('ReadConnections', { schemaVersion: 4, epoch: library.epoch });
    const originalSettings = await settings();
    const before = await call('Read');
    let canon = before;
    const endpoint = `http://127.0.0.1:${server.address().port}`;
    const first = { id: crypto.randomUUID(), name: 'First saved source', kind: 'custom', baseUrl: `${endpoint}/first/v1`, model: 'first-model', timeoutMs: 7000 };
    const second = { ...first, id: crypto.randomUUID(), name: 'Second saved source', baseUrl: `${endpoint}/second/v1`, model: 'second-model', timeoutMs: 13000 };
    const save = async (mode, activeProfileId, profiles) =>
    {
      const value = await settings();
      return call('SaveConnections', { schemaVersion: 4, epoch: library.epoch, expectedRevision: value.revision, mode, activeProfileId, profiles });
    };
    const select = profile => save('local', profile.id, [first, second]);
    const generate = async () =>
    {
      await page.getByLabel('Story input', { exact: true }).fill('Keep the player’s selection input.');
      await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    };
    const proposal = () => page.getByRole('region', { name: 'Proposed turn', exact: true });
    const discard = () => page.getByRole('button', { name: 'Discard', exact: true }).click();
    const label = () => page.locator('.model-source').first();
    const detail = name => page.locator('.generation-inspector dt').filter({ hasText: new RegExp(`^${name}$`) }).locator('+ dd');
    const assertSource = async profile =>
    {
      assert.equal(await label().innerText(), `${profile.name} · ${profile.model}`);
      assert.equal(await detail('Requested connection').textContent(), profile.name);
      assert.equal(await detail('Requested model').textContent(), profile.model);
      assert.equal(await detail('Request timeout').textContent(), `${profile.timeoutMs / 1000} seconds`);
      assert.equal(requests.at(-1).body.model, profile.model);
      assert.equal(requests.at(-1).url, `${new URL(profile.baseUrl).pathname}/chat/completions`);
    };

    // Another tab saves without refreshing the generating tab or probing the provider.
    await select(first);
    await generate();
    await proposal().waitFor();
    await assertSource(first);
    await select(second);
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await proposal().waitFor();
    await assertSource(second);
    assert.equal(requests.length, 2);
    assert.deepEqual(await call('Read'), canon);
    await discard();

    // Editing the same profile replaces endpoint/model/timeout; unsaved form text is ignored.
    first.baseUrl = `${endpoint}/edited/v1`;
    first.model = 'edited-model';
    first.timeoutMs = 17000;
    await select(first);
    await editor.getByRole('button', { name: 'Model settings', exact: true }).click();
    await editor.getByLabel('Model ID', { exact: true }).fill('UNSAVED_MODEL');
    await generate();
    await proposal().waitFor();
    await assertSource(first);
    await editor.getByRole('button', { name: 'Close model settings', exact: true }).click();
    await discard();

    // Capture source and narration for a streaming attempt, even if both change elsewhere.
    await page.getByLabel('Stream output', { exact: false }).check();
    const narration = await call('ReadNarration');
    const saveStyle = (value, instructions) => call('SaveNarration', { ...request, expectedRevision: value.revision, style: { ...value.style, instructions } });
    await saveStyle(narration, 'First captured guidance.');
    await generate();
    await page.getByRole('region', { name: 'Generating proposal', exact: true }).getByText('Simulated selection preview.', { exact: true }).waitFor();
    await select(second);
    await saveStyle(await call('ReadNarration'), 'Later saved guidance.');
    await assertSource(first);
    assert.ok(requests.at(-1).body.messages[0].content.includes('First captured guidance.'));
    assert.ok(!(await page.locator('.generation-inspector').textContent()).includes('Later saved guidance.'));
    releaseStream();
    await proposal().waitFor();
    await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await page.locator('.accepted-turn').waitFor();
    canon = await call('Read');
    assert.equal(canon.adventure.version, before.adventure.version + 1);
    await page.reload({ waitUntil: 'networkidle' });
    assert.deepEqual(await call('Read'), canon);
    await generate();
    await proposal().waitFor();
    await assertSource(second);
    assert.ok(requests.at(-1).body.messages[0].content.includes('Later saved guidance.'));
    await discard();

    // A saved Simulation selection is explicit; deleting all local profiles fails locally.
    await save('simulation', '', [first, second]);
    let count = requests.length;
    await generate();
    await proposal().waitFor();
    assert.match(await label().innerText(), /Simulated generation/);
    assert.equal(await page.locator('.generation-inspector').count(), 0);
    assert.equal(requests.length, count);
    await discard();
    await save('local', '', []);
    await generate();
    await page.getByRole('alert').filter({ hasText: 'Choose and save a local profile' }).waitFor();
    assert.equal(requests.length, count);
    assert.deepEqual(await call('Read'), canon);
    await select(first);
    await generate();
    await proposal().waitFor();
    await assertSource(first);
    await discard();

    // A read fault must not fall back to the cached profile or to Simulation.
    for (const mode of ['local', 'simulation'])
    {
      await save(mode, mode === 'local' ? first.id : '', [first, second]);
      for (const fault of ['transport', 'malformed', 'epoch'])
      {
        count = requests.length;
        const saved = await settings();
        const handler = async route =>
        {
          if (route.request().postDataJSON()?.args?.methodName !== 'main.LibraryService.ReadConnections') return route.continue();
          if (fault === 'transport') return route.fulfill({ status: 503, body: 'PRIVATE_HOST_FAILURE' });
          return route.fulfill({ json: fault === 'malformed' ? { invalid: true } : { ...saved, epoch: 'wrong-epoch' } });
        };
        await page.route('**/wails/runtime', handler);
        await generate();
        await page.getByRole('alert').filter({ hasText: 'Model settings could not be read' }).waitFor();
        assert.equal(requests.length, count);
        assert.equal(await proposal().count(), 0);
        assert.equal(await page.locator('.generation-inspector').count(), 0);
        assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), 'Keep the player’s selection input.');
        assert.ok(!(await page.locator('body').innerText()).includes('PRIVATE_HOST_FAILURE'));
        assert.deepEqual(await call('Read'), canon);
        assert.deepEqual(await settings(), saved);
        if (mode === 'local' && fault === 'transport' && artifacts)
        {
          for (const theme of ['dark', 'bright'])
          {
            await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
            for (const width of [390, 768, 1024, 1440])
            {
              await page.setViewportSize({ width, height: 900 });
              assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
              await page.screenshot({ path: path.join(artifacts, `fresh-model-error-${theme}-${width}.png`) });
            }
          }
        }
        await page.unroute('**/wails/runtime', handler);
      }
      await generate();
      await proposal().waitFor();
      assert.equal(requests.length, count + (mode === 'local' ? 1 : 0), 'Deliberate recovery uses a new settings read');
      await discard();
    }

    // Hold the actual read reply until AFTER Stop/navigation/replacement/disposal.
    await select(first);
    async function delayNextRead()
    {
      let entered;
      let released;
      let finished;
      const started = new Promise(resolve => entered = resolve);
      const gate = new Promise(resolve => released = resolve);
      const done = new Promise(resolve => finished = resolve);
      let held = false;
      const handler = async route =>
      {
        if (held || route.request().postDataJSON()?.args?.methodName !== 'main.LibraryService.ReadConnections') return route.continue();
        held = true;
        const response = await route.fetch();
        entered();
        await gate;
        await route.fulfill({ response }).catch(() => {});
        finished();
      };
      releaseRead = released;
      await page.route('**/wails/runtime', handler);
      const owner = page;
      return { started, release: async () =>
      {
        released();
        await done;
        if (!owner.isClosed()) await owner.unroute('**/wails/runtime', handler);
      } };
    }
    for (const action of ['stop', 'replace', 'navigate', 'dispose'])
    {
      count = requests.length;
      const delayed = await delayNextRead();
      await generate();
      await delayed.started;
      if (action === 'stop' || action === 'replace') await page.getByRole('button', { name: 'Stop generation', exact: true }).click();
      if (action === 'replace')
      {
        await select(second);
        await generate();
        await proposal().waitFor();
        await assertSource(second);
      }
      if (action === 'navigate')
      {
        await page.getByRole('button', { name: 'Library', exact: true }).click();
        await page.getByLabel('Adventure title').waitFor();
      }
      if (action === 'dispose') await page.close();
      await delayed.release();
      if (action === 'dispose') page = await context.newPage();
      if (action === 'navigate' || action === 'dispose') await page.goto(`${base}/?adventure=${id}`, { waitUntil: 'networkidle' });
      // Let the released browser promise settle before checking forbidden side effects.
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(requests.length, count + (action === 'replace' ? 1 : 0));
      assert.deepEqual(await call('Read'), canon);
      if (action === 'replace')
      {
        await assertSource(second);
        await discard();
      }
      else assert.equal(await proposal().count(), 0);
    }

    // A late startup read must not overwrite a newer generation's source label.
    await select(first);
    const delayed = await delayNextRead();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await delayed.started;
    await select(second);
    await generate();
    await proposal().waitFor();
    await assertSource(second);
    await delayed.release();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await assertSource(second);
    await page.locator('.generation-inspector summary').click();
    if (artifacts)
    {
      for (const theme of ['dark', 'bright'])
      {
        await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
        for (const width of [390, 768, 1024, 1440])
        {
          await page.setViewportSize({ width, height: 900 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          await page.screenshot({ path: path.join(artifacts, `fresh-model-source-${theme}-${width}.png`) });
        }
      }
    }
    await discard();
    await save(originalSettings.mode, originalSettings.activeProfileId, originalSettings.profiles);
    assert.deepEqual(errors, []);
    console.log('PASS: fresh Generate/Retry model selection, captured source/guidance, fail-closed reads, recovery, cancellation and startup fences');
  }
  finally
  {
    releaseRead();
    releaseStream();
    await context.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
