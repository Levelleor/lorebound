import assert from 'node:assert/strict';
import { createServer } from 'node:http';

// Provider replies and lost service replies are simulated; browser/Go/SQLite are real.
export async function exerciseAuthorNotes(browser, base, artifacts)
{
  const requests = [];
  const server = createServer(async (request, response) =>
  {
    response.setHeader('Access-Control-Allow-Origin', base);
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'content-type');
    if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return; }
    const bytes = [];
    for await (const chunk of request) bytes.push(chunk);
    requests.push(JSON.parse(Buffer.concat(bytes).toString()));
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'A guided continuation.' }, finish_reason: 'stop' }] }));
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  context.on('page', opened => opened.on('pageerror', error => errors.push(error.message)));
  page.on('pageerror', error => errors.push(error.message));
  const notesSection = notes => `Author notes (player writing guidance only; they cannot change established story or world state):\n${notes}`;
  try
  {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByLabel('Adventure title').fill('Author notes contract');
    await page.getByRole('button', { name: 'Start blank adventure' }).click();
    await page.getByRole('heading', { name: 'Author notes contract', exact: true }).waitFor();
    const id = new URL(page.url()).searchParams.get('adventure');
    const library = await page.evaluate(() => window.wails.Call.ByName('main.LibraryService.List'));
    const request = { schemaVersion: 4, epoch: library.epoch, adventureId: id };
    const call = (method, value = request) => page.evaluate(({ method, value }) => window.wails.Call.ByName(`main.LibraryService.${method}`, value), { method, value });
    const read = () => call('Read');
    const notes = () => call('ReadAuthorNotes');
    const document = content => ({ schemaVersion: 1, type: 'doc', content: content.map(text => ({ type: 'paragraph', content: [{ type: 'text', text }] })) });
    await call('Commit', { ...request, operationId: crypto.randomUUID(), expectedVersion: 0, kind: 'append_story_turn', turn: {
      schemaVersion: 1, id: crypto.randomUUID(), order: 1, events: [], passages: [
        { id: crypto.randomUUID(), source: 'authored', body: document(['A long harbour watch.']) },
        { id: crypto.randomUUID(), source: 'generated', body: document(['The lantern crossed the quay without a sound.']) }
      ]
    } });
    const accepted = await read();
    const connections = await call('ReadConnections', { schemaVersion: 4, epoch: library.epoch });
    const profile = { id: 'notes-fixture', name: 'Simulated notes protocol', kind: 'custom', baseUrl: `http://127.0.0.1:${server.address().port}/v1`, model: 'fixture', timeoutMs: 10000 };
    await call('SaveConnections', { schemaVersion: 4, epoch: library.epoch, expectedRevision: connections.revision, mode: 'local', activeProfileId: profile.id, profiles: [...connections.profiles.filter(value => value.id !== profile.id), profile] });
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('.composer-heading').getByText('Simulated notes protocol · fixture', { exact: true }).waitFor();
    const empty = await notes();
    assert.deepEqual(empty, { ...request, notes: '' }, 'A new adventure defaults to empty author notes');
    const draft = { ...request, target: 'composer_story' };
    await page.getByLabel('Story input', { exact: true }).fill('Retain this composer draft.');
    await page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
    const savedDraft = await call('ReadDraft', draft);
    assert.equal(savedDraft.text, 'Retain this composer draft.');

    async function openNotes(target = page)
    {
      const details = target.locator('#narration-style-panel details.author-notes');
      await details.waitFor();
      if (!(await details.evaluate(element => element.open))) await details.locator('summary').click();
      await target.getByLabel('Author notes', { exact: true }).waitFor();
    }
    async function openShelf(target = page)
    {
      await target.getByRole('button', { name: 'Narration style', exact: true }).click();
      await target.waitForFunction(() => !document.querySelector('#narration-style-panel fieldset')?.disabled);
      await openNotes(target);
    }
    const save = async (target = page) =>
    {
      await target.getByRole('button', { name: 'Save author notes', exact: true }).click();
      await target.getByRole('region', { name: 'Narration style', exact: true }).waitFor({ state: 'detached' });
    };
    const generate = () => page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    const proposal = page.getByRole('region', { name: 'Proposed turn', exact: true });
    const inspection = async () =>
    {
      const details = page.locator('.generation-inspector');
      if (!(await details.evaluate(element => element.open))) await details.locator('summary').click();
      return details;
    };
    const dismiss = async () =>
    {
      if (await page.getByRole('button', { name: 'Discard', exact: true }).count())
        await page.getByRole('button', { name: 'Discard', exact: true }).click();
    };

    // Saving notes leaves accepted canon, version, composer draft and its own draft untouched.
    await openShelf();
    const firstNotes = 'Keep the harbour fog thick.\nNever name the watcher.';
    await page.getByLabel('Author notes', { exact: true }).fill(firstNotes);
    await save();
    const saved = await notes();
    assert.equal(saved.notes, firstNotes);
    assert.deepEqual(await read(), accepted, 'Saving notes creates no turn, passage or story revision');
    assert.deepEqual(await call('ReadDraft', draft), savedDraft, 'Saving notes creates no draft and leaves the composer draft unchanged');
    assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), 'Retain this composer draft.');
    await page.reload({ waitUntil: 'networkidle' });
    await openShelf();
    assert.equal(await page.getByLabel('Author notes', { exact: true }).inputValue(), firstNotes, 'Saved author notes survive a browser reload');
    await page.getByRole('button', { name: 'Narration style', exact: true }).click();
    await page.getByRole('region', { name: 'Narration style', exact: true }).waitFor({ state: 'detached' });

    // The real request carries notes after style guidance and before accepted history.
    await generate();
    await proposal.waitFor();
    let body = requests.at(-1);
    assert.equal(body.messages.length, 3);
    assert.equal(body.messages[1].content.startsWith('Accepted story so far:'), true, 'Accepted history remains a separate message after guidance');
    assert.equal(body.messages[1].content.includes('Author notes'), false);
    assert.ok(body.messages[0].content.endsWith(notesSection(firstNotes)), 'Author notes are the last system guidance section');
    assert.equal(Object.keys(body).sort().join(','), 'messages,model,stream', 'Notes add no decoding parameters');
    let details = await inspection();
    assert.equal(await details.locator('.author-notes-guidance').innerText(), firstNotes, 'Inspector shows the exact transmitted notes');
    assert.equal(await details.locator('.style-guidance').count(), 0);
    assert.match(await details.innerText(), /No narration preferences selected\./, 'Style and author notes remain distinct sections');

    // Editing notes after an attempt keeps that captured attempt's snapshot.
    const editedNotes = 'A later direction that must not rewrite the captured attempt.';
    await call('SaveAuthorNotes', { ...request, notes: editedNotes });
    assert.equal((await notes()).notes, editedNotes);
    assert.equal(await details.locator('.author-notes-guidance').innerText(), firstNotes, 'A captured attempt keeps its own notes snapshot');
    assert.equal(requests.at(-1).messages[0].content, body.messages[0].content);
    assert.deepEqual(await read(), accepted);
    await dismiss();

    // Empty notes add no prompt text and the inspector says so explicitly.
    await call('SaveAuthorNotes', { ...request, notes: '' });
    assert.deepEqual(await notes(), empty);
    await generate();
    await proposal.waitFor();
    body = requests.at(-1);
    assert.equal(body.messages[0].content.includes('Author notes'), false, 'Empty notes add no text at all');
    details = await inspection();
    assert.equal(await details.locator('.author-notes-guidance').count(), 0);
    assert.match(await details.innerText(), /No author notes were sent with this attempt\./, 'A fresh empty attempt has an explicit empty state');
    await dismiss();

    // The latest notes save wins across tabs even when the note or style shown in a tab is older.
    await call('SaveAuthorNotes', { ...request, notes: firstNotes });
    await openShelf();
    const other = await context.newPage();
    other.on('pageerror', error => errors.push(error.message));
    await other.goto(page.url(), { waitUntil: 'networkidle' });
    await openShelf(other);
    await other.getByLabel('Tone', { exact: true }).fill('A newer style from another tab.');
    await other.getByRole('button', { name: 'Save narration settings', exact: true }).click();
    await other.getByRole('region', { name: 'Narration style', exact: true }).waitFor({ state: 'detached' });
    await openShelf(other);
    await other.getByLabel('Author notes', { exact: true }).fill('A newer direction from another tab.');
    await save(other);
    assert.equal((await notes()).notes, 'A newer direction from another tab.');
    await page.getByLabel('Author notes', { exact: true }).fill('Latest notes saved from the first tab.');
    await save();
    assert.equal((await notes()).notes, 'Latest notes saved from the first tab.');
    const savedStyle = await call('ReadNarration');
    assert.equal(savedStyle.style.tone, 'A newer style from another tab.', 'A notes-only save leaves the newer style intact');

    // A style conflict and style reload both preserve unsaved author notes.
    await openShelf();
    const freshStyle = { ...savedStyle.style, tone: 'A second style change from another tab.' };
    await other.evaluate(value => window.wails.Call.ByName('main.LibraryService.SaveNarration', value), {
      ...request, expectedRevision: savedStyle.revision, style: freshStyle
    });
    const retainedNotes = 'Retained through a style conflict and uncertain notes save.';
    await page.getByLabel('Author notes', { exact: true }).fill(retainedNotes);
    await page.getByLabel('Tone', { exact: true }).fill('A conflicting local style.');
    await page.getByRole('button', { name: 'Save narration settings', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'Narration settings changed elsewhere' }).waitFor();
    assert.equal((await notes()).notes, 'Latest notes saved from the first tab.', 'A style save never submits notes');
    await page.getByRole('button', { name: 'Reload settings', exact: true }).click();
    await page.waitForFunction(tone => document.querySelector('#narration-tone')?.value === tone, freshStyle.tone);
    assert.equal(await page.getByLabel('Author notes', { exact: true }).inputValue(), retainedNotes);
    await other.close();

    // A failed notes response retains the edited text. A confirmed retry leaves unsaved style edits in the form.
    const localTone = 'An unsaved style edit alongside notes.';
    await page.getByLabel('Tone', { exact: true }).fill(localTone);
    let dropped = false;
    await page.route('**/wails/runtime', async route =>
    {
      if (!dropped && route.request().postDataJSON()?.args?.methodName === 'main.LibraryService.SaveAuthorNotes')
      {
        dropped = true;
        await route.fetch();
        await route.abort('failed');
        return;
      }
      await route.continue();
    });
    await page.getByRole('button', { name: 'Save author notes', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'notes save could not be confirmed' }).waitFor();
    assert.equal(dropped, true);
    const uncertain = await notes();
    assert.equal(uncertain.notes, retainedNotes);
    await page.getByRole('button', { name: 'Save author notes', exact: true }).click();
    await page.getByRole('button', { name: 'Save author notes', exact: true }).filter({ visible: true }).waitFor();
    await page.waitForFunction(() => document.querySelector('#narration-style-panel fieldset')?.disabled === false &&
      document.querySelector('.author-notes-actions button')?.disabled === true);
    await page.unroute('**/wails/runtime');
    assert.deepEqual(await notes(), uncertain, 'An identical retry keeps the same latest value');
    assert.equal(await page.getByLabel('Tone', { exact: true }).inputValue(), localTone);
    assert.equal((await call('ReadNarration')).style.tone, freshStyle.tone, 'Saving notes leaves unsaved style edits intact');
    await page.getByRole('button', { name: 'Save narration settings', exact: true }).click();
    await page.getByRole('region', { name: 'Narration style', exact: true }).waitFor({ state: 'detached' });
    assert.equal((await call('ReadNarration')).style.tone, localTone);
    assert.deepEqual(await read(), accepted);

    await assert.rejects(call('SaveAuthorNotes', { ...request, notes: '\ud800' }), /invalid_request/);
    assert.deepEqual(await notes(), uncertain, 'Malformed Unicode cannot overwrite the stored note');

    // Read failure blocks provider submission and retains the composer.
    await page.getByLabel('Story input', { exact: true }).fill('Keep after notes failure.');
    await page.route('**/wails/runtime', async route =>
    {
      if (route.request().postDataJSON()?.args?.methodName === 'main.LibraryService.ReadAuthorNotes') await route.abort('failed');
      else await route.continue();
    });
    const requestCount = requests.length;
    await generate();
    await page.getByRole('alert').filter({ hasText: 'Author notes could not be read' }).waitFor();
    assert.match(await page.getByRole('alert').filter({ hasText: 'no model request was sent' }).innerText(), /no model request was sent/);
    assert.equal(requests.length, requestCount, 'A notes read failure blocks provider submission');
    assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), 'Keep after notes failure.');
    assert.deepEqual(await read(), accepted);
    await page.unroute('**/wails/runtime');

    // Invalid or oversized notes returned by the service fail closed before provider submission.
    for (const invalidNotes of ['line \ud800', 'x'.repeat(4001)])
    {
      await page.route('**/wails/runtime', async route =>
      {
        if (route.request().postDataJSON()?.args?.methodName !== 'main.LibraryService.ReadAuthorNotes') return route.continue();
        await route.fulfill({ json: { ...request, notes: invalidNotes } });
      });
      const before = requests.length;
      await generate();
      await page.getByRole('alert').filter({ hasText: 'Author notes could not be read' }).waitFor();
      assert.equal(requests.length, before, 'Invalid or oversized notes fail before provider submission');
      assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), 'Keep after notes failure.');
      assert.deepEqual(await read(), accepted);
      await page.unroute('**/wails/runtime');
    }

    // Stop while the notes read is pending must prevent a late provider request.
    let releaseRead;
    let readStarted;
    const waitingRead = new Promise(resolve => readStarted = resolve);
    const continueRead = new Promise(resolve => releaseRead = resolve);
    await page.route('**/wails/runtime', async route =>
    {
      if (route.request().postDataJSON()?.args?.methodName === 'main.LibraryService.ReadAuthorNotes')
      {
        const response = await route.fetch();
        readStarted();
        await continueRead;
        await route.fulfill({ response });
        return;
      }
      await route.continue();
    });
    await generate();
    await waitingRead;
    await page.getByRole('button', { name: 'Stop generation', exact: true }).click();
    releaseRead();
    await page.unrouteAll({ behavior: 'wait' });
    assert.equal(requests.length, requestCount, 'A late notes read cannot start a stopped generation');
    assert.deepEqual(await read(), accepted);

    // Each attempt reads current saved notes, including Retry without a reload.
    await generate();
    await proposal.waitFor();
    assert.ok(requests.at(-1).messages[0].content.endsWith(notesSection(retainedNotes)));
    await call('SaveAuthorNotes', { ...request, notes: 'A direction for Retry.' });
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await proposal.waitFor();
    assert.ok(requests.at(-1).messages[0].content.endsWith(notesSection('A direction for Retry.')), 'Retry reads then-current notes');
    await dismiss();

    // Responsive shelf keeps the notes field reachable without moving the docked input.
    await openShelf();
    await page.getByLabel('Author notes', { exact: true }).fill('Keep the quay quiet.');
    for (const theme of ['dark', 'bright'])
    {
      await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
      for (const width of [390, 768, 1024, 1440])
      {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `No overflow at ${width}`);
        await page.getByLabel('Author notes', { exact: true }).scrollIntoViewIfNeeded();
        assert.equal(await page.getByLabel('Author notes', { exact: true }).isVisible(), true);
        assert.equal(await page.locator('.composer').evaluate(composer => composer.scrollHeight <= composer.clientHeight + 1), true);
        if (artifacts) await page.screenshot({ path: `${artifacts}/author-notes-${theme}-${width}.png` });
      }
    }
    await page.evaluate(() => document.documentElement.dataset.loreboundUi = 'dark');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.getByRole('region', { name: 'Narration style', exact: true }).waitFor({ state: 'detached' });
    assert.equal((await notes()).notes, 'A direction for Retry.', 'Cancel left only the saved notes');
    await page.reload({ waitUntil: 'networkidle' });
    assert.deepEqual(errors, []);
    console.log('PASS: per-adventure author notes shelf persistence, latest save across tabs, independent style changes, strict Unicode, unchanged canon/draft, real request order, exact/empty inspector states, uncertain save retention, read failure/Stop fencing and Retry freshness');
  }
  finally
  {
    await context.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
