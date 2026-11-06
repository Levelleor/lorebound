import assert from 'node:assert/strict';
import path from 'node:path';

export async function exerciseFork(page, base, artifacts, sourceId)
{
  await page.goto(`${base}/?adventure=${sourceId}`, { waitUntil: 'networkidle' });
  const call = (method, ...args) => page.evaluate(({ method, args }) => window.wails.Call.ByName(`main.LibraryService.${method}`, ...args), { method, args });
  const library = await call('List');
  const read = id => call('Read', { schemaVersion: 2, epoch: library.epoch, adventureId: id });
  const source = await read(sourceId);
  assert.ok(source.turns.length >= 3, 'Existing integration suite supplies prior accepted boundaries');
  const forkButton = page.getByRole('button', { name: 'Fork story', exact: true });
  const input = page.getByLabel('Story input');
  await input.fill('Unsent input must not be copied.');
  await forkButton.click();
  const dialog = page.getByRole('dialog', { name: 'Fork story' });
  await dialog.waitFor();
  assert.equal(await page.getByLabel('Fork through turn').evaluate(el => el === document.activeElement), true);
  assert.equal(await page.getByLabel('Fork through turn').locator('option').count(), source.turns.length);
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  await page.waitForFunction(() => document.activeElement?.textContent === 'Fork story');
  assert.equal(await input.inputValue(), 'Unsent input must not be copied.');

  // A pending generation has no Fork boundary or enabled Fork action.
  await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
  assert.equal(await forkButton.isDisabled(), true);
  await page.getByRole('button', { name: 'Discard', exact: true }).click();
  await forkButton.click();
  await page.getByLabel('Fork through turn').selectOption(source.turns[1].id);
  await page.getByLabel('New adventure title').fill('An independent fork');
  if (artifacts)
  {
    for (const theme of ['dark', 'bright'])
    {
      await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
      for (const width of [390, 768, 1024, 1440])
      {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        const box = await dialog.boundingBox();
        assert.ok(box.x >= 0 && box.x + box.width <= width && box.height <= 810);
        await page.getByRole('button', { name: 'Create fork', exact: true }).focus();
        await page.keyboard.press('Tab');
        assert.equal(await page.getByLabel('Fork through turn').evaluate(el => el === document.activeElement), true, 'Native modal traps keyboard focus');
        await page.screenshot({ path: path.join(artifacts, `fork-${theme}-${width}.png`), fullPage: true });
      }
    }
  }

  const attempts = [];
  let dropped = false;
  let releaseFork;
  let forkSeen;
  const heldFork = new Promise(resolve => releaseFork = resolve);
  const seenFork = new Promise(resolve => forkSeen = resolve);
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
        forkSeen();
        await heldFork;
        return route.abort('failed');
      }
    }
    return route.continue();
  });
  await page.getByRole('button', { name: 'Create fork', exact: true }).click();
  await seenFork;
  await page.waitForFunction(() => document.activeElement?.tagName === 'DIALOG');
  await page.keyboard.press('Tab');
  assert.equal(await dialog.evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('Shift+Tab');
  assert.equal(await dialog.evaluate(el => el === document.activeElement), true);
  releaseFork();
  await page.getByRole('button', { name: 'Recover fork', exact: true }).waitFor();
  await page.waitForFunction(() => document.activeElement?.textContent === 'Recover fork');
  assert.equal(dropped, true);
  assert.equal((await call('List')).adventures.length, library.adventures.length + 1);
  assert.equal(await page.getByRole('button', { name: 'Library', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Cancel', exact: true }).isDisabled(), true);
  await page.keyboard.press('Escape');
  assert.equal(await dialog.isVisible(), true, 'Uncertain Fork cannot be cancelled as though rolled back');
  const forkId = attempts[0].adventureId;
  const copied = await read(forkId);
  assert.deepEqual(copied.turns, source.turns.slice(0, 2));
  assert.deepEqual(copied.baseline, source.baseline);
  assert.deepEqual(await read(sourceId), source);
  await page.getByRole('button', { name: 'Recover fork', exact: true }).click();
  await page.getByRole('heading', { name: 'An independent fork', exact: true }).waitFor();
  assert.deepEqual(attempts[1], attempts[0]);
  assert.equal(new URL(page.url()).searchParams.get('adventure'), forkId);
  assert.equal(await input.inputValue(), '');
  assert.equal(await page.locator('.accepted-turn').count(), 2);
  await page.unroute('**/wails/runtime');

  const appendUI = async text =>
  {
    await input.fill(text);
    await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await page.getByRole('status').getByText('✓ Saved', { exact: true }).waitFor();
  };
  await appendUI('A new future belonging only to the fork.');
  assert.deepEqual(await read(sourceId), source);
  const forkFuture = await read(forkId);
  assert.equal(forkFuture.adventure.version, 3);
  await page.getByRole('button', { name: 'Library', exact: true }).click();
  await page.locator(`[data-adventure-id="${sourceId}"]`).click();
  await input.waitFor();
  await appendUI('A later future belonging only to the original.');
  assert.deepEqual(await read(forkId), forkFuture);

  // A concurrent source commit after opening the dialog must reject, not rebase.
  await forkButton.click();
  const beforeRace = await read(sourceId);
  const concurrent = structuredClone(beforeRace.turns.at(-1));
  concurrent.id = crypto.randomUUID();
  concurrent.order = beforeRace.adventure.version + 1;
  for (const passage of concurrent.passages) passage.id = crypto.randomUUID();
  await call('Commit', { schemaVersion: 2, epoch: library.epoch, operationId: crypto.randomUUID(), adventureId: sourceId, expectedVersion: beforeRace.adventure.version, kind: 'append_story_turn', turn: concurrent });
  const countBeforeRejection = (await call('List')).adventures.length;
  await page.getByRole('button', { name: 'Create fork', exact: true }).click();
  await dialog.getByRole('alert').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Create fork', exact: true }).count(), 0);
  assert.equal((await call('List')).adventures.length, countBeforeRejection);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.waitForFunction(version => document.querySelectorAll('.accepted-turn').length === version, concurrent.order);
  await forkButton.click();
  assert.equal(await page.getByLabel('Fork through turn').locator('option').count(), concurrent.order);
  await page.keyboard.press('Escape');
  assert.deepEqual(await read(forkId), forkFuture);
  console.log('PASS: real Story-prefix Fork, exact independent history, library resume, lost reply recovery, stale-source rejection and 8 responsive modal checks');
}
