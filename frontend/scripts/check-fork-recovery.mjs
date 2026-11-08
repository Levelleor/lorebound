import assert from 'node:assert/strict';
import path from 'node:path';

export async function exerciseForkRecovery(page, base, artifacts)
{
  const document = text => ({ schemaVersion: 1, type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] });
  for (const scenario of ['committed', 'unsent', 'stale'])
  {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByLabel('Adventure title').fill(`Fork reload · ${scenario}`);
    await page.getByRole('button', { name: 'Start blank adventure' }).click();
    await page.getByLabel('Story input').waitFor();
    const sourceUrl = page.url();
    const sourceId = new URL(sourceUrl).searchParams.get('adventure');
    const call = (method, ...args) => page.evaluate(({ method, args }) => window.wails.Call.ByName(`main.LibraryService.${method}`, ...args), { method, args });
    const library = await call('List');
    const read = adventureId => call('Read', { schemaVersion: 4, epoch: library.epoch, adventureId });
    const commit = (adventureId, expectedVersion, kind, change) => call('Commit', {
      schemaVersion: 4, epoch: library.epoch, adventureId, operationId: crypto.randomUUID(), expectedVersion, kind, ...change
    });
    for (const order of [1, 2])
    {
      await commit(sourceId, order - 1, 'append_story_turn', {
        turn: {
          schemaVersion: 1, id: `turn-${order}`, order, events: [], passages: [
            { id: `authored-${order}`, source: 'authored', body: document(`Original scene ${order}`) },
            { id: `generated-${order}`, source: 'generated', body: document(`Continuation ${order}`) }
          ]
        }
      });
    }
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => !document.querySelector('#story-input')?.disabled);
    const source = await read(sourceId);
    const unfinished = 'The source keeps this unfinished input. 🦉';
    await page.getByLabel('Story input').fill(unfinished);
    await page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
    const attempts = [];
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
          if (scenario === 'committed') await route.fetch();
          return route.abort('failed');
        }
      }
      return route.continue();
    });
    const popup = page.context().waitForEvent('page');
    await page.getByRole('button', { name: 'Fork from turn 2', exact: true }).click();
    const target = await popup;
    await page.getByRole('button', { name: 'Recover fork', exact: true }).waitFor();
    await target.close();
    assert.equal(attempts.length, 1);
    const forkId = attempts[0].adventureId;
    const recoveryKey = `lorebound:pending-fork:${sourceId}`;
    const stored = await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), recoveryKey);
    assert.deepEqual(stored.attempt.request, attempts[0]);
    assert.equal(stored.attempt.turnOrder, 2);

    let destination;
    if (scenario !== 'unsent')
    {
      // Model another tab removing the source boundary before this tab reloads.
      await commit(sourceId, 2, 'undo_story_turn', { turnId: 'turn-2' });
      await commit(sourceId, 3, 'undo_story_turn', { turnId: 'turn-1' });
    }
    if (scenario === 'committed')
    {
      assert.deepEqual((await read(forkId)).turns, source.turns);
      // The destination also changes independently; an old receipt cannot restore it.
      await commit(forkId, 2, 'undo_story_turn', { turnId: 'turn-2' });
      await commit(forkId, 3, 'undo_story_turn', { turnId: 'turn-1' });
      await commit(forkId, 4, 'append_story_turn', {
        turn: {
          ...source.turns[0], id: 'new-future', order: 1,
          passages: source.turns[0].passages.map(passage => ({
            ...passage, id: `new-${passage.id}`, body: document('A different accepted future in the fork.')
          }))
        }
      });
      destination = await read(forkId);
    }

    await page.reload({ waitUntil: 'networkidle' });
    const recover = page.getByRole('button', { name: 'Recover fork', exact: true });
    await recover.waitFor();
    assert.equal(attempts.length, 1, 'Reload never automatically sends a Fork');
    assert.equal(await page.getByLabel('Story input').isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: 'Library', exact: true }).isDisabled(), true);
    assert.equal(await page.getByLabel('Story input').inputValue(), unfinished);
    if (scenario !== 'unsent')
    {
      await page.getByRole('region', { name: 'Fork recovery', exact: true }).waitFor();
      assert.equal(await page.locator('.accepted-turn').count(), 0, 'Recovery remains reachable without its source turn');
    }
    if (artifacts && scenario === 'committed')
    {
      for (const theme of ['dark', 'bright'])
      {
        await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
        for (const width of [390, 768, 1024, 1440])
        {
          await page.setViewportSize({ width, height: 900 });
          await recover.focus();
          assert.equal(await recover.evaluate(el => el.matches(':focus-visible')), true);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          assert.equal(await page.locator('.topbar').evaluate(el => el.getBoundingClientRect().height), 48);
          assert.ok(await page.locator('.reader').evaluate(el => el.getBoundingClientRect().width) <= 672);
          if (width >= 1024) assert.equal(await page.locator('.context-rail').evaluate(el => el.getBoundingClientRect().width), 320);
          await page.screenshot({ path: path.join(artifacts, `fork-recovery-${theme}-${width}.png`), fullPage: true });
        }
      }
    }
    const tabs = page.context().pages().length;
    await recover.focus();
    await page.keyboard.press('Enter');
    if (scenario === 'stale')
    {
      await page.getByRole('alert').getByText(/fork was rejected/).waitFor();
      await page.waitForFunction(() => !document.querySelector('#story-input')?.disabled);
      assert.equal((await call('List')).adventures.length, library.adventures.length);
      await page.getByRole('button', { name: 'Dismiss', exact: true }).click();
    }
    else
    {
      const open = page.getByRole('link', { name: 'Open fork', exact: true });
      await open.waitFor();
      assert.equal(page.context().pages().length, tabs, 'Reload recovery does not create another popup automatically');
      assert.equal((await call('List')).adventures.length, library.adventures.length + 1);
      assert.deepEqual((await read(forkId)).turns, destination?.turns ?? source.turns);
      const opened = page.context().waitForEvent('page');
      await open.click();
      const forkTab = await opened;
      await forkTab.getByRole('heading', { name: `fork: ${source.adventure.title}`, exact: true }).waitFor();
      await forkTab.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
      assert.equal(await forkTab.getByLabel('Story input').inputValue(), '');
      assert.equal(new URL(forkTab.url()).searchParams.get('adventure'), forkId);
      await forkTab.close();
    }
    assert.deepEqual(attempts[1], attempts[0]);
    assert.equal(page.url(), sourceUrl);
    assert.equal(await page.getByLabel('Story input').inputValue(), unfinished);
    assert.equal(await page.evaluate(key => sessionStorage.getItem(key), recoveryKey), null);
    await page.unroute('**/wails/runtime');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => !document.querySelector('#story-input')?.disabled);
    assert.equal(await page.getByRole('button', { name: 'Recover fork', exact: true }).count(), 0);

    if (scenario === 'unsent')
    {
      await page.evaluate(key => sessionStorage.setItem(key, '{'), recoveryKey);
      await page.reload({ waitUntil: 'networkidle' });
      const retryAccess = page.getByRole('button', { name: 'Retry fork recovery access', exact: true });
      await retryAccess.waitFor();
      assert.equal(await page.getByLabel('Story input').isDisabled(), true);
      assert.equal(await page.getByRole('button', { name: 'Fork from turn 1', exact: true }).isDisabled(), true);
      assert.equal(attempts.length, 2);
      await page.evaluate(key => sessionStorage.removeItem(key), recoveryKey);
      await retryAccess.click();
      await page.waitForFunction(() => !document.querySelector('#story-input')?.disabled);
      assert.deepEqual(await read(sourceId), source);
    }
  }
  console.log(`PASS: explicit same-tab Fork reload recovery before/after dispatch, removed source boundary, current destination after Undo/new future, stale rejection, malformed storage and latest source draft${artifacts ? '; 8 responsive captures' : ''}`);
}
