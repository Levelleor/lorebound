import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import path from 'node:path';

// Provider replies and lost service replies are simulated; browser/Go/SQLite are real.
export async function exerciseNarration(browser, base, artifacts, { capturePrefix = 'narration', layoutOnly = false } = {})
{
  const requests = [];
  let release = () => {};
  const server = createServer(async (request, response) =>
  {
    response.setHeader('Access-Control-Allow-Origin', base);
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'content-type');
    if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return; }
    const bytes = [];
    for await (const chunk of request) bytes.push(chunk);
    const body = JSON.parse(Buffer.concat(bytes).toString());
    requests.push(body);
    if (body.stream)
    {
      response.setHeader('Content-Type', 'text/event-stream');
      const frame = (content, finish_reason = null) => `data: ${JSON.stringify({ choices: [{ index: 0, delta: { content }, finish_reason }] })}\n\n`;
      response.write(frame('Simulated styled preview.'));
      release = () => response.end(frame(' Complete.', 'stop') + 'data: [DONE]\n\n');
      return;
    }
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'Simulated styled continuation.' }, finish_reason: 'stop' }] }));
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  context.on('page', opened => opened.on('pageerror', error => errors.push(error.message)));
  page.on('pageerror', error => errors.push(error.message));
  try
  {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByLabel('Adventure title').fill('Narration settings contract');
    await page.getByRole('button', { name: 'Start blank adventure' }).click();
    await page.getByRole('heading', { name: 'Narration settings contract', exact: true }).waitFor();
    const id = new URL(page.url()).searchParams.get('adventure');
    const library = await page.evaluate(() => window.wails.Call.ByName('main.LibraryService.List'));
    const request = { schemaVersion: 4, epoch: library.epoch, adventureId: id };
    const call = (method, value = request) => page.evaluate(({ method, value }) => window.wails.Call.ByName(`main.LibraryService.${method}`, value), { method, value });
    const read = () => call('Read');
    const settings = () => call('ReadNarration');
    // Persist enough real history to catch reader/composer movement at nonzero scroll.
    const document = content => ({ schemaVersion: 1, type: 'doc', content: content.map(text => ({ type: 'paragraph', content: [{ type: 'text', text }] })) });
    await call('Commit', { ...request, operationId: crypto.randomUUID(), expectedVersion: 0, kind: 'append_story_turn', turn: {
      schemaVersion: 1, id: crypto.randomUUID(), order: 1, events: [], passages: [
        { id: crypto.randomUUID(), source: 'authored', body: document(['A long harbour watch.']) },
        { id: crypto.randomUUID(), source: 'generated', body: document(Array.from({ length: 40 }, (_, index) => `Harbour watch ${index + 1}. The lantern crossed the quay without a sound.`)) }
      ]
    } });
    const before = await read();
    const connections = await call('ReadConnections', { schemaVersion: 4, epoch: library.epoch });
    const profile = { id: 'narration-fixture', name: 'Simulated narration protocol', kind: 'custom', baseUrl: `http://127.0.0.1:${server.address().port}/v1`, model: 'fixture', timeoutMs: 10000 };
    await call('SaveConnections', { schemaVersion: 4, epoch: library.epoch, expectedRevision: connections.revision, mode: 'local', activeProfileId: profile.id, profiles: [...connections.profiles.filter(value => value.id !== profile.id), profile] });
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('.composer-heading').getByText('Simulated narration protocol · fixture', { exact: true }).waitFor();
    const loadedFonts = await page.evaluate(async () =>
    {
      const faces = await Promise.all(['400 21px "Cormorant Garamond"', '400 14px "IBM Plex Sans"', 'italic 400 14px "IBM Plex Sans"', '400 10px "IBM Plex Mono"'].map(font => document.fonts.load(font)));
      await document.fonts.ready;
      return faces.every(group => group.length > 0 && group.every(face => face.status === 'loaded'));
    });
    assert.equal(loadedFonts, true, 'Reference serif, UI/italic and technical fonts load from bundled assets');
    const retainedDraft = Array.from({ length: 7 }, () => 'A harbour lantern passed silently beyond the narrow quay.').join(' ');
    await page.getByLabel('Story input', { exact: true }).fill(retainedDraft);
    await page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
    let releaseFonts;
    let fontsStarted;
    const fontsRequested = new Promise(resolve => fontsStarted = resolve);
    const delayedFonts = new Promise(resolve => releaseFonts = resolve);
    await page.route('**/fonts/*.ttf', async route =>
    {
      fontsStarted();
      await delayedFonts;
      await route.continue();
    });
    try
    {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await fontsRequested;
      // Distinct fallback metrics keep the swap observable on different CI fonts.
      await page.addStyleTag({ content: '#story-input { font-family: "Cormorant Garamond", monospace; }' });
      await page.setViewportSize({ width: 1440, height: 1400 });
      await page.waitForFunction(text => document.querySelector('#story-input')?.value === text, retainedDraft);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const fallbackHeight = await page.getByLabel('Story input', { exact: true }).evaluate(element => element.clientHeight);
      releaseFonts();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(height =>
      {
        const field = document.querySelector('#story-input');
        return field.clientHeight !== height && field.scrollHeight <= field.clientHeight + 1;
      }, fallbackHeight);
      assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), retainedDraft, 'Font swap remeasures the restored draft without an input event or text loss');
    }
    finally
    {
      releaseFonts();
      await page.unroute('**/fonts/*.ttf');
    }
    await page.getByLabel('Story input', { exact: true }).fill('Retain the lantern input.');

    async function openStyle(target = page)
    {
      await target.getByRole('button', { name: 'Narration style', exact: true }).click();
      await target.getByLabel('Perspective', { exact: true }).waitFor();
      await target.waitForFunction(() => !document.querySelector('#narration-style-panel fieldset')?.disabled);
      await target.waitForFunction(() => document.activeElement?.id === 'narration-perspective');
    }
    async function storyView()
    {
      const story = page.getByRole('button', { name: 'Story', exact: true });
      if (await story.isVisible()) await story.click();
    }
    const save = async () =>
    {
      await page.getByRole('button', { name: 'Save narration settings', exact: true }).click();
      await page.getByRole('region', { name: 'Narration style', exact: true }).waitFor({ state: 'detached' });
    };
    async function fillStyle()
    {
      await page.getByLabel('Perspective', { exact: true }).selectOption('third');
      await page.getByLabel('Tense', { exact: true }).selectOption('past');
      await page.getByLabel('Genre', { exact: true }).fill('Harbour mystery');
      await page.getByLabel('Tone', { exact: true }).fill('Quietly ominous');
      await page.getByLabel('Pacing', { exact: true }).selectOption('slow');
      await page.getByLabel('Response length', { exact: true }).selectOption('brief');
      await page.getByLabel('Custom style instructions', { exact: true }).fill('Keep the lantern mysterious.\nUse concrete sounds.');
    }
    const anchor = () => page.evaluate(() =>
    {
      const box = selector =>
      {
        const { x, y, width, height } = document.querySelector(selector).getBoundingClientRect();
        return { x, y, width, height };
      };
      return { input: box('#story-input'), toggle: box('.narration-toggle'), reader: box('.reader'), scroll: document.querySelector('.story-scroll').scrollTop };
    });
    for (const theme of ['dark', 'bright'])
    {
      await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
      for (const width of [390, 768, 1024, 1440])
      {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await page.locator('.story-scroll').evaluate(element => element.scrollTop = 200);
        const beforeOpen = await anchor();
        if (artifacts && theme === 'dark' && [390, 1440].includes(width)) await page.screenshot({ path: path.join(artifacts, `${capturePrefix}-closed-${width}.png`) });
        await openStyle();
        assert.deepEqual(await anchor(), beforeOpen, 'Opening style preserves input, toolbar, story geometry and scroll position without corrective scrolling');
        await fillStyle();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        assert.equal(await page.getByRole('region', { name: 'Narration style', exact: true }).evaluate(element => element.scrollWidth <= element.clientWidth && element.scrollHeight <= element.clientHeight + 1), true);
        const geometry = await page.evaluate(() =>
        {
          const panel = document.querySelector('#narration-style-panel');
          const shelf = panel.getBoundingClientRect();
          const toggle = document.querySelector('.narration-toggle').getBoundingClientRect();
          const input = document.querySelector('#story-input').getBoundingClientRect();
          const actions = document.querySelector('.shelf-actions').getBoundingClientRect();
          const fields = [...panel.querySelectorAll('.style-grid > div')];
          const separated = fields.every(field =>
          {
            const label = field.querySelector('label').getBoundingClientRect();
            const control = field.querySelector('input,select').getBoundingClientRect();
            return label.bottom + 5 <= control.top;
          });
          const noInnerScroll = ['#narration-style-panel form', '#narration-style-panel fieldset', '.composer', '#narration-instructions', '#story-input'].every(selector =>
          {
            const element = document.querySelector(selector);
            return element.scrollHeight <= element.clientHeight + 1 && getComputedStyle(element).overflowY !== 'scroll';
          });
          const heading = document.querySelector('.composer-heading');
          const mode = heading.querySelector('.mode-selected').getBoundingClientRect();
          const source = heading.querySelector('.model-source').getBoundingClientRect();
          const checkbox = document.querySelector('.stream-option input').getBoundingClientRect();
          const stream = document.querySelector('.stream-option').getBoundingClientRect();
          const main = document.querySelector('.story-scroll');
          const mainBox = main.getBoundingClientRect();
          const workspace = document.querySelector('.workspace').getBoundingClientRect();
          const rail = document.querySelector('.context-rail').getBoundingClientRect();
          const reader = document.querySelector('.reader');
          const fullHeightScroll = mainBox.top === workspace.top && mainBox.bottom === workspace.bottom
            && getComputedStyle(main).paddingRight === '0px' && getComputedStyle(main).scrollbarGutter === 'stable'
            && getComputedStyle(reader).overflowY === 'visible' && main.scrollHeight > main.clientHeight
            && (innerWidth < 1024 || mainBox.right === rail.left);
          const attached = panel.closest('.composer') === document.querySelector('.composer')
            && !main.contains(panel) && getComputedStyle(panel).backgroundColor === 'rgba(0, 0, 0, 0)'
            && getComputedStyle(panel).borderBottomWidth === '0px';
          return { attached, fullHeightScroll, inputVisible: input.top >= mainBox.top && input.bottom <= mainBox.bottom, aboveInput: shelf.bottom <= input.top, nearInput: toggle.bottom <= input.top && input.top - toggle.bottom < 100,
            actionsSeparated: actions.top >= panel.querySelector('fieldset').getBoundingClientRect().bottom + 8,
            fieldsSeparated: separated, noInnerScroll, toolbarSeparated: mode.right + 8 <= source.left && source.right + 8 <= toggle.left,
            checkboxAligned: checkbox.top >= stream.top && checkbox.bottom <= stream.bottom };
        });
        assert.deepEqual(geometry, { attached: true, fullHeightScroll: true, inputVisible: true, aboveInput: true, nearInput: true, actionsSeparated: true, fieldsSeparated: true, noInnerScroll: true, toolbarSeparated: true, checkboxAligned: true });
        const fixedSettings = await page.locator('#narration-style-panel').boundingBox();
        const fixedInput = await page.getByLabel('Story input', { exact: true }).boundingBox();
        await page.locator('.story-scroll').evaluate(element => element.scrollTop += 100);
        assert.deepEqual(await page.locator('#narration-style-panel').boundingBox(), fixedSettings, 'Story scrolling cannot move the attached narration block');
        assert.deepEqual(await page.getByLabel('Story input', { exact: true }).boundingBox(), fixedInput);
        await page.locator('.story-scroll').evaluate(element => element.scrollTop = 200);
        assert.equal(await page.getByRole('dialog').count(), 0, 'Narration controls expand inline');
        assert.equal(await page.getByRole('button', { name: 'Narration style', exact: true }).getAttribute('aria-expanded'), 'true');
        if (artifacts) await page.screenshot({ path: path.join(artifacts, `${capturePrefix}-${theme}-${width}.png`) });
        if (width === 390)
        {
          await page.getByLabel('Custom style instructions', { exact: true }).focus();
          await page.getByLabel('Custom style instructions', { exact: true }).scrollIntoViewIfNeeded();
          const visible = await page.evaluate(() =>
          {
            const field = document.querySelector('#narration-instructions').getBoundingClientRect();
            const body = document.querySelector('#narration-style-panel fieldset').getBoundingClientRect();
            const actions = document.querySelector('.shelf-actions').getBoundingClientRect();
            return field.top >= body.top && field.bottom <= body.bottom && field.bottom < actions.top;
          });
          assert.equal(visible, true, 'Focused instruction field must be fully visible above the nonoverlapping action footer');
          if (artifacts) await page.screenshot({ path: path.join(artifacts, `${capturePrefix}-focus-${theme}-${width}.png`) });
        }
        await page.getByRole('button', { name: 'Narration style', exact: true }).click();
        assert.deepEqual(await anchor(), beforeOpen, 'Closing style also preserves the view');
      }
    }
    await page.setViewportSize({ width: 390, height: 600 });
    await page.locator('.story-scroll').evaluate(element => element.scrollTop = 200);
    const shortAnchor = await anchor();
    await openStyle();
    assert.deepEqual(await anchor(), shortAnchor, 'Short-screen expansion keeps the input docked and story still');
    assert.equal(await page.locator('#narration-style-panel').evaluate(element => element.scrollHeight > element.clientHeight), true, 'Only narration gains scrolling when a short window needs it');
    for (const selector of ['#narration-perspective', '#narration-tense', '#narration-genre', '#narration-tone', '#narration-pacing', '#narration-length', '#narration-instructions', '.shelf-actions button[type=submit]'])
    {
      await page.locator(selector).focus();
      await page.locator('#narration-style-panel').evaluate((panel, selector) =>
      {
        const field = document.querySelector(selector).getBoundingClientRect();
        const bounds = panel.getBoundingClientRect();
        if (field.bottom > bounds.bottom) panel.scrollTop += field.bottom - bounds.bottom;
        else if (field.top < bounds.top) panel.scrollTop += field.top - bounds.top;
      }, selector);
      const field = await page.locator(selector).boundingBox();
      const panel = await page.locator('#narration-style-panel').boundingBox();
      assert.ok(field.y >= panel.y - 1 && field.y + field.height <= panel.y + panel.height + 1, 'Every style control is reachable through narration-only scrolling');
      assert.deepEqual(await anchor(), shortAnchor, 'Scrolling the settings never moves the input, toolbar or story');
    }
    if (artifacts) await page.screenshot({ path: path.join(artifacts, `${capturePrefix}-short-390.png`) });
    assert.equal(await page.locator('.composer').evaluate(element => element.scrollHeight <= element.clientHeight + 1), true, 'The fixed input block never acquires a scrollbar');
    await page.getByLabel('Story input', { exact: true }).scrollIntoViewIfNeeded();
    assert.equal(await page.getByLabel('Story input', { exact: true }).isVisible(), true);
    await page.getByRole('button', { name: 'Narration style', exact: true }).click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await openStyle();
    await fillStyle();
    const instructions = page.getByLabel('Custom style instructions', { exact: true });
    await instructions.fill(Array.from({ length: 32 }, (_, index) => `Writing direction line ${index + 1}.`).join('\n'));
    await page.waitForFunction(() =>
    {
      const field = document.querySelector('#narration-instructions');
      const style = getComputedStyle(field);
      const caret = field.getBoundingClientRect().bottom - parseFloat(style.paddingBottom) - parseFloat(style.borderBottomWidth) - parseFloat(style.lineHeight) / 2;
      const panel = field.closest('#narration-style-panel').getBoundingClientRect();
      return field.clientHeight > 500 && field.scrollHeight <= field.clientHeight + 1 && caret >= panel.top && caret <= panel.bottom;
    });
    if (artifacts) await page.screenshot({ path: path.join(artifacts, `${capturePrefix}-long-instructions-1440.png`) });
    await instructions.fill('Keep the lantern mysterious.\nUse concrete sounds.');
    const oversizedDraft = [...Array.from({ length: 79 }, (_, index) => `Player prose line ${index + 1}.`), 'The final wrapped line stays readable beside the Send button. '.repeat(8)].join('\n');
    await page.getByLabel('Story input', { exact: true }).fill(oversizedDraft);
    const waitForInputOverflow = () => page.waitForFunction(() =>
    {
      const field = document.querySelector('#story-input');
      return field.scrollHeight > field.clientHeight + 1;
    });
    const waitForInputFit = () => page.waitForFunction(() =>
    {
      const field = document.querySelector('#story-input');
      return field.scrollHeight <= field.clientHeight + 1;
    });
    await waitForInputOverflow();
    await page.evaluate(() => document.documentElement.dataset.loreboundUi = 'dark');
    for (const [width, height] of [[1440, 900], [390, 600], [390, 320]])
    {
      await page.setViewportSize({ width, height });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(await page.locator('.composer').evaluate(composer =>
      {
        const bounds = composer.getBoundingClientRect();
        const main = composer.closest('main').getBoundingClientRect();
        const field = composer.querySelector('#story-input');
        return bounds.top >= main.top && bounds.bottom <= main.bottom + 1
          && composer.scrollHeight <= composer.clientHeight + 1
          && field.scrollHeight > field.clientHeight + 1
          && field.offsetHeight <= Math.min(240, Math.max(80, main.height * .4)) + 1;
      }), true, 'Long drafts scroll inside the capped textarea while the whole composer fits');
      const anchor = () => page.evaluate(() =>
      {
        const bounds = selector =>
        {
          const { x, y, width, height } = document.querySelector(selector).getBoundingClientRect();
          return { x, y, width, height };
        };
        return { input: bounds('#story-input'), toolbar: bounds('.composer-heading'), story: document.querySelector('.story-scroll').scrollTop, composer: document.querySelector('.composer').scrollTop };
      });
      assert.equal(await page.getByLabel('Story input', { exact: true }).evaluate(field =>
      {
        const style = getComputedStyle(field);
        const send = field.closest('.composer-input').querySelector('.send');
        return parseFloat(style.paddingRight) >= send.offsetWidth + parseFloat(getComputedStyle(send).right) + 8;
      }), true, 'Wrapped text reserves horizontal space beside the fixed Send button during native scrolling');
      const beforeInputScroll = await anchor();
      await page.getByLabel('Story input', { exact: true }).press('Control+Home');
      await page.waitForFunction(() =>
      {
        const field = document.querySelector('#story-input');
        const style = getComputedStyle(field);
        return field.selectionStart === 0 && field.scrollTop <= parseFloat(style.paddingTop) + parseFloat(style.lineHeight) / 2;
      });
      if (artifacts && height !== 320) await page.screenshot({ path: path.join(artifacts, `${capturePrefix}-oversized-start-${width}.png`) });
      await page.getByLabel('Story input', { exact: true }).press('Control+End');
      const waitForLastLine = () => page.waitForFunction(() =>
      {
        const field = document.querySelector('#story-input');
        const style = getComputedStyle(field);
        const lastLineCenter = field.scrollHeight - parseFloat(style.paddingBottom) - parseFloat(style.lineHeight) / 2;
        return lastLineCenter >= field.scrollTop && lastLineCenter - field.scrollTop <= field.clientHeight;
      });
      await waitForLastLine();
      await page.getByLabel('Story input', { exact: true }).press('Enter');
      await waitForLastLine();
      await page.getByLabel('Story input', { exact: true }).press('Backspace');
      await waitForLastLine();
      if (width === 390 && height === 600)
      {
        await page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
        let releaseSave;
        let saveStarted;
        const started = new Promise(resolve => saveStarted = resolve);
        const held = new Promise(resolve => releaseSave = resolve);
        await page.route('**/wails/runtime', async route =>
        {
          if (route.request().postDataJSON()?.args?.methodName !== 'main.LibraryService.SaveDraft') return route.continue();
          const response = await route.fetch();
          saveStarted();
          await held;
          await route.fulfill({ response });
        });
        try
        {
          await page.getByLabel('Story input', { exact: true }).press('Space');
          await started;
          await page.getByLabel('Story input', { exact: true }).evaluate(field => field.scrollTop = 0);
          releaseSave();
          await page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          assert.equal(await page.getByLabel('Story input', { exact: true }).evaluate(field => field.scrollTop), 0, 'A draft-save status update preserves manual textarea scrolling');
        }
        finally
        {
          releaseSave();
          await page.unroute('**/wails/runtime');
        }
        await page.getByLabel('Story input', { exact: true }).press('Control+End');
        await page.getByLabel('Story input', { exact: true }).press('Backspace');
        await waitForLastLine();
      }
      const send = await page.getByRole('button', { name: 'Generate continuation', exact: true }).boundingBox();
      const composer = await page.locator('.composer').boundingBox();
      assert.ok(send.y >= composer.y && send.y + send.height <= composer.y + composer.height, 'Send stays visible without scrolling the composer');
      assert.deepEqual(await anchor(), beforeInputScroll, 'Textarea navigation and typing cannot move the input, toolbar, composer or story');
      assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), oversizedDraft);
      if (artifacts && height !== 320) await page.screenshot({ path: path.join(artifacts, `${capturePrefix}-oversized-end-${width}.png`) });
    }
    await page.getByRole('button', { name: 'Narration style', exact: true }).click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.locator('.composer').evaluate(element => element.scrollTop = 0);
    await page.getByRole('button', { name: 'Narration style', exact: true }).focus();
    const cappedInput = await page.getByLabel('Story input', { exact: true }).boundingBox();
    await openStyle();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.deepEqual(await page.getByLabel('Story input', { exact: true }).boundingBox(), cappedInput, 'Expansion preserves capped input geometry including fractional font metrics');
    await page.getByRole('button', { name: 'Narration style', exact: true }).click();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.deepEqual(await page.getByLabel('Story input', { exact: true }).boundingBox(), cappedInput);
    await page.setViewportSize({ width: 390, height: 600 });
    await page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
    await page.reload({ waitUntil: 'networkidle' });
    await waitForInputOverflow();
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), oversizedDraft);
    const capped = await page.locator('.composer').evaluate(composer =>
    {
      const input = composer.querySelector('#story-input');
      return input.offsetHeight <= 240 && input.scrollHeight > input.clientHeight + 1
        && composer.scrollHeight <= composer.clientHeight + 1;
    });
    assert.equal(capped, true, 'A reopened long draft retains its full text in a capped native textarea without scrolling the composer');
    if (artifacts) await page.screenshot({ path: path.join(artifacts, `${capturePrefix}-oversized-reopen-390.png`) });
    await page.getByLabel('Story input', { exact: true }).fill('Retain the lantern input.');
    await waitForInputFit();
    await page.setViewportSize({ width: 1440, height: 900 });
    await openStyle();
    await fillStyle();
    await page.getByLabel('Story input', { exact: true }).press('Control+Enter');
    assert.equal(requests.length, 0, 'Unsaved shelf edits cannot silently generate with older settings');
    assert.equal(await page.getByRole('button', { name: 'Generate continuation', exact: true }).isDisabled(), true);
    await save();
    const saved = await settings();
    assert.equal(saved.revision, 1);
    assert.deepEqual(await read(), before, 'Style saves do not change accepted history/version');
    assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), 'Retain the lantern input.');
    await page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
    await page.reload({ waitUntil: 'networkidle' });
    await openStyle();
    assert.equal(await page.getByLabel('Genre', { exact: true }).inputValue(), 'Harbour mystery');
    assert.equal(await page.getByLabel('Custom style instructions', { exact: true }).inputValue(), saved.style.instructions);
    await page.getByLabel('Tone', { exact: true }).fill('Unsaved tone discarded by Escape');
    await page.keyboard.press('Escape');
    await page.getByRole('region', { name: 'Narration style', exact: true }).waitFor({ state: 'detached' });
    assert.equal(await page.getByRole('button', { name: 'Narration style', exact: true }).evaluate(element => document.activeElement === element), true, 'Escape restores focus');
    assert.deepEqual(await settings(), saved, 'Escape discards unsaved preferences');
    await openStyle();
    await page.getByRole('button', { name: 'Narration style', exact: true }).click();
    await page.getByRole('region', { name: 'Narration style', exact: true }).waitFor({ state: 'detached' });
    assert.equal(await page.getByRole('button', { name: 'Narration style', exact: true }).getAttribute('aria-expanded'), 'false');
    await storyView();
    await page.getByLabel('Story input', { exact: true }).fill(oversizedDraft);
    await waitForInputOverflow();
    await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    await page.getByRole('region', { name: 'Proposed turn', exact: true }).waitFor();
    for (const width of [390, 1440])
    {
      await page.setViewportSize({ width, height: 600 });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      for (const name of ['Accept turn', 'Retry', 'Discard'])
      {
        const button = await page.getByRole('button', { name, exact: true }).boundingBox();
        const composer = await page.locator('.composer').boundingBox();
        assert.ok(button.y >= composer.y && button.y + button.height <= composer.y + composer.height, 'Pending actions are visible without scrolling after oversized generation');
      }
      assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), oversizedDraft, 'Compact pending controls preserve the full draft');
      assert.equal(await page.getByLabel('Story input', { exact: true }).evaluate(element => element.offsetHeight <= 147), true);
      if (artifacts) await page.screenshot({ path: path.join(artifacts, `${capturePrefix}-oversized-pending-${width}.png`) });
    }
    await page.getByRole('button', { name: 'Discard', exact: true }).click();
    await waitForInputOverflow();
    assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), oversizedDraft);
    assert.deepEqual(await read(), before, 'Oversized proposal/discard does not change canon');
    await page.getByLabel('Story input', { exact: true }).fill('Retain the lantern input.');
    await waitForInputFit();
    await page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
    await page.setViewportSize({ width: 1440, height: 900 });
    if (layoutOnly)
    {
      assert.deepEqual(errors, []);
      console.log('PASS: Chromium narration layout, fixed attached expansion/story-only edge scrollbar, conditional narration overflow, field/toolbar spacing, capped native textarea scrolling, growing textareas and saved settings');
      return;
    }

    const generate = () => page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
    const proposal = page.getByRole('region', { name: 'Proposed turn', exact: true });
    await generate();
    await proposal.waitFor();
    const prompt = requests.at(-1).messages[0].content;
    assert.match(prompt, /Perspective: third person\.\nTense: past\.\nGenre: Harbour mystery\nTone: Quietly ominous\nPacing: slow\.\nDesired response length: brief/);
    assert.ok(prompt.endsWith(saved.style.instructions), 'Full custom guidance sent');
    await page.locator('.generation-inspector summary').click();
    assert.equal(await page.locator('.generation-inspector pre').innerText(), prompt.split('\n\n')[1]);
    for (const theme of ['dark', 'bright'])
    {
      await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
      for (const width of [390, 768, 1024, 1440])
      {
        await page.setViewportSize({ width, height: 900 });
        await page.locator('.generation-inspector pre').scrollIntoViewIfNeeded();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        if (artifacts) await page.screenshot({ path: path.join(artifacts, `${capturePrefix}-details-${theme}-${width}.png`) });
      }
    }
    await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
    await page.waitForFunction(() => document.querySelectorAll('.accepted-turn').length === 2);
    const accepted = await read();

    // A stale form cannot silently overwrite a newer tab's current preferences.
    const other = await context.newPage();
    await other.goto(page.url(), { waitUntil: 'networkidle' });
    await openStyle();
    await openStyle(other);
    await other.getByLabel('Tone', { exact: true }).fill('Warm and hopeful');
    await other.getByRole('button', { name: 'Save narration settings', exact: true }).click();
    await other.getByRole('region', { name: 'Narration style', exact: true }).waitFor({ state: 'detached' });
    await page.getByLabel('Tone', { exact: true }).fill('Stale form');
    await page.getByRole('button', { name: 'Save narration settings', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'changed elsewhere' }).waitFor();
    assert.equal(await page.getByLabel('Tone', { exact: true }).inputValue(), 'Stale form');
    await page.getByRole('button', { name: 'Reload settings', exact: true }).click();
    await page.getByLabel('Tone', { exact: true }).filter({ visible: true }).waitFor();
    await page.waitForFunction(() => document.querySelector('#narration-tone')?.value === 'Warm and hopeful');
    await page.getByLabel('Tense', { exact: true }).selectOption('present');
    // Drop the reply after the real save; the identical retry resolves the saved value.
    let dropped = false;
    await page.route('**/wails/runtime', async route =>
    {
      if (!dropped && route.request().postDataJSON()?.args?.methodName === 'main.LibraryService.SaveNarration')
      {
        dropped = true;
        await route.fetch();
        await route.abort('failed');
        return;
      }
      await route.continue();
    });
    await page.getByRole('button', { name: 'Save narration settings', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'could not be confirmed' }).waitFor();
    assert.equal(dropped, true);
    const uncertain = await settings();
    await save();
    await page.unroute('**/wails/runtime');
    assert.deepEqual(await settings(), uncertain, 'Uncertain-save retry adds no extra revision');
    assert.deepEqual(await read(), accepted);
    await other.close();
    await storyView();

    // Read failure blocks provider submission and retains the composer.
    await page.getByLabel('Story input', { exact: true }).fill('Keep after settings failure.');
    await page.route('**/wails/runtime', async route =>
    {
      if (route.request().postDataJSON()?.args?.methodName === 'main.LibraryService.ReadNarration') await route.abort('failed');
      else await route.continue();
    });
    const requestCount = requests.length;
    await generate();
    await page.getByRole('alert').filter({ hasText: 'no model request was sent' }).waitFor();
    assert.equal(requests.length, requestCount);
    assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), 'Keep after settings failure.');
    assert.deepEqual(await read(), accepted);
    await page.unroute('**/wails/runtime');

    // Stop while the settings read is pending must prevent a late provider request.
    let releaseRead;
    let readStarted;
    const waitingRead = new Promise(resolve => readStarted = resolve);
    const continueRead = new Promise(resolve => releaseRead = resolve);
    await page.route('**/wails/runtime', async route =>
    {
      if (route.request().postDataJSON()?.args?.methodName === 'main.LibraryService.ReadNarration')
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
    assert.equal(requests.length, requestCount, 'Late settings reads cannot start a stopped generation');
    assert.deepEqual(await read(), accepted);

    // Each attempt reads current saved settings, including Retry without a workspace reload.
    await generate();
    await proposal.waitFor();
    assert.match(requests.at(-1).messages[0].content, /Tense: present\./);
    assert.match(requests.at(-1).messages[0].content, /Tone: Warm and hopeful/);
    let current = await settings();
    await call('SaveNarration', { ...request, expectedRevision: current.revision, style: { ...current.style, tone: 'New direction for Retry' } });
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await proposal.waitFor();
    assert.match(requests.at(-1).messages[0].content, /Tone: New direction for Retry/);
    await page.getByRole('button', { name: 'Discard', exact: true }).click();
    await page.getByLabel('Stream output', { exact: false }).check();
    await generate();
    await page.getByRole('region', { name: 'Generating proposal', exact: true }).getByText('Simulated styled preview.', { exact: true }).waitFor();
    current = await settings();
    await call('SaveNarration', { ...request, expectedRevision: current.revision, style: { ...current.style, tone: 'Changed during stream' } });
    await page.locator('.generation-inspector summary').click();
    assert.match(await page.locator('.generation-inspector pre').innerText(), /Tone: New direction for Retry/);
    await page.getByRole('button', { name: 'Stop generation', exact: true }).click();
    release();
    assert.deepEqual(await read(), accepted, 'Settings changes and stopped streams preserve canon');
    assert.equal(await page.getByLabel('Story input', { exact: true }).inputValue(), 'Keep after settings failure.');

    // Simulate a replacement library with the same adventure ID while a form is open.
    // Responses change identity; the real host rejects the translated obsolete save.
    await openStyle();
    await page.getByLabel('Tone', { exact: true }).fill('Retained old-library form');
    const beforeReplacement = await settings();
    let submittedEpoch = '';
    await page.route('**/wails/runtime', async route =>
    {
      const payload = route.request().postDataJSON();
      const method = payload?.args?.methodName;
      if (method === 'main.LibraryService.List' || method === 'main.LibraryService.Read')
      {
        const body = method.endsWith('.Read')
          ? { ...payload, args: { ...payload.args, args: [{ ...payload.args.args[0], epoch: library.epoch }] } }
          : payload;
        const response = await route.fetch({ postData: body });
        const value = await response.json();
        value.epoch = 'replacement-library-fixture';
        if (value.adventure) value.adventure.title = 'Replacement library fixture';
        await route.fulfill({ response, json: value });
        return;
      }
      if (method === 'main.LibraryService.SaveNarration')
      {
        submittedEpoch = payload.args.args[0].epoch;
        const response = await route.fetch({ postData: { ...payload, args: { ...payload.args, args: [{ ...payload.args.args[0], epoch: 'obsolete-library-fixture' }] } } });
        await route.fulfill({ response });
        return;
      }
      await route.continue();
    });
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await page.getByRole('heading', { name: 'Replacement library fixture', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Save narration settings', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'The library changed' }).waitFor();
    assert.equal(submittedEpoch, library.epoch, 'Retained form must not borrow a replacement library epoch');
    assert.equal(await page.getByLabel('Tone', { exact: true }).inputValue(), 'Retained old-library form');
    await page.unroute('**/wails/runtime');
    assert.deepEqual(await settings(), beforeReplacement);
    assert.deepEqual(await read(), accepted);
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.reload({ waitUntil: 'networkidle' });
    assert.deepEqual(errors, []);
    console.log('PASS: inline composer narration shelf, fixed attached expansion/story-only edge scrollbar, no control overlaps, conditional narration overflow, capped native textarea scrolling, growing textareas, toggle/Escape/focus, saved-only generation, pinned library identity, persistence/conflicts/lost replies and Retry/Stop');
  }
  finally
  {
    release();
    await context.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
