import assert from 'node:assert/strict';
import path from 'node:path';

function deferred()
{
  let resolve;
  const promise = new Promise(complete =>
  {
    resolve = complete;
  });
  return { promise, resolve };
}

async function waitForGate(gate, description)
{
  let timer;
  const timeout = new Promise((_, reject) =>
  {
    timer = setTimeout(() => reject(new Error(`Timed out waiting for ${description}`)), 10000);
  });
  try
  {
    await Promise.race([gate.promise, timeout]);
  }
  finally
  {
    clearTimeout(timer);
  }
}

function method(route, name)
{
  return route.request().postDataJSON()?.args?.methodName === `main.LibraryService.${name}`;
}

async function readStory(page, adventureId)
{
  return page.evaluate(async id =>
  {
    const library = await window.wails.Call.ByName('main.LibraryService.List');
    return window.wails.Call.ByName('main.LibraryService.Read', {
      schemaVersion: 4, epoch: library.epoch, adventureId: id
    });
  }, adventureId);
}

async function openStory(page, base, adventureId)
{
  await page.goto(`${base}/?adventure=${adventureId}`, { waitUntil: 'networkidle' });
  await page.getByLabel('Story input').waitFor();
}

async function generate(page, text)
{
  await page.getByLabel('Story input').fill(text);
  await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
  await page.getByRole('button', { name: 'Accept turn', exact: true }).waitFor();
}

async function shown(page, version)
{
  await page.waitForFunction(count => document.querySelectorAll('.accepted-turn').length === count, version);
}

async function accept(page, version)
{
  await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
  await shown(page, version);
  await page.getByRole('status').getByText('✓ Saved', { exact: true }).waitFor();
}

async function capture(page, artifacts, name)
{
  if (artifacts) await page.screenshot({ path: path.join(artifacts, `${name}.png`), fullPage: true });
}

