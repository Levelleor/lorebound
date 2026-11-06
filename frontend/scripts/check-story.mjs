import assert from 'node:assert/strict';
import path from 'node:path';
import { exerciseRetry, replaceProposal } from './check-story-retry.mjs';

export async function exerciseStory(page, base, artifacts, adventureId) {
  await page.unroute('**/wails/runtime');
  await page.goto(`${base}/?adventure=${adventureId}`, { waitUntil: 'networkidle' });
  await page.getByLabel('Story input').waitFor();
  const read = () => page.evaluate(async id => {
    const library = await window.wails.Call.ByName('main.LibraryService.List');
    return window.wails.Call.ByName('main.LibraryService.Read', { schemaVersion: 2, epoch: library.epoch, adventureId: id });
  }, adventureId);
  const generate = async (target, text) => {
    await target.getByLabel('Story input').fill(text);
    await target.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    await target.getByRole('button', { name: 'Accept turn', exact: true }).waitFor();
  };
  const accepted = (target, count) => target.waitForFunction(count => document.querySelectorAll('.accepted-turn').length === count && document.querySelector('.save-status')?.textContent === '✓ Saved', count);
  const original = await read();
  await exerciseRetry(page, read);

  await page.getByLabel('Story input').fill('The moon turns green.');
  await page.getByLabel('Story input').press('Control+Enter');
  await page.getByRole('button', { name: 'Stop generation' }).click();
  await page.waitForTimeout(550); // Exceed the simulated provider's completion delay.
  assert.deepEqual(await read(), original, 'Stop cannot change durable canon');
  assert.equal(await page.getByRole('region', { name: 'Proposed turn', exact: true }).count(), 0);
  assert.equal(await page.getByLabel('Story input').inputValue(), 'The moon turns green.');
  await generate(page, 'A discarded beginning.');
  assert.deepEqual(await read(), original, 'Generation remains entirely provisional');
  await page.getByRole('button', { name: 'Discard', exact: true }).click();
  assert.deepEqual(await read(), original);
  assert.equal(await page.getByLabel('Story input').inputValue(), 'A discarded beginning.');
  console.log('PASS: real browser Stop/Discard preserve the baseline and authored input');

  const authored = 'A door appears.\nIt opens without a key.\n\n<script>window.storyInjected = true</script> 🦉';
  await generate(page, authored);
  const firstReplacement = await replaceProposal(page);
  const finalReplacement = await replaceProposal(page);
  assert.equal(finalReplacement.originalId, firstReplacement.replacementId);
  assert.equal(await page.getByLabel('Story input').isDisabled(), true, 'Sending cannot implicitly accept');
  assert.deepEqual(await read(), original);
  for (const theme of ['dark', 'bright']) {
    await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
    for (const width of [390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.equal(await page.locator('.topbar').evaluate(el => el.getBoundingClientRect().height), 48);
      assert.ok(await page.locator('.reader').evaluate(el => el.getBoundingClientRect().width) <= 672);
      const composerBottom = await page.locator('.composer').evaluate(el => el.getBoundingClientRect().bottom);
      assert.ok(Math.abs(composerBottom - 900) <= 1, `Composer docked at ${width}`);
      const before = await page.locator('.composer').boundingBox();
      await page.locator('.reader').evaluate(el => el.scrollTop = el.scrollHeight);
      assert.deepEqual(await page.locator('.composer').boundingBox(), before, 'Reader scroll cannot move composer');
      if (width < 1024) {
        await page.getByRole('button', { name: 'World', exact: true }).click();
        await page.getByText('No characters or places recorded.', { exact: true }).waitFor();
        await page.getByRole('button', { name: 'Story', exact: true }).click();
      } else assert.equal(await page.locator('.context-rail').evaluate(el => el.getBoundingClientRect().width), 320);
      await page.getByRole('button', { name: 'Accept turn', exact: true }).focus();
      await page.keyboard.press('Tab');
      assert.equal(await page.getByRole('button', { name: 'Retry', exact: true }).evaluate(el => el.matches(':focus-visible')), true);
      const retryBox = await page.getByRole('button', { name: 'Retry', exact: true }).boundingBox();
      assert.ok(retryBox && retryBox.x >= 0 && retryBox.x + retryBox.width <= width && retryBox.y + retryBox.height <= 900);
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.getByRole('button', { name: 'Accept turn', exact: true }).evaluate(el => el.matches(':focus-visible')), true);
      if (artifacts) await page.screenshot({ path: path.join(artifacts, `story-proposed-${theme}-${width}.png`), fullPage: true });
    }
  }
  await page.keyboard.press('Enter'); // Focused Accept, real keyboard acceptance.
  await accepted(page, 1);
  assert.equal(await page.evaluate(() => window.storyInjected), undefined, 'Model/player text is never HTML');
  const first = await read();
  assert.equal(first.adventure.version, 1);
  assert.equal(first.turns[0].id, finalReplacement.replacementId);
  assert.equal(first.turns.some(turn => turn.id === firstReplacement.originalId || turn.id === firstReplacement.replacementId), false);
  console.log('PASS: repeated Retry accepts only the latest candidate into real SQLite');
  assert.equal(first.turns[0].passages.length, 2);
  assert.notEqual(first.turns[0].passages[0].id, first.turns[0].passages[1].id);
  assert.deepEqual(first.turns[0].events, []);
  const storedText = first.turns[0].passages[0].body.content.map(p => p.content.map(n => n.type === 'text' ? n.text : '\n').join('')).join('\n\n');
  assert.equal(storedText, authored);
  await page.reload({ waitUntil: 'networkidle' });
  await accepted(page, 1);
  assert.deepEqual(await read(), first);
  console.log('PASS: keyboard acceptance saves distinct structured passages; literal HTML is safe; exact reload matches');

  const attempts = [];
  let dropped = false;
  await page.route('**/wails/runtime', async route => {
    const payload = route.request().postDataJSON();
    if (payload?.args?.methodName === 'main.LibraryService.Commit') {
      attempts.push(payload.args.args[0]);
      if (!dropped) { dropped = true; await route.fetch(); await route.abort('failed'); return; }
    }
    await route.continue();
  });
  await generate(page, 'A second passage, saved despite a lost reply.');
  await replaceProposal(page);
  await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
  await page.getByRole('button', { name: 'Recover save', exact: true }).waitFor();
  assert.equal((await read()).adventure.version, 2, 'Real SQLite committed before reply was lost');
  assert.equal(await page.getByRole('button', { name: 'Discard', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Retry', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Library', exact: true }).isDisabled(), true);
  if (artifacts) await page.screenshot({ path: path.join(artifacts, 'story-save-unconfirmed.png'), fullPage: true });
  await page.getByRole('button', { name: 'Recover save', exact: true }).click();
  await accepted(page, 2);
  assert.equal(attempts.length, 2);
  assert.deepEqual(attempts[0], attempts[1], 'Recovery must retry identical prepared payload and operation ID');
  assert.equal((await read()).turns.length, 2);
  await page.unroute('**/wails/runtime');
  console.log('PASS: lost real commit response recovers exactly once through unchanged-request retry');

  const other = await page.context().newPage();
  try {
    await other.goto(`${base}/?adventure=${adventureId}`, { waitUntil: 'networkidle' });
    await generate(other, 'The losing tab keeps this text.');
    await generate(page, 'The first tab wins this turn.');
    await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await accepted(page, 3);
    await replaceProposal(other);
    await other.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await other.getByRole('alert').getByText(/saved story or library changed/).waitFor();
    assert.equal(await other.getByLabel('Story input').inputValue(), 'The losing tab keeps this text.');
    assert.equal(await other.locator('.accepted-turn').count(), 3);
    assert.equal((await read()).adventure.version, 3);
    if (artifacts) await other.screenshot({ path: path.join(artifacts, 'story-conflict.png'), fullPage: true });
    console.log('PASS: stale second tab rejects atomically, refetches current history and retains input without resubmission');
  } finally { await other.close(); }

  for (const theme of ['dark', 'bright']) {
    await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
    for (const width of [390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.locator('.reader').evaluate(el => el.scrollTop = 0);
      if (artifacts) await page.screenshot({ path: path.join(artifacts, `story-accepted-${theme}-${width}.png`), fullPage: true });
    }
  }
  // Simulated incompatible-read fixture exercises the real UI's read-only path.
  const durable = await read();
  let incompatibleReads = 0;
  await page.route('**/wails/runtime', async route => {
    if (route.request().postDataJSON()?.args?.methodName === 'main.LibraryService.Read') {
      const response = await route.fetch();
      const result = await response.json();
      result.turns[0].events = [{ schemaVersion: 999, domainOwner: 'core', type: 'future' }];
      incompatibleReads++;
      await route.fulfill({ response, json: result });
    } else await route.continue();
  });
  await page.getByRole('button', { name: 'Library', exact: true }).click();
  await page.locator(`[data-adventure-id="${adventureId}"]`).click();
  await page.getByRole('alert').filter({ hasText: /saved prose is available read-only/ }).waitFor();
  assert.ok(incompatibleReads > 0, 'The incompatible-read fixture actually reached the app');
  assert.equal(await page.locator('.accepted-turn').count(), 3);
  assert.equal(await page.getByLabel('Story input').isDisabled(), true);
  await page.unroute('**/wails/runtime');
  await page.reload({ waitUntil: 'networkidle' });
  await accepted(page, 3);
  assert.deepEqual(await read(), durable, 'Unsupported-read fixture did not alter SQLite');
  console.log('PASS: simulated unknown core effect blocks writing while preserving readable prose; durable data unchanged');
}
