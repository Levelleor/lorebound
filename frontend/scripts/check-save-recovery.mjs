import assert from 'node:assert/strict';
import path from 'node:path';

export async function exerciseSaveRecovery(page, base, artifacts)
{
  const cases = [
    ['append', 'keep', 'after'], ['undo', 'keep', 'after'],
    ['authored', 'keep', 'after'], ['authored', 'truncate', 'after'],
    ['generated', 'keep', 'after'], ['generated', 'truncate', 'after'],
    ['append', 'keep', 'before']
  ];
  for (const [kind, later, drop] of cases)
  {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByLabel('Adventure title').fill(`Reload recovery · ${kind} ${later} ${drop}`);
    await page.getByRole('button', { name: 'Start blank adventure' }).click();
    const input = page.getByLabel('Story input');
    await input.waitFor();
    const id = new URL(page.url()).searchParams.get('adventure');
    const call = (method, ...args) => page.evaluate(({ method, args }) => window.wails.Call.ByName(`main.LibraryService.${method}`, ...args), { method, args });
    const library = await call('List');
    const read = () => call('Read', { schemaVersion: 4, epoch: library.epoch, adventureId: id });
    const document = text => ({ schemaVersion: 1, type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] });
    for (const order of [1, 2])
    {
      await call('Commit', {
        schemaVersion: 4, epoch: library.epoch, adventureId: id, operationId: `seed-${order}`, expectedVersion: order - 1,
        kind: 'append_story_turn', turn: {
          schemaVersion: 1, id: `turn-${order}`, order, events: [], passages: [
            { id: `authored-${order}`, source: 'authored', body: document(`Authored scene ${order}`) },
            { id: `generated-${order}`, source: 'generated', body: document(`Continuation ${order}`) }
          ]
        }
      });
    }
    await page.reload({ waitUntil: 'networkidle' });
    const idle = () => page.waitForFunction(() => !document.querySelector('#story-input')?.disabled);
    await idle();
    const initial = await read();
    const attempts = [];
    let dropped = false;
    await page.route('**/wails/runtime', async route =>
    {
      const payload = route.request().postDataJSON();
      if (payload?.args?.methodName === 'main.LibraryService.Commit'
        && (!dropped || payload.args.args[0]?.operationId === attempts[0].operationId))
      {
        attempts.push(payload.args.args[0]);
        if (!dropped)
        {
          dropped = true;
          if (drop === 'after') await route.fetch();
          await route.abort('failed');
          return;
        }
      }
      await route.continue();
    });
    const unfinished = 'Unfinished input survives recovered edit or Undo. 🦉';
    await input.fill(kind === 'append' ? 'The third scene, explicitly accepted. 🦉' : unfinished);
    if (kind === 'append')
    {
      await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
      await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
    }
    else if (kind === 'undo')
    {
      await page.getByRole('button', { name: 'Undo turn 2', exact: true }).click();
      await page.getByRole('button', { name: 'Confirm Undo', exact: true }).click();
    }
    else
    {
      await page.getByRole('button', { name: `Edit ${kind === 'authored' ? 'Story text' : 'continuation'} for turn 1`, exact: true }).click();
      await page.getByRole('status', { name: 'Passage draft status' }).getByText('Passage draft saved · Not accepted.', { exact: true }).waitFor();
      await page.locator('#passage-edit').fill('A revised scene to recover. 🦉\n\nThe second paragraph.');
      await page.getByRole('button', { name: 'Review edit', exact: true }).click();
      await page.getByRole('button', { name: later === 'keep' ? 'Keep Later Turns' : 'Delete All After Point', exact: true }).click();
    }
    await page.getByRole('button', { name: kind === 'append' ? 'Recover save' : kind === 'undo' ? 'Recover Undo' : 'Recover edit', exact: true }).waitFor();
    assert.equal(dropped, true);
    let afterDispatch = await read();
    assert.equal(afterDispatch.adventure.version, drop === 'after' ? 3 : 2);
    if (kind === 'append' && drop === 'after')
    {
      await call('Commit', {
        schemaVersion: 4, epoch: library.epoch, adventureId: id, operationId: 'later-undo', expectedVersion: 3,
        kind: 'undo_story_turn', turnId: afterDispatch.turns.at(-1).id
      });
      afterDispatch = await read();
    }
    if (kind === 'undo')
    {
      const replacement = structuredClone(initial.turns[1]);
      replacement.id = 'replacement-turn';
      replacement.passages[0].id = 'replacement-authored';
      replacement.passages[1].id = 'replacement-generated';
      await call('Commit', {
        schemaVersion: 4, epoch: library.epoch, adventureId: id, operationId: 'later-append', expectedVersion: 3,
        kind: 'append_story_turn', turn: replacement
      });
      afterDispatch = await read();
    }
    await page.reload({ waitUntil: 'networkidle' });
    const recover = page.getByRole('button', { name: 'Recover save', exact: true });
    await recover.waitFor();
    assert.equal(attempts.length, 1, 'Reload must await deliberate recovery');
    assert.equal(await input.isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: 'Library', exact: true }).isDisabled(), true);
    assert.deepEqual(await read(), afterDispatch, 'Reload has no canonical effect');
    const record = await page.evaluate(id => JSON.parse(sessionStorage.getItem(`lorebound:pending-story-save:${id}`)), id);
    assert.deepEqual(record.request, attempts[0]);
    if (kind !== 'undo') assert.match(await page.getByLabel('Retained save text').inputValue(), /🦉/);
    if (kind === 'authored' && later === 'truncate')
    {
      for (const theme of ['dark', 'bright'])
      {
        await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
        for (const width of [390, 768, 1024, 1440])
        {
          await page.setViewportSize({ width, height: 900 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          const overlay = await page.getByLabel('Save recovery controls').boundingBox();
          const button = await recover.boundingBox();
          const field = await input.boundingBox();
          assert.ok(overlay && button && field);
          assert.ok(overlay.y <= field.y && overlay.y + overlay.height >= field.y + field.height);
          assert.ok(button.x >= 0 && button.x + button.width <= width && button.y + button.height <= 900);
          assert.equal(await page.locator('.topbar').evaluate(element => element.getBoundingClientRect().height), 48);
          assert.ok(await page.locator('.reader').evaluate(element => element.getBoundingClientRect().width) <= 672);
          await page.getByLabel('Retained save text').focus();
          await page.keyboard.press('Tab');
          assert.equal(await recover.evaluate(element => element.matches(':focus-visible')), true);
          if (artifacts) await page.screenshot({ path: path.join(artifacts, `save-recovery-${theme}-${width}.png`), fullPage: true });
        }
      }
      await page.evaluate(() => document.documentElement.dataset.loreboundUi = 'dark');
    }
    await recover.focus();
    await page.keyboard.press('Enter');
    await idle();
    assert.deepEqual(attempts[1], attempts[0], 'Recovery reuses exactly the original request');
    const recovered = await read();
    assert.equal(recovered.adventure.version, drop === 'after' ? afterDispatch.adventure.version : 3);
    if (drop === 'after') assert.deepEqual(recovered, afterDispatch, 'Receipt replay has no canonical effect');
    else assert.equal(recovered.turns.length, 3, 'A request lost before dispatch can safely finish once');
    if (kind !== 'append') assert.equal(await input.inputValue(), unfinished);
    if (kind === 'authored' || kind === 'generated')
    {
      const position = kind === 'authored' ? 0 : 1;
      assert.deepEqual(recovered.turns[0].passages[position].body, {
        schemaVersion: 1, type: 'doc', content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'A revised scene to recover. 🦉' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'The second paragraph.' }] }
        ]
      });
      if (later === 'keep') assert.deepEqual(recovered.turns.slice(1), initial.turns.slice(1));
      else
      {
        assert.equal(recovered.turns.length, 1);
        assert.equal(recovered.turns[0].passages.length, position + 1);
      }
    }
    assert.equal(await page.evaluate(id => sessionStorage.getItem(`lorebound:pending-story-save:${id}`), id), null);
    await page.unroute('**/wails/runtime');
    await page.reload({ waitUntil: 'networkidle' });
    await idle();
    assert.equal(await page.getByLabel('Save recovery', { exact: true }).count(), 0);
    assert.deepEqual(await read(), recovered);
  }
  console.log('PASS: actual browser reload recovery for append, Undo and both passage targets/choices, immutable receipt replay, before-dispatch recovery, draft isolation and four-width Dark/Bright recovery controls');
}
