import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { join } from 'node:path';

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
  const tab = name => page.getByRole('tab', { name, exact: true });
  const panel = page.getByRole('tabpanel', { name: 'Context', exact: true });
  const promptTotal = panel.locator('.prompt-total');
  const promptRow = name => panel.locator('.prompt-breakdown > div').filter({ has: page.getByText(name, { exact: true }) });
  const estimate = text => Math.ceil(Buffer.byteLength(text) / 4);
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
    await button('Model settings').click();
    await button('Use Simulation · No AI').click();
    await tab('Context').click();
    await panel.getByText(/Select a local profile/).waitFor();
    const profile = { id: 'lorebook-fixture', name: 'Simulated Lorebook protocol', kind: 'custom', baseUrl: `http://127.0.0.1:${server.address().port}/v1`, model: 'fixture', timeoutMs: 10000 };
    const savedSettings = () => call('ReadConnections', connectionTarget);
    await call('SaveConnections', { ...connectionTarget, expectedRevision: (await savedSettings()).revision, mode: 'local', activeProfileId: profile.id, profiles: [...connections.profiles, profile] });
    await page.reload();

    const input = page.getByRole('textbox', { name: 'Story input', exact: true });
    await tab('Scene').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await tab('Context').getAttribute('aria-selected'), 'true');
    assert.equal(await tab('Context').evaluate(element => element === document.activeElement), true);
    await promptTotal.waitFor();
    await panel.getByText(/Model limit unknown/).waitFor();
    await panel.getByText('Reply allowance unknown.').waitFor();
    assert.equal(await promptRow('Player input').count(), 0);
    assert.equal(requests.length, 0, 'The sidebar previews a blank Story without provider calls');
    await input.fill('I approach the observatory.');
    await promptRow('Player input').waitFor();
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
    await promptRow('Lorebook').waitFor();
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
    assert.deepEqual(await panel.locator('.prompt-breakdown dd').allTextContents(),
      [system.slice(0, -(first.length + 2)), '\n\n' + first, requests[0].messages[1].content].map(text => String(estimate(text))));

    const other = await context.newPage();
    other.on('pageerror', error => errors.push(error.message));
    await other.goto(page.url());
    await open(other);
    await drawer(other).getByRole('button', { name: /Observatory/ }).click();
    const updated = 'The roof now opens before sunrise. The terrace stays in shadow until noon.';
    await other.getByLabel('Description', { exact: true }).fill(updated);
    await save(other);
    await other.close();
    await promptRow('Lorebook').getByText(String(estimate('\n\n' + first.replace(original, updated))), { exact: true }).waitFor();
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
    await tab('Scene').click();
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

    const key = await call('SaveLoreEntry', { ...request, entry: {
      id: 'key', revision: 0, kind: 'object', title: '🗝 Key', description: '', included: false
    } });
    await call('SaveLoreEntry', { ...request, entry: { ...key, included: true } });
    const savedLimits = async () => (await savedSettings()).profiles.find(value => value.id === profile.id).contextLimits;
    const preset = (target = page) => target.getByLabel('Context preset', { exact: true });
    const limit = (name, target = page) => target.getByLabel(`${name} (characters)`, { exact: true });
    const openModels = async (target = page) =>
    {
      await button('Model settings', target).click();
      await preset(target).waitFor();
    };
    const closeModels = async (target = page) =>
    {
      await button('Close model settings', target).click();
      await preset(target).waitFor({ state: 'detached' });
    };
    await openModels();
    const models = page.getByRole('dialog', { name: 'Model connections' });
    assert.equal(await preset().inputValue(), 'off');
    for (const [width, theme] of [[390, 'bright'], [768, 'dark'], [1024, 'bright'], [1440, 'dark']])
    {
      await page.setViewportSize({ width, height: 800 });
      await page.evaluate(value => document.documentElement.dataset.loreboundUi = value, theme);
      assert.equal(await models.evaluate(element => element.scrollWidth <= element.clientWidth), true);
    }
    await preset().selectOption('medium');
    await page.waitForFunction(() => !document.querySelector('[aria-label="Close model settings"]').disabled);
    const medium = await savedLimits();
    assert.equal(medium.preset, 'medium');
    assert.equal(Number(await limit('Author notes').inputValue()), medium.authorNotes);

    const { promise: firstEdit, resolve: onFirstEdit } = Promise.withResolvers();
    const { promise: releaseEdit, resolve: finishEdit } = Promise.withResolvers();
    const delaySave = async route =>
    {
      if (route.request().postDataJSON()?.args?.methodName === 'main.LibraryService.SaveConnections')
      {
        onFirstEdit();
        await releaseEdit;
      }
      await route.continue();
    };
    await page.route('**/wails/runtime', delaySave);
    try
    {
      await limit('Lorebook').fill('120');
      await firstEdit;
      assert.equal(await preset().inputValue(), 'custom');
      assert.equal(Number(await limit('Author notes').inputValue()), medium.authorNotes);
      await limit('Accepted history').fill('34');
      await limit('Player input').fill('4');
    }
    finally
    {
      finishEdit();
      await page.unrouteAll({ behavior: 'wait' });
    }
    await closeModels();
    const custom = { ...medium, preset: 'custom', history: 34, lorebook: 120, playerInput: 4 };
    assert.deepEqual(await savedLimits(), custom, 'Rapid live edits persist together without a form save');

    await page.reload();
    await openModels();
    assert.equal(await preset().inputValue(), 'custom');
    assert.equal(await limit('Player input').inputValue(), '4');
    await page.getByLabel('Model context limit (tokens)').fill('12000');
    await page.getByLabel('Reply allowance (tokens)').fill('3200');
    await button('Save and use profile').click();
    await preset().waitFor({ state: 'detached' });
    await tab('Context').click();
    await panel.getByText(/≈ .*12,000/).waitFor();
    await panel.getByText('3,200 tokens reserved for the reply in this preview.').waitFor();
    await panel.getByText(/Generation blocked · Player input/).waitFor();
    await panel.getByText('Skipped lore: Observatory.').waitFor();
    await button('Generate continuation').click();
    await page.getByRole('alert').getByText(/player input section has .* its limit is 4/).waitFor();
    assert.equal(requests.length, 3, 'Over-limit input never reaches the provider');
    assert.equal(await input.inputValue(), draft.text);
    await inspector.locator('summary').click();
    await inspector.getByText(/No request was sent/).waitFor();
    assert.equal(await inspector.locator('.lorebook-guidance').count(), 0);

    await input.fill('🗝 Go');
    await panel.getByText(/Generation blocked · Player input/).waitFor({ state: 'hidden' });
    await button('Generate continuation').click();
    await proposal.waitFor();
    const budgeted = await inspect();
    assert.match(budgeted, /\[Object\] 🗝 Key/);
    assert.doesNotMatch(budgeted, /Observatory|Secret Shoal/);
    assert.ok(requests[3].messages[0].content.endsWith(budgeted));
    assert.equal(await inspector.getByText('4 / 4 characters', { exact: true }).count(), 1);
    await inspector.getByText('Lorebook entries skipped for space', { exact: true }).waitFor();
    assert.equal((await call('ReadLorebook')).entries.filter(entry => entry.included).length, 2);

    const settingsTab = await context.newPage();
    settingsTab.on('pageerror', error => errors.push(error.message));
    await settingsTab.goto(page.url());
    await openModels(settingsTab);
    await preset(settingsTab).selectOption('low');
    await closeModels(settingsTab);
    assert.equal((await savedLimits()).preset, 'low');
    assert.notEqual((await savedLimits()).lorebook, custom.lorebook);
    await promptRow('Lorebook').getByText(String(estimate('\n\n' + first.replace(original, updated) + '\n\n[Object] 🗝 Key')), { exact: true }).waitFor();
    assert.equal(await panel.getByText('Skipped lore: Observatory.').count(), 0);
    assert.equal(await inspect(), budgeted, 'Changing presets keeps the attempted snapshot intact');
    await button('Retry').click();
    await proposal.waitFor();
    assert.match(await inspect(), /Observatory/);
    assert.match(requests[4].messages[0].content, /Observatory/);
    await button('Accept turn').click();
    await page.locator('.accepted-turn').waitFor();

    await openModels(settingsTab);
    await limit('Accepted history', settingsTab).fill('34');
    await closeModels(settingsTab);
    await settingsTab.close();
    const plainSystemEstimate = await promptRow('System & style').locator('dd').textContent();
    await button('Narration style').click();
    await page.getByLabel('Perspective').selectOption('first');
    await button('Save narration settings').click();
    await page.waitForFunction(previous =>
      Array.from(document.querySelectorAll('.prompt-breakdown > div')).some(row =>
        row.querySelector('dt')?.textContent === 'System & style' && row.querySelector('dd')?.textContent !== previous), plainSystemEstimate);
    await button('Narration style').click();
    await page.locator('.author-notes summary').click();
    await page.getByLabel('Author notes', { exact: true }).fill('Keep the brass key visible.');
    await button('Save author notes').click();
    await promptRow('Author notes').waitFor();
    await input.fill('Next.');
    await panel.getByText('Older story trimmed to its character limit.').waitFor();
    await button('Generate continuation').click();
    await proposal.waitFor();
    await inspect();
    assert.equal(requests[5].messages[1].content, 'Accepted story so far:\n\nwing open.');
    await inspector.getByText(/Older accepted history was trimmed/).waitFor();
    assert.equal(await promptRow('Recent story').locator('dd').textContent(), String(estimate(requests[5].messages[1].content)));
    overflow = true;
    await button('Retry').click();
    await page.getByRole('alert').getByText(/exceeds the model’s context capacity/).waitFor();
    assert.equal(await input.inputValue(), 'Next.');
    for (const [width, theme] of [[390, 'bright'], [768, 'dark'], [1024, 'bright'], [1440, 'dark']])
    {
      await page.setViewportSize({ width, height: 800 });
      await page.evaluate(value => document.documentElement.dataset.loreboundUi = value, theme);
      if (width < 1024)
      {
        await button('World').click();
        assert.equal(await page.locator('.story-pane').isVisible(), false);
      }
      await promptTotal.waitFor();
      assert.equal(await page.locator('.prompt-bar').evaluate(element => element.getBoundingClientRect().height), 8);
      assert.equal(await panel.evaluate(element => element.scrollWidth <= element.clientWidth), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      if (process.env.BROWSER_ARTIFACT_DIR)
        await page.locator('.context-rail').screenshot({ path: join(process.env.BROWSER_ARTIFACT_DIR, `context-${theme}-${width}.png`) });
      if (width < 1024)
      {
        await button('Story').click();
        assert.equal(await panel.isVisible(), false);
        assert.equal(await input.isVisible(), true);
      }
    }
    await button('Library').click();
    await page.getByLabel('Adventure title').fill('Blank context');
    await button('Start blank adventure').click();
    await page.getByRole('heading', { name: 'Blank context' }).waitFor();
    await tab('Context').click();
    await panel.getByText(/≈ .*12,000/).waitFor();
    assert.deepEqual(await panel.locator('.prompt-breakdown dt').allTextContents(), ['System & style']);
    assert.equal(requests.length, 7, 'Changing adventures previews a fresh prompt without contacting the provider');
    assert.deepEqual(errors, []);
    await call('SaveConnections', { ...connectionTarget, expectedRevision: (await savedSettings()).revision, mode: connections.mode, activeProfileId: connections.activeProfileId, profiles: connections.profiles });
    console.log('PASS: real Lorebook and context presets, SQLite saves, prompt limits and inspector with simulated provider replies, cross-tab Retry, overflow, read failure and Stop');
    console.log('PASS: live Context sidebar, prompt estimates, saved model budget, responsive layouts and adventure isolation');
  }
  finally { await context.close(); await new Promise(resolve => server.close(resolve)); }
}