export async function exerciseStoryIntegration(page, base, artifacts, adventureId)
{
  const context = page.context();
  const initial = await readStory(page, adventureId);
  let version = initial.adventure.version;
  const library = await page.evaluate(() => window.wails.Call.ByName('main.LibraryService.List'));
  const otherId = library.adventures.find(adventure => adventure.id !== adventureId).id;
  const isolated = await readStory(page, otherId);

  // Clock control only delays the explicitly simulated generator; storage stays real.
  await page.clock.install({ time: new Date('2026-11-05T12:00:00Z') });
  await page.clock.pauseAt(new Date('2026-11-05T12:01:00Z'));
  await page.getByLabel('Story input').fill('Abandoned while generation is running.');
  await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
  await page.getByRole('button', { name: 'Stop generation', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Library', exact: true }).click();
  await page.locator(`[data-adventure-id="${otherId}"]`).click();
  await page.getByLabel('Story input').waitFor();
  await page.clock.runFor(1000);
  await page.clock.resume();
  assert.equal(await page.getByRole('region', { name: 'Proposed turn', exact: true }).count(), 0);
  assert.equal(await page.getByLabel('Story input').inputValue(), '');
  assert.deepEqual(await readStory(page, adventureId), initial);
  assert.deepEqual(await readStory(page, otherId), isolated);

  await openStory(page, base, adventureId);
  await generate(page, 'A ready proposal abandoned through the Library.');
  await page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Library', exact: true }).click();
  await page.locator(`[data-adventure-id="${adventureId}"]`).click();
  await shown(page, version);
  await page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
  assert.equal(await page.getByRole('region', { name: 'Proposed turn', exact: true }).count(), 0);
  assert.equal(await page.getByLabel('Story input').inputValue(), 'A ready proposal abandoned through the Library.');
  assert.deepEqual(await readStory(page, adventureId), initial);
  console.log('PASS: leaving generating and ready proposals never accepts them or leaks them into another adventure');

  const other = await context.newPage();
  try
  {
    await openStory(other, base, adventureId);
    await page.evaluate(id =>
    {
      window.storyIntegrationHints = 0;
      const channel = new BroadcastChannel('lorebound-story-changes');
      window.storyIntegrationChannel = channel;
      channel.onmessage = event =>
      {
        if (event.data?.adventureId === id) window.storyIntegrationHints++;
      };
    }, adventureId);
    const readSeen = deferred();
    const releaseRead = deferred();
    let delayed = false;
    await page.route('**/wails/runtime', async route =>
    {
      if (!method(route, 'Read') || delayed) return route.continue();
      delayed = true;
      const response = await route.fetch();
      readSeen.resolve();
      await waitForGate(releaseRead, 'delayed cross-tab read release');
      await route.fulfill({ response });
    });
    await page.getByLabel('Story input').fill('Local input before the other tab saves.');
    await generate(other, 'An accepted turn from the other tab.');
    await accept(other, ++version);
    await waitForGate(readSeen, 'cross-tab read');
    await page.getByLabel('Story input').fill('Local input typed during the delayed refresh.');
    assert.equal(await page.getByRole('button', { name: 'Generate continuation', exact: true }).isDisabled(), true);
    await generate(other, 'A newer turn arrives while the earlier read is still in flight.');
    await accept(other, ++version);
    await page.waitForFunction(() => window.storyIntegrationHints >= 2);
    releaseRead.resolve();
    await shown(page, version);
    await page.waitForFunction(() => !document.querySelector('button[aria-label="Generate continuation"]')?.disabled);
    assert.equal(await page.getByLabel('Story input').inputValue(), 'Local input typed during the delayed refresh.');
    await page.evaluate(() => window.storyIntegrationChannel.close());
    await page.unroute('**/wails/runtime');
    await capture(page, artifacts, 'story-refresh-retained-input');
    console.log('PASS: successive real cross-tab commits drain a queued refresh to newest history, preserve typing and disable generation while reading');

    await generate(page, 'This proposal stays until I discard it.');
    const proposal = await page.getByRole('region', { name: 'Proposed turn', exact: true }).innerText();
    await generate(other, 'Another accepted turn while a proposal remains open.');
    await accept(other, ++version);
    // The browser delivers a real BroadcastChannel message; focus is an additional refresh hint.
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    assert.equal(await page.getByRole('region', { name: 'Proposed turn', exact: true }).innerText(), proposal);
    assert.equal(await page.locator('.accepted-turn').count(), version - 1);
    await page.getByRole('button', { name: 'Discard', exact: true }).focus();
    await page.keyboard.press('Enter');
    await shown(page, version);
    assert.equal(await page.getByLabel('Story input').inputValue(), 'This proposal stays until I discard it.');
    assert.equal(await page.getByRole('region', { name: 'Proposed turn', exact: true }).count(), 0);
    console.log('PASS: pending proposal survives refresh hints; keyboard Discard drains the deferred canonical refresh');

    const readFailureAttempts = [];
    let committed = false;
    let failedRead = false;
    await page.route('**/wails/runtime', async route =>
    {
      if (method(route, 'Commit'))
      {
        readFailureAttempts.push(route.request().postDataJSON().args.args[0]);
        const response = await route.fetch();
        committed = true;
        return route.fulfill({ response });
      }
      if (method(route, 'Read') && committed && !failedRead)
      {
        failedRead = true;
        return route.abort('failed');
      }
      return route.continue();
    });
    await generate(page, 'This save succeeds but its next read fails.');
    await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await page.getByRole('button', { name: 'Recover save', exact: true }).waitFor();
    assert.equal(failedRead, true);
    assert.equal((await readStory(other, adventureId)).adventure.version, ++version);
    assert.equal(await page.getByLabel('Story input').inputValue(), 'This save succeeds but its next read fails.');
    assert.equal(await page.getByRole('button', { name: 'Library', exact: true }).isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: 'Discard', exact: true }).isDisabled(), true);
    await capture(page, artifacts, 'story-post-commit-read-failure');
    await page.getByRole('button', { name: 'Recover save', exact: true }).click();
    await shown(page, version);
    await page.getByRole('status').getByText('✓ Saved', { exact: true }).waitFor();
    assert.equal(readFailureAttempts.length, 2);
    assert.deepEqual(readFailureAttempts[0], readFailureAttempts[1]);
    assert.equal((await readStory(other, adventureId)).turns.length, version);
    await page.unroute('**/wails/runtime');
    console.log('PASS: intercepted post-commit read failure recovers the same real SQLite turn without duplicate acceptance');

    const lostReplyAttempts = [];
    let dropped = false;
    await page.route('**/wails/runtime', async route =>
    {
      if (!method(route, 'Commit')) return route.continue();
      lostReplyAttempts.push(route.request().postDataJSON().args.args[0]);
      if (dropped) return route.continue();
      dropped = true;
      await route.fetch();
      return route.abort('failed');
    });
    await generate(page, 'An uncertain save followed by a newer turn.');
    await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await page.getByRole('button', { name: 'Recover save', exact: true }).waitFor();
    assert.equal((await readStory(other, adventureId)).adventure.version, ++version);
    await other.reload({ waitUntil: 'networkidle' });
    await shown(other, version);
    await generate(other, 'A newer turn accepted before the lost reply is recovered.');
    await accept(other, ++version);
    const newest = await readStory(other, adventureId);
    await page.getByRole('button', { name: 'Recover save', exact: true }).click();
    await shown(page, version);
    await page.getByRole('status').getByText('✓ Saved', { exact: true }).waitFor();
    assert.equal(lostReplyAttempts.length, 2);
    assert.deepEqual(lostReplyAttempts[0], lostReplyAttempts[1]);
    assert.deepEqual(await readStory(page, adventureId), newest);
    await page.unroute('**/wails/runtime');
    console.log('PASS: unchanged lost-reply retry returns the old receipt while the UI reconstructs newer accepted history');

    await generate(page, 'Retain this input through a failed conflict reload.');
    await generate(other, 'The competing tab wins before conflict recovery.');
    await accept(other, ++version);
    const winner = await readStory(other, adventureId);
    let rejectedCommit = false;
    let conflictReadFailed = false;
    await page.route('**/wails/runtime', async route =>
    {
      if (method(route, 'Commit'))
      {
        const response = await route.fetch();
        rejectedCommit = true;
        return route.fulfill({ response });
      }
      if (method(route, 'Read') && rejectedCommit)
      {
        conflictReadFailed = true;
        return route.abort('failed');
      }
      return route.continue();
    });
    await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await page.getByRole('alert').getByText(/current story could not be loaded/).waitFor();
    assert.equal(conflictReadFailed, true);
    assert.equal(await page.getByLabel('Story input').isDisabled(), true);
    assert.equal(await page.getByLabel('Story input').inputValue(), 'Retain this input through a failed conflict reload.');
    assert.deepEqual(await readStory(other, adventureId), winner);
    await capture(page, artifacts, 'story-conflict-read-failure');
    await page.unroute('**/wails/runtime');
    await page.getByRole('button', { name: 'Reload story', exact: true }).click();
    await shown(page, version);
    await page.getByRole('alert').waitFor({ state: 'hidden' });
    assert.equal(await page.getByLabel('Story input').inputValue(), 'Retain this input through a failed conflict reload.');
    assert.equal(await page.getByLabel('Story input').isEnabled(), true);
    assert.deepEqual(await readStory(page, adventureId), winner);
    console.log('PASS: failed stale-conflict refetch blocks writing; deliberate Reload restores current history and retained text');
  }
  finally
  {
    await page.unroute('**/wails/runtime');
    await other.close();
  }

  assert.deepEqual(await readStory(page, otherId), isolated, 'All Story integration cases preserve the other adventure exactly');
  const durable = await readStory(page, adventureId);
  await generate(page, 'A provisional turn abandoned by closing the last tab.');
  await page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
  assert.equal(context.pages().length, 1);
  await page.close();
  assert.equal(context.pages().length, 0);
  const reopened = await context.newPage();
  await openStory(reopened, base, adventureId);
  await shown(reopened, version);
  await reopened.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
  assert.deepEqual(await readStory(reopened, adventureId), durable);
  assert.equal(await reopened.getByRole('region', { name: 'Proposed turn', exact: true }).count(), 0);
  assert.equal(await reopened.getByLabel('Story input').inputValue(), 'A provisional turn abandoned by closing the last tab.');
  console.log('PASS: closing the last browser tab leaves the real host alive; accepted history and saved input survive, generated candidates do not');
  return reopened;
}
