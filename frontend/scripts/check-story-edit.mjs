import assert from 'node:assert/strict';
import path from 'node:path';

export async function exerciseEdit(page, base, artifacts)
{
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByLabel('Adventure title').fill('Editable continuations');
  await page.getByRole('button', { name: 'Start blank adventure' }).click();
  const input = page.getByLabel('Story input');
  await input.waitFor();
  const id = new URL(page.url()).searchParams.get('adventure');
  const call = (method, ...args) => page.evaluate(({ method, args }) => window.wails.Call.ByName(`main.LibraryService.${method}`, ...args), { method, args });
  const library = await call('List');
  const read = adventureId => call('Read', { schemaVersion: 3, epoch: library.epoch, adventureId: adventureId ?? id });
  const idle = target => target.waitForFunction(() => !document.querySelector('#story-input')?.disabled);
  const open = async (target, order) =>
  {
    await target.getByRole('button', { name: `Edit continuation for turn ${order}`, exact: true }).click();
    await target.getByRole('status', { name: 'Passage draft status' }).getByText('Passage draft saved · Not accepted.', { exact: true }).waitFor();
  };
  const passageInput = target => target.locator('#passage-edit');
  const draftSaved = target => target.getByRole('status', { name: 'Passage draft status' }).getByText('Passage draft saved · Not accepted.', { exact: true }).waitFor();
  const review = target => target.getByRole('button', { name: 'Review edit', exact: true }).click();
  const keep = async target =>
  {
    await review(target);
    await target.getByRole('button', { name: 'Keep Later Turns', exact: true }).click();
    await idle(target);
  };
  for (const text of ['The key lay beneath the lamp.', 'Mara took the key.', 'She unlocked the gate.'])
  {
    await input.fill(text);
    await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await idle(page);
  }
  const original = await read();
  const popup = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Fork from turn 3', exact: true }).click();
  const fork = await popup;
  await fork.getByRole('heading', { name: 'fork: Editable continuations', exact: true }).waitFor();
  const forkId = new URL(fork.url()).searchParams.get('adventure');
  await fork.close();
  await input.fill('Keep my unfinished next input.');
  await page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
  await open(page, 1);
  assert.equal(await passageInput(page).evaluate(element => element === document.activeElement), true);
  assert.equal(await input.isDisabled(), true);
  const editedText = 'No key was ever left here. 🦉\n\nThe player chooses what remains true.';
  await passageInput(page).fill(editedText);
  await draftSaved(page);
  assert.deepEqual(await read(), original, 'Typing and autosave are noncanonical');
  await page.reload({ waitUntil: 'networkidle' });
  await open(page, 1);
  assert.equal(await passageInput(page).inputValue(), editedText, 'Latest passage draft restores on explicit reopen');
  assert.equal(await input.inputValue(), 'Keep my unfinished next input.');
  await review(page);
  assert.equal(await page.getByRole('button', { name: 'Keep Later Turns', exact: true }).evaluate(element => element === document.activeElement), true);
  for (const theme of ['dark', 'bright'])
  {
    await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
    for (const width of [390, 768, 1024, 1440])
    {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      const overlay = await page.getByLabel('Passage edit controls').boundingBox();
      const field = await input.boundingBox();
      assert.ok(overlay && field && overlay.y <= field.y && overlay.y + overlay.height >= field.y + field.height);
      for (const name of ['Keep Later Turns', 'Delete All After Point', 'Continue Editing', 'Discard'])
      {
        const bounds = await page.getByRole('button', { name, exact: true }).boundingBox();
        assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width && bounds.y + bounds.height <= 900, `${name} reachable at ${width}`);
        assert.ok(bounds.y >= overlay.y + 8 && bounds.y + bounds.height <= overlay.y + overlay.height - 8, `${name} fits inside the overlay at ${width}`);
      }
      if (artifacts) await page.screenshot({ path: path.join(artifacts, `edit-confirm-${theme}-${width}.png`), fullPage: true });
    }
  }
  await page.evaluate(() => document.documentElement.dataset.loreboundUi = 'dark');
  await page.keyboard.press('Escape');
  assert.equal(await passageInput(page).evaluate(element => element === document.activeElement), true);
  assert.deepEqual(await read(), original, 'Continue Editing/Escape does not commit');
  await keep(page);
  const kept = await read();
  assert.deepEqual(kept.turns.slice(1), original.turns.slice(1));
  assert.deepEqual(kept.turns[0].passages[0], original.turns[0].passages[0]);
  assert.equal(kept.turns[0].passages[1].id, original.turns[0].passages[1].id);
  assert.equal(kept.adventure.version, 4);
  assert.equal(await input.inputValue(), 'Keep my unfinished next input.');
  await open(page, 2);
  await passageInput(page).fill('');
  await draftSaved(page);
  await page.reload({ waitUntil: 'networkidle' });
  await open(page, 2);
  assert.equal(await passageInput(page).inputValue(), '', 'Intentionally empty draft survives reload');
  await review(page);
  await page.getByRole('alert').getByText(/nonempty passage/).waitFor();
  await page.getByRole('button', { name: 'Discard', exact: true }).click();
  await idle(page);
  assert.deepEqual(await read(), kept);
  await open(page, 2);
  assert.notEqual(await passageInput(page).inputValue(), '', 'Discard removes saved draft');
  await page.getByRole('button', { name: 'Discard', exact: true }).click();
  await idle(page);

  // Same-target shared autosaves remain noncanonical; stale confirmation requires a new decision.
  const other = await page.context().newPage();
  try
  {
    await other.goto(page.url(), { waitUntil: 'networkidle' });
    await open(page, 1);
    await passageInput(page).fill('Retain my conflicting edit.');
    await draftSaved(page);
    await review(page);
    await open(other, 1);
    await passageInput(other).fill('Another tab accepted this passage.');
    await keep(other);
    const changed = await read();
    await page.getByRole('button', { name: 'Delete All After Point', exact: true }).click();
    await page.getByRole('button', { name: 'Review against current story', exact: true }).waitFor();
    assert.deepEqual(await read(), changed, 'Stale truncation cannot delete newer history');
    assert.equal(await passageInput(page).inputValue(), 'Retain my conflicting edit.');
    await page.locator('details[open]').getByText('Another tab accepted this passage.', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Review against current story', exact: true }).click();
    await page.getByRole('button', { name: 'Review edit', exact: true }).waitFor();
    await keep(page);
  }
  finally
  {
    await other.close();
  }

  const attempts = [];
  let dropped = false;
  await page.route('**/wails/runtime', async route =>
  {
    const payload = route.request().postDataJSON();
    if (payload?.args?.methodName === 'main.LibraryService.Commit' && payload.args.args[0]?.kind === 'edit_generated_passage')
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
  await open(page, 1);
  await passageInput(page).fill('A different ending for the first scene.');
  await review(page);
  await page.getByRole('button', { name: 'Delete All After Point', exact: true }).click();
  await page.getByRole('button', { name: 'Recover edit', exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Library', exact: true }).isDisabled(), true);
  const truncated = await read();
  assert.equal(truncated.turns.length, 1);
  const nextTurn = structuredClone(original.turns[1]);
  nextTurn.id = 'edit-new-turn';
  nextTurn.passages[0].id = 'edit-new-authored';
  nextTurn.passages[1].id = 'edit-new-generated';
  await call('Commit', { schemaVersion: 3, epoch: library.epoch, adventureId: id, operationId: 'after-edit', expectedVersion: truncated.adventure.version, kind: 'append_story_turn', turn: nextTurn });
  await page.getByRole('button', { name: 'Recover edit', exact: true }).click();
  await idle(page);
  assert.deepEqual(attempts[0], attempts[1]);
  assert.equal((await read()).turns[1].id, nextTurn.id, 'Recover never repeats truncation against new history');
  await page.unroute('**/wails/runtime');
  assert.deepEqual((await read(forkId)).turns, original.turns, 'Independent Fork keeps original prose/future');
  await page.getByRole('button', { name: 'Undo turn 2', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm Undo', exact: true }).click();
  await idle(page);
  assert.deepEqual((await read()).turns, truncated.turns);
  await open(page, 1);
  await passageInput(page).fill('A passage draft retained across host restart.');
  await draftSaved(page);
  await page.reload({ waitUntil: 'networkidle' });
  await idle(page);
  console.log('PASS: inline generated-passage edit/draft/reload/empty/discard, four choices, exact Keep/Truncate, stale same-target comparison, original-operation recovery after newer continuation, Fork/Undo isolation, responsive Dark/Bright overlay');
}
