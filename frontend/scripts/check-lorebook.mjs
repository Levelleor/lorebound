import assert from 'node:assert/strict';
import { createServer } from 'node:http';

export async function exerciseLorebook(browser, base)
{
  const requests = [];
  let overflow = false;
  const server = createServer(async (request, response) =>
  {
    response.setHeader('Access-Control-Allow-Origin', base);
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'content-type');
    if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return; }
    const bytes = [];
    for await (const chunk of request) bytes.push(chunk);
    requests.push(JSON.parse(Buffer.concat(bytes).toString()));
    response.writeHead(overflow ? 400 : 200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(overflow
      ? { error: { code: 'context_length_exceeded', message: 'Fixture provider details.' } }
      : { choices: [{ message: { role: 'assistant', content: 'The brass shutters swing open.' }, finish_reason: 'stop' }] }));
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const button = (name, target = page) => target.getByRole('button', { name, exact: true });
  const drawer = (target = page) => target.getByRole('dialog', { name: 'Lorebook' });
  const open = async (target = page) =>
  {
    await button('Lorebook', target).click();
    await drawer(target).waitFor();
    await target.waitForFunction(() => document.querySelector('.lore-editor')?.getAttribute('aria-busy') === 'false');
  };
  const save = async (target = page) =>
  {
    await button('Save entry', target).click();
    await drawer(target).getByText('Entry saved.', { exact: true }).waitFor();
  };
  const close = async (target = page) =>
  {
    await button('Close', target).click();
    await drawer(target).waitFor({ state: 'hidden' });
  };

  try
  {
    await page.goto(base);
    await page.getByLabel('Adventure title').fill('Lorebook contract');
    await button('Start blank adventure').click();
    await page.getByRole('heading', { name: 'Lorebook contract', exact: true }).waitFor();
    const adventureId = new URL(page.url()).searchParams.get('adventure');
    const library = await page.evaluate(() => window.wails.Call.ByName('main.LibraryService.List'));
    const request = { schemaVersion: 4, epoch: library.epoch, adventureId };
    const call = (method, value = request) => page.evaluate(({ method, value }) => window.wails.Call.ByName(`main.LibraryService.${method}`, value), { method, value });
    const before = await call('Read');
    const connectionTarget = { schemaVersion: 4, epoch: library.epoch };
    const connections = await call('ReadConnections', connectionTarget);
    const profile = { id: 'lorebook-fixture', name: 'Simulated Lorebook protocol', kind: 'custom', baseUrl: `http://127.0.0.1:${server.address().port}/v1`, model: 'fixture', timeoutMs: 10000 };
    const configured = await call('SaveConnections', { ...connectionTarget, expectedRevision: connections.revision, mode: 'local', activeProfileId: profile.id, profiles: [...connections.profiles, profile] });
    await page.reload();

    const input = page.getByRole('textbox', { name: 'Story input', exact: true });
    await input.fill('I approach the observatory.');
    await page.getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
    const draftTarget = { ...request, target: 'composer_story' };
    const draft = await call('ReadDraft', draftTarget);
    await button('Lorebook').focus();
    await page.keyboard.press('Enter');
    await drawer().getByText('No Lorebook entries yet.').waitFor();
    await button('New entry').click();
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'lore-title');
    await page.getByLabel('Entry title').fill('Observatory');
    await page.getByLabel('Entry type').selectOption('place');
    const original = 'The roof opens precisely at dusk.';
    await page.getByLabel('Description', { exact: true }).fill(original);
    await page.keyboard.press('Escape');
    await drawer().waitFor({ state: 'hidden' });
    assert.equal(await button('Lorebook').evaluate(element => element === document.activeElement), true);
    assert.deepEqual((await call('ReadLorebook')).entries, [], 'Closing does not save draft lore');
    await open();
    assert.equal(await page.getByLabel('Description', { exact: true }).inputValue(), original);
    await save();
    const include = page.getByLabel('Include in Story generation');
    assert.equal(await include.isChecked(), false, 'New entries start excluded');
    await include.check();
    await save();
    await button('New entry').click();
    await page.getByLabel('Entry title').fill('Secret Shoal');
    await page.getByLabel('Description', { exact: true }).fill('An unselected passage of lore.');
    await save();

    for (const [width, theme] of [[390, 'bright'], [768, 'dark'], [1024, 'bright'], [1440, 'dark']])
    {
      await page.setViewportSize({ width, height: 800 });
      await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
      const { x, width: drawerWidth } = await drawer().boundingBox();
      assert.equal(x, 0);
      assert.ok(drawerWidth <= width);
      assert.equal(await drawer().evaluate(element => element.scrollWidth <= element.clientWidth), true);
    }
    const widthBefore = (await drawer().boundingBox()).width;
    await page.getByRole('slider', { name: 'Drawer width' }).press('ArrowRight');
    assert.ok((await drawer().boundingBox()).width > widthBefore);
    await button('Expand').click();
    assert.ok((await drawer().boundingBox()).width > widthBefore + 100);
    await close();
    assert.deepEqual(await call('Read'), before, 'Saved lore does not change the story');
    assert.deepEqual(await call('ReadDraft', draftTarget), draft, 'Saved lore does not change drafts');
    assert.equal(await input.inputValue(), draft.text);

    const proposal = page.getByRole('region', { name: 'Proposed turn', exact: true });
    const inspector = page.locator('.generation-inspector');
    const inspect = async () =>
    {
      if (!(await inspector.evaluate(element => element.open))) await inspector.locator('summary').click();
      return inspector.locator('.lorebook-guidance').textContent();
    };
    await button('Generate continuation').click();
    await proposal.waitFor();
    const first = await inspect();
    const system = requests[0].messages[0].content;
    assert.ok(system.endsWith(first));
    assert.match(first, /\[Place\] Observatory\nThe roof opens precisely at dusk\./);
    assert.doesNotMatch(system, /Secret Shoal|An unselected passage of lore/);
    assert.ok(!system.includes((await call('ReadLorebook')).entries[0].id));
    await inspector.getByText('Model context capacity is unknown.', { exact: false }).waitFor();

    const other = await context.newPage();
    other.on('pageerror', error => errors.push(error.message));
    await other.goto(page.url());
    await open(other);
    await drawer(other).getByRole('button', { name: /Observatory/ }).click();
    const updated = 'The roof now opens before sunrise.';
    await other.getByLabel('Description', { exact: true }).fill(updated);
    await save(other);
    await other.close();
    assert.equal(await inspect(), first, 'An edit in another tab leaves the dispatched snapshot intact');
    await button('Retry').click();
    await proposal.waitFor();
    const retried = await inspect();
    assert.match(retried, /The roof now opens before sunrise\./);
    assert.ok(requests[1].messages[0].content.endsWith(retried));

    overflow = true;
    await button('Retry').click();
    await page.getByRole('alert').getByText(/exceeds the model’s context capacity/).waitFor();
    assert.equal(await input.inputValue(), draft.text);
    assert.equal(await proposal.count(), 0);
    assert.equal(await page.getByText('Fixture provider details.', { exact: false }).count(), 0);
    overflow = false;

    const loreRead = route => route.request().postDataJSON()?.args?.methodName === 'main.LibraryService.ReadLorebook';
    const failedRead = route => loreRead(route) ? route.abort('failed') : route.continue();
    await page.route('**/wails/runtime', failedRead);
    await button('Generate continuation').click();
    await page.getByRole('alert').getByText(/Lorebook entries could not be read/).waitFor();
    assert.equal(requests.length, 3);
    assert.equal(await input.inputValue(), draft.text);
    await page.unroute('**/wails/runtime', failedRead);

    const { promise: reading, resolve: onRead } = Promise.withResolvers();
    const { promise: unblock, resolve: release } = Promise.withResolvers();
    const delayedRead = async route =>
    {
      if (loreRead(route)) { onRead(); await unblock; }
      await route.continue();
    };
    await page.route('**/wails/runtime', delayedRead);
    try
    {
      await button('Generate continuation').click();
      await reading;
      await button('Stop generation').click();
    }
    finally { release(); }
    await page.unrouteAll({ behavior: 'wait' });
    await page.waitForLoadState('networkidle');
    assert.equal(requests.length, 3, 'Stop fences the late lore read');
    assert.equal(await input.inputValue(), draft.text);
    assert.deepEqual(errors, []);
    await call('SaveConnections', { ...connectionTarget, expectedRevision: configured.revision, mode: connections.mode, activeProfileId: connections.activeProfileId, profiles: connections.profiles });
    console.log('PASS: real Lorebook drawer, SQLite saves, mock-provider request and inspector, cross-tab Retry, overflow, read failure and Stop');
  }
  finally { await context.close(); await new Promise(resolve => server.close(resolve)); }
}
