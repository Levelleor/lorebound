import { firefox } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = process.env.LOREBOUND_URL ?? 'http://127.0.0.1:18080';
const statePath = process.env.BROWSER_STATE_PATH;
const artifacts = process.env.BROWSER_ARTIFACT_DIR;
const reopen = process.argv[2] === '--reopen';
assert.ok(statePath, 'Use scripts/verify-host.sh with a disposable library');
const browser = await firefox.launch({ headless: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  const externalRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', req => { if (!req.url().startsWith(base)) externalRequests.push(req.url()); });
  assert.equal((await page.goto(base, { waitUntil: 'networkidle' }))?.status(), 200);
  await page.getByRole('status').getByText('Library ready', { exact: true }).waitFor();
  const list = () => page.evaluate(() => window.wails.Call.ByName('main.LibraryService.List'));
  const initial = await list();
  assert.equal(initial.schemaVersion, 1);

  if (reopen) {
    const expected = JSON.parse(await readFile(statePath, 'utf8'));
    assert.deepEqual(initial, expected, 'Library identity, adventure IDs, names and versions survive process restart');
    for (const adventure of initial.adventures) {
      await page.locator(`[data-adventure-id="${adventure.id}"]`).click();
      await page.getByRole('heading', { name: adventure.title, exact: true }).waitFor();
      await page.getByText('No passages yet.', { exact: true }).waitFor();
      assert.equal(new URL(page.url()).searchParams.get('adventure'), adventure.id);
      await page.getByRole('button', { name: 'Library', exact: true }).click();
      await page.getByRole('heading', { name: 'Saved adventures' }).waitFor();
    }
    console.log('PASS: fresh browser after process restart resumes both exact zero-turn adventure identities');
  } else {
    assert.deepEqual(initial.adventures, [], 'Test requires a fresh disposable library');
    // Use keyboard submission for optional-title blank creation.
    await page.getByLabel('Adventure title').focus();
    await page.keyboard.press('Enter');
    await page.getByRole('heading', { name: 'Untitled Adventure', exact: true }).waitFor();
    await page.getByText('No passages yet.', { exact: true }).waitFor();
    const firstID = new URL(page.url()).searchParams.get('adventure');
    assert.ok(firstID);
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Untitled Adventure', exact: true }).waitFor();
    assert.equal(new URL(page.url()).searchParams.get('adventure'), firstID);
    console.log('PASS: keyboard blank creation, durable identity and browser reload');

    if (artifacts) {
      await mkdir(artifacts, { recursive: true });
      for (const theme of ['dark', 'bright']) {
        await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
        for (const width of [390, 768, 1024, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `No overflow at ${width}`);
          assert.equal(await page.locator('.topbar').evaluate(el => el.getBoundingClientRect().height), 48);
          assert.ok(await page.locator('.reader').evaluate(el => el.getBoundingClientRect().width) <= 672);
          if (width >= 1024) assert.equal(await page.locator('.context-rail').evaluate(el => el.getBoundingClientRect().width), 320);
          else {
            await page.getByRole('button', { name: 'World', exact: true }).click();
            await page.getByText('No characters or places recorded.', { exact: true }).waitFor();
            await page.getByRole('button', { name: 'Story', exact: true }).click();
          }
          await page.screenshot({ path: path.join(artifacts, `adventure-${theme}-${width}.png`), fullPage: true });
        }
      }
      await page.evaluate(() => document.documentElement.dataset.loreboundUi = 'dark');
    }

    await page.getByRole('button', { name: 'Library', exact: true }).click();
    await page.getByRole('heading', { name: 'Saved adventures' }).waitFor();
    // Simulate losing only the success response after a real Go/SQLite write.
    let dropped = false;
    await page.route('**/wails/runtime', async route => {
      const payload = route.request().postDataJSON();
      if (payload?.args?.methodName === 'main.LibraryService.Create' && !dropped) {
        dropped = true;
        await route.fetch(); // The real server commits before the response is lost.
        await route.abort('failed');
      } else await route.continue();
    });
    await page.getByLabel('Adventure title').fill('A winter road');
    await page.getByRole('button', { name: 'Start blank adventure' }).click();
    await page.getByRole('alert').waitFor();
    assert.equal(dropped, true, 'The fixture must actually interrupt a Create response');
    assert.equal((await list()).adventures.length, 2, 'Write succeeded despite lost response');
    await page.getByRole('button', { name: 'Reload library', exact: true }).click();
    await page.getByRole('button', { name: 'Retry creation', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Retry creation', exact: true }).click();
    await page.getByRole('heading', { name: 'A winter road', exact: true }).waitFor();
    assert.equal((await list()).adventures.length, 2, 'Retry must not create another adventure');
    console.log('PASS: simulated lost response to real commit recovers through identical-request retry without duplication');

    const rejected = await page.evaluate(async () => {
      try {
        await window.wails.Call.ByName('main.LibraryService.Create', { schemaVersion: 1, epoch: 'wrong', adventureId: 'rejected', operationId: 'rejected', title: 'Rejected', baseline: { schemaVersion: 1 } });
        return false;
      } catch { return true; }
    });
    assert.equal(rejected, true);
    const saved = await list();
    assert.equal(saved.adventures.length, 2);
    for (const adventure of saved.adventures) assert.equal(adventure.version, 0);
    await writeFile(statePath, JSON.stringify(saved));
    await page.getByRole('button', { name: 'Library', exact: true }).click();
    await page.getByRole('heading', { name: 'Saved adventures' }).waitFor();
    // A delayed open must not undo a newer browser Back navigation.
    let signalRead;
    let releaseRead;
    const readSeen = new Promise(resolve => signalRead = resolve);
    const readGate = new Promise(resolve => releaseRead = resolve);
    let delayed = false;
    await page.route('**/wails/runtime', async route => {
      const payload = route.request().postDataJSON();
      if (payload?.args?.methodName === 'main.LibraryService.Read' && !delayed) {
        delayed = true;
        const response = await route.fetch();
        signalRead();
        await readGate;
        await route.fulfill({ response });
      } else await route.continue();
    });
    await page.locator(`[data-adventure-id="${firstID}"]`).click();
    await readSeen;
    await page.evaluate(() => { history.pushState({}, '', '?navigation-test'); history.back(); });
    await page.getByRole('status').getByText('Library ready', { exact: true }).waitFor();
    const lateResponse = page.waitForResponse(response => response.url().endsWith('/wails/runtime') && response.request().postDataJSON()?.args?.methodName === 'main.LibraryService.Read');
    releaseRead();
    await (await lateResponse).finished();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(new URL(page.url()).searchParams.has('adventure'), false);
    await page.getByRole('heading', { name: 'Saved adventures' }).waitFor();
    console.log('PASS: delayed adventure read cannot override newer Back navigation');
    if (artifacts) {
      for (const width of [390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.screenshot({ path: path.join(artifacts, `library-dark-${width}.png`), fullPage: true });
      }
    }
    console.log('PASS: real bridge rejects wrong library epoch; two independent adventures remain intact');
  }
  assert.equal(await page.getByRole('alert').count(), 0);
  assert.deepEqual(errors, [], 'No uncaught browser exceptions');
  assert.deepEqual(externalRequests, [], 'No AI, remote font or other network prerequisites');
} finally { await browser.close(); }
