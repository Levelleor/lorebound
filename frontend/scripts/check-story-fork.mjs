import assert from 'node:assert/strict';
import path from 'node:path';

export async function exerciseFork(page, base, artifacts, sourceId)
{
  await page.goto(`${base}/?adventure=${sourceId}`, { waitUntil: 'networkidle' });
  const context = page.context();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  async function within(promise, stage)
  {
    let timeout;
    try
    {
      return await Promise.race([
        promise,
        new Promise((_, reject) => timeout = setTimeout(() => reject(new Error(`Timed out: ${stage}`)), 20000))
      ]);
    }
    catch (cause)
    {
      console.error('Fork diagnostic', stage, { errors, tabs: context.pages().map(tab => tab.url()), alerts: await page.getByRole('alert').allTextContents() });
      throw cause;
    }
    finally
    {
      clearTimeout(timeout);
    }
  }
  const call = (method, ...args) => page.evaluate(({ method, args }) => window.wails.Call.ByName(`main.LibraryService.${method}`, ...args), { method, args });
  const library = await call('List');
  const read = id => call('Read', { schemaVersion: 4, epoch: library.epoch, adventureId: id });
  const source = await read(sourceId);
  assert.ok(source.turns.length >= 3, 'Existing integration suite supplies accepted boundaries');
  const icons = page.getByRole('button', { name: /^Fork from turn/ });
  const selectedIcon = page.getByRole('button', { name: 'Fork from turn 2', exact: true });
  const input = page.getByLabel('Story input');
  const sourceUrl = page.url();
  await input.fill('Unsent input must stay in the original tab.');
  assert.equal(await icons.count(), source.turns.length);
  assert.equal(await page.getByRole('dialog').count(), 0);
  await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
  assert.equal(await selectedIcon.isDisabled(), true);
  await page.getByRole('button', { name: 'Discard', exact: true }).click();
  assert.equal(await input.inputValue(), 'Unsent input must stay in the original tab.');
  await page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
  const sourceDraft = await call('ReadDraft', { schemaVersion: 4, epoch: library.epoch, adventureId: sourceId, target: 'composer_story' });
  assert.equal(sourceDraft.text, 'Unsent input must stay in the original tab.');

  if (artifacts)
  {
    for (const theme of ['dark', 'bright'])
    {
      await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
      for (const width of [390, 768, 1024, 1440])
      {
        await page.setViewportSize({ width, height: 900 });
        await selectedIcon.scrollIntoViewIfNeeded();
        await selectedIcon.focus();
        await page.keyboard.press('Tab');
        await page.keyboard.press('Shift+Tab');
        assert.equal(await selectedIcon.evaluate(el => el.matches(':focus-visible')), true);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        assert.equal(await selectedIcon.locator('svg').getAttribute('width'), '16');
        assert.equal(await selectedIcon.evaluate(el => el.getBoundingClientRect().top >= Array.from(el.closest('.accepted-turn').querySelectorAll('.passage')).at(-1).getBoundingClientRect().bottom), true);
        await selectedIcon.evaluate(el => el.closest('.accepted-turn').scrollIntoView({ block: 'start' }));
        await page.screenshot({ path: path.join(artifacts, `turn-fork-${theme}-${width}.png`), fullPage: true, timeout: 10000 });
      }
    }
  }

  // Blocked target reservation must not send a Fork or create an adventure.
  let forkCalls = 0;
  page.on('request', request =>
  {
    if (request.url().endsWith('/wails/runtime') && request.postDataJSON()?.args?.methodName === 'main.LibraryService.Fork') forkCalls++;
  });
  await page.evaluate(() =>
  {
    window.originalForkOpen = window.open;
    window.open = () => null;
  });
  await selectedIcon.click();
  await page.getByRole('alert').getByText(/Allow pop-ups/).waitFor();
  assert.equal(forkCalls, 0);
  assert.equal((await call('List')).adventures.length, library.adventures.length);
  await page.evaluate(() => window.open = window.originalForkOpen);

  const attempts = [];
  let releaseReply;
  let replySeen;
  const heldReply = new Promise(resolve => releaseReply = resolve);
  const seenReply = new Promise(resolve => replySeen = resolve);
  let dropped = false;
  await page.route('**/wails/runtime', async route =>
  {
    const payload = route.request().postDataJSON();
    if (payload?.args?.methodName === 'main.LibraryService.Fork')
    {
      attempts.push(payload.args.args[0]);
      if (!dropped)
      {
        dropped = true;
        await route.fetch();
        replySeen();
        await heldReply;
        return route.abort('failed');
      }
    }
    return route.continue();
  });
  const opened = context.waitForEvent('page');
  await selectedIcon.click();
  const forkTab = await within(opened, 'reserved new tab');
  await within(seenReply, 'held committed response');
  assert.equal(await forkTab.evaluate(() => window.opener), null);
  assert.equal(await icons.evaluateAll(elements => elements.every(el => el.disabled)), true);
  assert.equal(await input.isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Library', exact: true }).isDisabled(), true);
  releaseReply();
  await page.getByRole('button', { name: 'Recover fork', exact: true }).waitFor();
  const forkId = attempts[0].adventureId;
  assert.equal(attempts[0].turnId, source.turns[1].id);
  assert.equal(attempts[0].title, `fork: ${source.adventure.title}`);
  assert.deepEqual((await read(forkId)).turns, source.turns.slice(0, 2));
  const tabsBeforeRecovery = context.pages().length;
  await page.getByRole('button', { name: 'Recover fork', exact: true }).click();
  await forkTab.getByRole('heading', { name: `fork: ${source.adventure.title}`, exact: true }).waitFor();
  await forkTab.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
  assert.deepEqual(attempts[1], attempts[0]);
  assert.equal(context.pages().length, tabsBeforeRecovery);
  assert.equal(await forkTab.getByLabel('Story input').inputValue(), '');
  const forkDraft = await call('ReadDraft', { schemaVersion: 4, epoch: library.epoch, adventureId: forkId, target: 'composer_story' });
  assert.equal(forkDraft.text, '', 'Fork copies no stored source draft');
  assert.equal(await forkTab.locator('.accepted-turn').count(), 2);
  if (artifacts)
  {
    await forkTab.bringToFront();
    for (const [theme, width] of [['dark', 390], ['bright', 1440]])
    {
      await forkTab.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
      await forkTab.setViewportSize({ width, height: 900 });
      await forkTab.screenshot({ path: path.join(artifacts, `turn-fork-created-${theme}-${width}.png`), fullPage: true, timeout: 10000 });
    }
    await page.bringToFront();
  }
  assert.equal(page.url(), sourceUrl);
  assert.equal(await input.inputValue(), 'Unsent input must stay in the original tab.');
  assert.deepEqual(await read(sourceId), source);
  await page.unroute('**/wails/runtime');

  const appendUI = async (target, text) =>
  {
    await target.bringToFront();
    await target.getByLabel('Story input').fill(text);
    try
    {
      await target.getByRole('button', { name: 'Generate continuation', exact: true }).click({ timeout: 10000 });
    }
    catch (cause)
    {
      console.error('Fork continuation diagnostic', await target.evaluate(() => ({
        input: document.querySelector('textarea')?.value,
        disabled: document.querySelector('textarea')?.disabled,
        status: document.querySelector('.save-status')?.textContent,
        alerts: [...document.querySelectorAll('[role="alert"]')].map(el => el.textContent)
      })));
      throw cause;
    }
    await target.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await target.getByRole('status').getByText('✓ Saved', { exact: true }).waitFor();
  };
  await appendUI(forkTab, 'A future belonging only to the fork.');
  const forkFuture = await read(forkId);
  assert.deepEqual(await read(sourceId), source);
  await appendUI(page, 'A later future belonging only to the original.');
  assert.deepEqual(await read(forkId), forkFuture);
  await forkTab.getByRole('button', { name: 'Library', exact: true }).click();
  await forkTab.locator(`[data-adventure-id="${forkId}"]`).click();
  await forkTab.getByRole('heading', { name: `fork: ${source.adventure.title}`, exact: true }).waitFor();
  await forkTab.close();

  // Closing the waiting target does not cancel or recopy its durable Fork.
  let releaseClosed;
  let closedSeen;
  let closedRequest;
  const closedGate = new Promise(resolve => releaseClosed = resolve);
  const closedReady = new Promise(resolve => closedSeen = resolve);
  await page.route('**/wails/runtime', async route =>
  {
    if (route.request().postDataJSON()?.args?.methodName !== 'main.LibraryService.Fork') return route.continue();
    closedRequest = route.request().postDataJSON().args.args[0];
    const response = await route.fetch();
    closedSeen();
    await closedGate;
    return route.fulfill({ response });
  });
  const closedPopup = context.waitForEvent('page');
  await page.getByRole('button', { name: 'Fork from turn 1', exact: true }).click();
  const closingTab = await within(closedPopup, 'closed target reservation');
  await within(closedReady, 'closed target response');
  await closingTab.close();
  releaseClosed();
  const reopen = page.getByRole('link', { name: 'Open fork', exact: true });
  await reopen.waitFor();
  assert.equal((await call('List')).adventures.length, library.adventures.length + 2);
  const reopenedPopup = context.waitForEvent('page');
  await reopen.click();
  const reopened = await within(reopenedPopup, 'saved fork reopening');
  await reopened.getByLabel('Story input').waitFor();
  assert.equal(new URL(reopened.url()).searchParams.get('adventure'), closedRequest.adventureId);
  assert.equal(await reopened.locator('.accepted-turn').count(), 1);
  assert.equal((await call('List')).adventures.length, library.adventures.length + 2);
  await reopened.close();
  await page.unroute('**/wails/runtime');

  // Concurrent source advance rejects the already pinned request without rebase.
  let releaseStale;
  let staleSeen;
  const staleGate = new Promise(resolve => releaseStale = resolve);
  const staleReady = new Promise(resolve => staleSeen = resolve);
  await page.route('**/wails/runtime', async route =>
  {
    if (route.request().postDataJSON()?.args?.methodName !== 'main.LibraryService.Fork') return route.continue();
    staleSeen();
    await staleGate;
    return route.continue();
  });
  const stalePopup = context.waitForEvent('page');
  await selectedIcon.click();
  const rejectedTab = await within(stalePopup, 'stale fork reservation');
  await within(staleReady, 'stale source interception');
  const beforeRace = await read(sourceId);
  const concurrent = structuredClone(beforeRace.turns.at(-1));
  concurrent.id = crypto.randomUUID();
  concurrent.order = beforeRace.adventure.version + 1;
  for (const passage of concurrent.passages) passage.id = crypto.randomUUID();
  await call('Commit', { schemaVersion: 4, epoch: library.epoch, operationId: crypto.randomUUID(), adventureId: sourceId, expectedVersion: beforeRace.adventure.version, kind: 'append_story_turn', turn: concurrent });
  releaseStale();
  await page.getByRole('alert').getByText(/fork was rejected/).waitFor();
  await page.waitForFunction(version => document.querySelectorAll('.accepted-turn').length === version, concurrent.order);
  assert.equal(rejectedTab.isClosed(), true);
  assert.equal((await call('List')).adventures.length, library.adventures.length + 2);
  assert.equal(page.url(), sourceUrl);
  assert.deepEqual(await read(forkId), forkFuture);
  await page.getByRole('button', { name: 'Dismiss', exact: true }).click();
  await page.unroute('**/wails/runtime');
  await exerciseForkNavigation(page, base, sourceId, within);
  console.log('PASS: per-turn Fork icons open exact independently named prefixes in separate tabs; source/input preserved; blocked popup, closed target, lost reply and stale recovery; 8 responsive checks');
}

async function exerciseForkNavigation(page, base, sourceId, within)
{
  const call = (method, ...args) => page.evaluate(({ method, args }) => window.wails.Call.ByName(`main.LibraryService.${method}`, ...args), { method, args });
  const library = await call('List');
  const sourceRequest = { schemaVersion: 4, epoch: library.epoch, adventureId: sourceId };
  const source = await call('Read', sourceRequest);
  let expectedCount = library.adventures.length;

  for (const navigation of ['target', 'source'])
  {
    const probe = await page.context().newPage();
    await probe.goto(base, { waitUntil: 'networkidle' });
    await probe.locator(`[data-adventure-id="${sourceId}"]`).click();
    await probe.getByRole('button', { name: 'Fork from turn 1', exact: true }).waitFor();
    let release;
    let seen;
    let request;
    const gate = new Promise(resolve => release = resolve);
    const ready = new Promise(resolve => seen = resolve);
    await probe.route('**/wails/runtime', async route =>
    {
      if (route.request().postDataJSON()?.args?.methodName !== 'main.LibraryService.Fork') return route.continue();
      request = route.request().postDataJSON().args.args[0];
      const response = await route.fetch();
      seen();
      await gate;
      return route.fulfill({ response });
    });

    const opened = page.context().waitForEvent('page', { timeout: 10000 });
    await probe.getByRole('button', { name: 'Fork from turn 1', exact: true }).click();
    const target = await opened;
    try
    {
      await within(ready, `${navigation} navigation response`);
      if (navigation === 'target') await target.goto(base, { waitUntil: 'networkidle' });
      else await probe.goBack();
      await target.getByRole('heading', { name: 'Saved adventures', exact: true }).waitFor();
      const chosenUrl = target.url();
      const completed = probe.waitForResponse(response => response.request().postDataJSON()?.args?.methodName === 'main.LibraryService.Fork', { timeout: 10000 });
      release();
      await (await completed).finished();
      if (navigation === 'target') await probe.getByRole('link', { name: 'Open fork', exact: true }).waitFor();
      else await probe.getByRole('heading', { name: 'Saved adventures', exact: true }).waitFor();
      await probe.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(target.url(), chosenUrl, 'Late Fork success must preserve the target navigation');
      assert.equal(new URL(target.url()).searchParams.has('adventure'), false);
      if (navigation === 'source') assert.equal(new URL(probe.url()).searchParams.has('adventure'), false);
      assert.equal((await call('List')).adventures.length, ++expectedCount, 'Navigation must not duplicate the durable Fork');
      const fork = await call('Read', { ...sourceRequest, adventureId: request.adventureId });
      assert.deepEqual(fork.turns, source.turns.slice(0, 1));
      assert.deepEqual(await call('Read', sourceRequest), source);
    }
    finally
    {
      release();
      await probe.unroute('**/wails/runtime');
      await target.close();
      await probe.close();
    }
  }
  console.log('PASS: late Fork replies preserve target navigation and source Back teardown without duplicate copies');
}
