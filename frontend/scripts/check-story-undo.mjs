import assert from 'node:assert/strict';
import path from 'node:path';

export async function exerciseUndo(page, base, artifacts)
{
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByLabel('Adventure title').fill('Committed Undo');
  await page.getByRole('button', { name: 'Start blank adventure' }).click();
  const input = page.getByLabel('Story input');
  await input.waitFor();
  const id = new URL(page.url()).searchParams.get('adventure');
  const call = (method, ...args) => page.evaluate(({ method, args }) => window.wails.Call.ByName(`main.LibraryService.${method}`, ...args), { method, args });
  const library = await call('List');
  const read = adventureId => call('Read', { schemaVersion: 3, epoch: library.epoch, adventureId: adventureId ?? id });
  const idle = (target, count) => target.waitForFunction(count => document.querySelectorAll('.accepted-turn').length === count && !document.querySelector('#story-input')?.disabled, count);
  const saved = target => target.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
  const accept = async (target, text) =>
  {
    await target.getByLabel('Story input').fill(text);
    await target.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    await target.getByRole('button', { name: 'Accept turn', exact: true }).click();
  };
  const undo = async order =>
  {
    await page.getByRole('button', { name: `Undo turn ${order}`, exact: true }).click();
    await page.getByRole('button', { name: 'Confirm Undo', exact: true }).click();
    await idle(page, order - 1);
  };
  await accept(page, 'The first accepted scene.');
  await idle(page, 1);
  await accept(page, 'The original second scene. 🦉');
  await idle(page, 2);
  const original = await read();
  assert.equal(await page.getByRole('button', { name: 'Undo input edit' }).count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Redo input edit' }).count(), 0);
  await input.evaluate(element => element.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'Enter', ctrlKey: true, isComposing: true, bubbles: true, cancelable: true
  })));
  assert.equal(await page.getByRole('button', { name: 'Stop generation' }).count(), 0, 'IME composition cannot start generation');
  await input.fill('Native editing');
  await input.press('End');
  await input.pressSequentially(' stays ordinary');
  await input.press('Control+z');
  assert.notEqual(await input.inputValue(), 'Native editing stays ordinary');
  assert.deepEqual(await read(), original, 'Native input Undo does not roll back turns');

  const popup = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Fork from turn 2', exact: true }).click();
  const forkPage = await popup;
  await forkPage.getByRole('heading', { name: 'fork: Committed Undo', exact: true }).waitFor();
  const forkId = new URL(forkPage.url()).searchParams.get('adventure');
  await forkPage.close();

  const unfinished = 'Keep this unfinished input through turn Undo. 🦉';
  await input.fill(unfinished);
  await saved(page);
  const undoButton = page.getByRole('button', { name: 'Undo turn 2', exact: true });
  await undoButton.click();
  assert.equal(await input.isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Confirm Undo', exact: true }).evaluate(element => element === document.activeElement), true);
  assert.deepEqual(await read(), original, 'Preparing Undo is noncanonical');
  await page.keyboard.press('Escape');
  assert.equal(await undoButton.evaluate(element => element === document.activeElement), true);
  assert.deepEqual(await read(), original, 'Escape cancels without writes');
  await undoButton.click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  assert.deepEqual(await read(), original);
  await undoButton.click();
  await page.keyboard.press('Tab');
  assert.equal(await page.getByRole('button', { name: 'Cancel', exact: true }).evaluate(element => element.matches(':focus-visible')), true);
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.getByRole('button', { name: 'Confirm Undo', exact: true }).evaluate(element => element.matches(':focus-visible')), true);
  for (const theme of ['dark', 'bright'])
  {
    await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
    for (const width of [390, 768, 1024, 1440])
    {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      const overlay = await page.getByLabel('Turn Undo confirmation').boundingBox();
      const confirm = await page.getByRole('button', { name: 'Confirm Undo', exact: true }).boundingBox();
      const field = await input.boundingBox();
      assert.ok(overlay && confirm && field);
      assert.ok(overlay.y <= field.y && overlay.y + overlay.height >= field.y + field.height);
      assert.ok(confirm.x >= 0 && confirm.x + confirm.width <= width && confirm.y + confirm.height <= 900);
      assert.ok(Math.abs((await page.locator('.composer').boundingBox()).y + (await page.locator('.composer').boundingBox()).height - 900) <= 1);
      if (artifacts) await page.screenshot({ path: path.join(artifacts, `undo-confirm-${theme}-${width}.png`), fullPage: true });
    }
  }
  await page.evaluate(() => document.documentElement.dataset.loreboundUi = 'dark');
  await page.getByRole('button', { name: 'Confirm Undo', exact: true }).focus();
  await page.keyboard.press('Enter');
  await idle(page, 1);
  const prefix = await read();
  assert.equal(prefix.adventure.version, 3);
  assert.deepEqual(prefix.turns, original.turns.slice(0, 1));
  assert.deepEqual(prefix.baseline, original.baseline);
  assert.equal(await input.inputValue(), unfinished);
  assert.equal(await input.evaluate(element => element === document.activeElement), true);
  await page.reload({ waitUntil: 'networkidle' });
  await saved(page);
  assert.deepEqual(await read(), prefix);
  assert.equal(await input.inputValue(), unfinished);
  assert.deepEqual((await read(forkId)).turns, original.turns, 'Independent Fork keeps the removed future');

  const prefixPopup = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Fork from turn 1', exact: true }).click();
  const prefixFork = await prefixPopup;
  await prefixFork.getByRole('heading', { name: 'fork: Committed Undo', exact: true }).waitFor();
  await prefixFork.close();
  await accept(page, 'A different second scene after Undo.');
  await idle(page, 2);
  const replacement = await read();
  assert.equal(replacement.adventure.version, 4);
  assert.equal(replacement.turns[1].order, 2);
  assert.notEqual(replacement.turns[1].id, original.turns[1].id);
  assert.equal(JSON.stringify(replacement).includes('The original second scene.'), false);

  const attempts = [];
  let dropped = false;
  await page.route('**/wails/runtime', async route =>
  {
    const payload = route.request().postDataJSON();
    if (payload?.args?.methodName === 'main.LibraryService.Commit' && payload.args.args[0]?.kind === 'undo_story_turn')
    {
      attempts.push(payload.args.args[0]);
      if (!dropped)
      {
        dropped = true;
        await route.fetch();
        await route.abort('failed');
        return;
      }
    }
    await route.continue();
  });
  await input.fill('Retain input during uncertain Undo.');
  await page.getByRole('button', { name: 'Undo turn 2', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm Undo', exact: true }).click();
  await page.getByRole('button', { name: 'Recover Undo', exact: true }).waitFor();
  assert.equal((await read()).turns.length, 1);
  assert.equal(await page.getByRole('button', { name: 'Library', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Cancel', exact: true }).isDisabled(), true);
  const later = structuredClone(replacement.turns[1]);
  later.id = 'browser-new-turn';
  later.passages[0].id = 'browser-new-authored';
  later.passages[1].id = 'browser-new-generated';
  await call('Commit', { schemaVersion: 3, epoch: library.epoch, adventureId: id, operationId: 'browser-later-operation', expectedVersion: 5, kind: 'append_story_turn', turn: later });
  await page.getByRole('button', { name: 'Recover Undo', exact: true }).click();
  await idle(page, 2);
  assert.deepEqual(attempts[0], attempts[1]);
  assert.equal((await read()).turns[1].id, later.id, 'Recovery does not undo the newer next turn');
  assert.equal(await input.inputValue(), 'Retain input during uncertain Undo.');
  await page.unroute('**/wails/runtime');

  const other = await page.context().newPage();
  try
  {
    await other.goto(page.url(), { waitUntil: 'networkidle' });
    await saved(other);
    await page.getByRole('button', { name: 'Undo turn 2', exact: true }).click();
    await accept(other, 'A third turn from another tab.');
    await idle(other, 3);
    await page.getByRole('button', { name: 'Confirm Undo', exact: true }).click();
    await page.getByRole('alert').getByText(/saved story or library changed/).waitFor();
    await idle(page, 3);
    assert.equal((await read()).turns.length, 3, 'Stale Undo never targets the newer head');
    await undo(3);

    // A lost append response may be recovered after that accepted turn is undone elsewhere.
    await other.reload({ waitUntil: 'networkidle' });
    await saved(other);
    let appendDropped = false;
    await other.route('**/wails/runtime', async route =>
    {
      const payload = route.request().postDataJSON();
      if (!appendDropped && payload?.args?.methodName === 'main.LibraryService.Commit' && payload.args.args[0]?.kind === 'append_story_turn')
      {
        appendDropped = true;
        await route.fetch();
        await route.abort('failed');
        return;
      }
      await route.continue();
    });
    await accept(other, 'A saved third turn subsequently undone.');
    await other.getByRole('button', { name: 'Recover save', exact: true }).waitFor();
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await idle(page, 3);
    await undo(3);
    await other.getByRole('button', { name: 'Recover save', exact: true }).click();
    await idle(other, 2);
    await other.getByRole('status').getByText(/Its turn was later undone/).waitFor();
    assert.equal((await read()).turns.length, 2);
  }
  finally
  {
    await other.close();
  }
  await undo(2);
  await undo(1);
  await page.getByText('No passages yet.', { exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: /^Undo turn / }).count(), 0);
  const baseline = await read();
  assert.deepEqual(baseline.turns, []);
  assert.ok(baseline.adventure.version > 0, 'Baseline turn count and concurrency version are independent');
  await input.fill('A draft at the restored beginning, retained across host restart.');
  await saved(page);
  assert.deepEqual((await read(forkId)).turns, original.turns);
  console.log('PASS: real turn Undo confirmation/Cancel/Escape, exact prefix/reload, independent Forks, new future, lost Undo reply after newer history, stale-tab rejection, append recovery after Undo and return to baseline; native input editing and four-width Dark/Bright overlay');
}
