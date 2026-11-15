import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import path from 'node:path';

// Provider replies and lost service replies are simulated; browser/Go/SQLite are real.
export async function exerciseNarration(browser, base, artifacts)
{
  const requests = [];
  let release = () => {};
  const server = createServer(async (request, response) =>
  {
    response.setHeader('Access-Control-Allow-Origin', base);
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'content-type');
    if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return; }
    const bytes = [];
    for await (const chunk of request) bytes.push(chunk);
    const body = JSON.parse(Buffer.concat(bytes).toString());
    requests.push(body);
    if (body.stream)
    {
      response.setHeader('Content-Type', 'text/event-stream');
      const frame = (content, finish_reason = null) => `data: ${JSON.stringify({ choices: [{ index: 0, delta: { content }, finish_reason }] })}\n\n`;
      response.write(frame('Simulated styled preview.'));
      release = () => response.end(frame(' Complete.', 'stop') + 'data: [DONE]\n\n');
      return;
    }
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'Simulated styled continuation.' }, finish_reason: 'stop' }] }));
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  context.on('page', opened => opened.on('pageerror', error => errors.push(error.message)));
  page.on('pageerror', error => errors.push(error.message));
  try
  {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByLabel('Adventure title').fill('Narration settings contract');
    await page.getByRole('button', { name: 'Start blank adventure' }).click();
    await page.getByRole('heading', { name: 'Narration settings contract', exact: true }).waitFor();
    const id = new URL(page.url()).searchParams.get('adventure');
    const library = await page.evaluate(() => window.wails.Call.ByName('main.LibraryService.List'));
    const request = { schemaVersion: 4, epoch: library.epoch, adventureId: id };
    const call = (method, value = request) => page.evaluate(({ method, value }) => window.wails.Call.ByName(`main.LibraryService.${method}`, value), { method, value });
    const read = () => call('Read');
    const settings = () => call('ReadNarration');
    const before = await read();
    const connections = await call('ReadConnections', { schemaVersion: 4, epoch: library.epoch });
    const profile = { id: 'narration-fixture', name: 'Simulated narration protocol', kind: 'custom', baseUrl: `http://127.0.0.1:${server.address().port}/v1`, model: 'fixture', timeoutMs: 10000 };
    await call('SaveConnections', { schemaVersion: 4, epoch: library.epoch, expectedRevision: connections.revision, mode: 'local', activeProfileId: profile.id, profiles: [...connections.profiles.filter(value => value.id !== profile.id), profile] });
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('.composer-heading').getByText('Simulated narration protocol · fixture', { exact: true }).waitFor();
    await page.getByLabel('Story input', { exact: true }).fill('Retain the lantern input.');

    async function openStyle(target = page)
    {
      const world = target.getByRole('button', { name: 'World', exact: true });
      if (await world.isVisible()) await world.click();
      await target.getByRole('button', { name: 'Narration style', exact: true }).click();
      await target.getByLabel('Perspective', { exact: true }).waitFor();
      await target.waitForFunction(() => !document.querySelector('dialog fieldset')?.disabled);
    }
    async function storyView()
    {
      const story = page.getByRole('button', { name: 'Story', exact: true });
      if (await story.isVisible()) await story.click();
    }
    const save = async () =>
    {
      await page.getByRole('button', { name: 'Save narration settings', exact: true }).click();
      await page.getByRole('dialog').waitFor({ state: 'detached' });
    };
    await openStyle();
    await page.getByLabel('Perspective', { exact: true }).selectOption('third');
    await page.getByLabel('Tense', { exact: true }).selectOption('past');
    await page.getByLabel('Genre', { exact: true }).fill('Harbour mystery');
    await page.getByLabel('Tone', { exact: true }).fill('Quietly ominous');
    await page.getByLabel('Pacing', { exact: true }).selectOption('slow');
    await page.getByLabel('Response length', { exact: true }).selectOption('brief');
    await page.getByLabel('Custom style instructions', { exact: true }).fill('Keep the lantern mysterious.\nUse concrete sounds.');
    for (const theme of ['dark', 'bright'])
    {
      await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
      for (const width of [390, 768, 1024, 1440])
      {
        await page.setViewportSize({ width, height: 900 });
        await page.getByRole('dialog').evaluate(element => element.scrollTop = 0);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        assert.equal(await page.getByRole('dialog').evaluate(element => element.scrollWidth <= element.clientWidth && element.getBoundingClientRect().height <= innerHeight * .9 + 1), true);
        if (artifacts) await page.screenshot({ path: path.join(artifacts, `narration-${theme}-${width}.png`) });
      }
    }
    await save();
    const saved = await settings();
    assert.equal(saved.revision, 1);
    assert.deepEqual(await read(), before, 'Style saves do not change accepted history/version');
    assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), 'Retain the lantern input.');
    await page.reload({ waitUntil: 'networkidle' });
    await openStyle();
    assert.equal(await page.getByLabel('Genre', { exact: true }).inputValue(), 'Harbour mystery');
    assert.equal(await page.getByLabel('Custom style instructions', { exact: true }).inputValue(), saved.style.instructions);
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    assert.equal(await page.getByRole('button', { name: 'Narration style', exact: true }).evaluate(element => document.activeElement === element), true, 'Escape restores focus');
    await storyView();

    const generate = () => page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    const proposal = page.getByRole('region', { name: 'Proposed turn', exact: true });
    await generate();
    await proposal.waitFor();
    const prompt = requests.at(-1).messages[0].content;
    assert.match(prompt, /Perspective: third person\.\nTense: past\.\nGenre: Harbour mystery\nTone: Quietly ominous\nPacing: slow\.\nDesired response length: brief/);
    assert.ok(prompt.endsWith(saved.style.instructions), 'Full custom guidance sent');
    await page.locator('.generation-inspector summary').click();
    assert.equal(await page.locator('.generation-inspector pre').innerText(), prompt.split('\n\n')[1]);
    for (const theme of ['dark', 'bright'])
    {
      await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
      for (const width of [390, 768, 1024, 1440])
      {
        await page.setViewportSize({ width, height: 900 });
        await page.locator('.generation-inspector pre').scrollIntoViewIfNeeded();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        if (artifacts) await page.screenshot({ path: path.join(artifacts, `narration-details-${theme}-${width}.png`) });
      }
    }
    await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await page.locator('.accepted-turn').waitFor();
    const accepted = await read();

    // A stale form cannot silently overwrite a newer tab's current preferences.
    const other = await context.newPage();
    await other.goto(page.url(), { waitUntil: 'networkidle' });
    await openStyle();
    await openStyle(other);
    await other.getByLabel('Tone', { exact: true }).fill('Warm and hopeful');
    await other.getByRole('button', { name: 'Save narration settings', exact: true }).click();
    await other.getByRole('dialog').waitFor({ state: 'detached' });
    await page.getByLabel('Tone', { exact: true }).fill('Stale form');
    await page.getByRole('button', { name: 'Save narration settings', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'changed elsewhere' }).waitFor();
    assert.equal(await page.getByLabel('Tone', { exact: true }).inputValue(), 'Stale form');
    await page.getByRole('button', { name: 'Reload settings', exact: true }).click();
    await page.getByLabel('Tone', { exact: true }).filter({ visible: true }).waitFor();
    await page.waitForFunction(() => document.querySelector('#narration-tone')?.value === 'Warm and hopeful');
    await page.getByLabel('Tense', { exact: true }).selectOption('present');
    // Drop the reply after the real save; the identical retry resolves the saved value.
    let dropped = false;
    await page.route('**/wails/runtime', async route =>
    {
      if (!dropped && route.request().postDataJSON()?.args?.methodName === 'main.LibraryService.SaveNarration')
      {
        dropped = true;
        await route.fetch();
        await route.abort('failed');
        return;
      }
      await route.continue();
    });
    await page.getByRole('button', { name: 'Save narration settings', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'could not be confirmed' }).waitFor();
    assert.equal(dropped, true);
    const uncertain = await settings();
    await save();
    await page.unroute('**/wails/runtime');
    assert.deepEqual(await settings(), uncertain, 'Uncertain-save retry adds no extra revision');
    assert.deepEqual(await read(), accepted);
    await other.close();
    await storyView();

    // Read failure blocks provider submission and retains the composer.
    await page.getByLabel('Story input', { exact: true }).fill('Keep after settings failure.');
    await page.route('**/wails/runtime', async route =>
    {
      if (route.request().postDataJSON()?.args?.methodName === 'main.LibraryService.ReadNarration') await route.abort('failed');
      else await route.continue();
    });
    const requestCount = requests.length;
    await generate();
    await page.getByRole('alert').filter({ hasText: 'no model request was sent' }).waitFor();
    assert.equal(requests.length, requestCount);
    assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), 'Keep after settings failure.');
    assert.deepEqual(await read(), accepted);
    await page.unroute('**/wails/runtime');

    // Stop while the settings read is pending must prevent a late provider request.
    let releaseRead;
    let readStarted;
    const waitingRead = new Promise(resolve => readStarted = resolve);
    const continueRead = new Promise(resolve => releaseRead = resolve);
    await page.route('**/wails/runtime', async route =>
    {
      if (route.request().postDataJSON()?.args?.methodName === 'main.LibraryService.ReadNarration')
      {
        const response = await route.fetch();
        readStarted();
        await continueRead;
        await route.fulfill({ response });
        return;
      }
      await route.continue();
    });
    await generate();
    await waitingRead;
    await page.getByRole('button', { name: 'Stop generation', exact: true }).click();
    releaseRead();
    await page.unrouteAll({ behavior: 'wait' });
    assert.equal(requests.length, requestCount, 'Late settings reads cannot start a stopped generation');
    assert.deepEqual(await read(), accepted);

    // Each attempt reads current saved settings, including Retry without a workspace reload.
    await generate();
    await proposal.waitFor();
    assert.match(requests.at(-1).messages[0].content, /Tense: present\./);
    assert.match(requests.at(-1).messages[0].content, /Tone: Warm and hopeful/);
    let current = await settings();
    await call('SaveNarration', { ...request, expectedRevision: current.revision, style: { ...current.style, tone: 'New direction for Retry' } });
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await proposal.waitFor();
    assert.match(requests.at(-1).messages[0].content, /Tone: New direction for Retry/);
    await page.getByRole('button', { name: 'Discard', exact: true }).click();
    await page.getByLabel('Stream output', { exact: false }).check();
    await generate();
    await page.getByRole('region', { name: 'Generating proposal', exact: true }).getByText('Simulated styled preview.', { exact: true }).waitFor();
    current = await settings();
    await call('SaveNarration', { ...request, expectedRevision: current.revision, style: { ...current.style, tone: 'Changed during stream' } });
    await page.locator('.generation-inspector summary').click();
    assert.match(await page.locator('.generation-inspector pre').innerText(), /Tone: New direction for Retry/);
    await page.getByRole('button', { name: 'Stop generation', exact: true }).click();
    release();
    assert.deepEqual(await read(), accepted, 'Settings changes and stopped streams preserve canon');
    assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), 'Keep after settings failure.');
    assert.deepEqual(errors, []);
    console.log('PASS: narration settings real browser persistence, future-only prompts, cross-tab conflicts, lost-reply retry, read failure, Retry and stream snapshot/Stop');
  }
  finally
  {
    release();
    await context.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
