import assert from 'node:assert/strict';
import path from 'node:path';

export async function exerciseDrafts(page, base, artifacts, adventureId)
{
  await page.goto(`${base}/?adventure=${adventureId}`, { waitUntil: 'networkidle' });
  const input = page.getByLabel('Story input');
  const saved = () => page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
  const canonical = () => page.evaluate(async id =>
  {
    const library = await window.wails.Call.ByName('main.LibraryService.List');
    return window.wails.Call.ByName('main.LibraryService.Read', { schemaVersion: 4, epoch: library.epoch, adventureId: id });
  }, adventureId);
  const before = await canonical();
  const text = 'An unfinished scene. 🦉\n\n<script>window.draftInjected = true</script>';
  await input.fill(text);
  await saved();
  assert.deepEqual(await canonical(), before, 'Autosave never changes accepted history');
  await page.reload({ waitUntil: 'networkidle' });
  await saved();
  assert.equal(await input.inputValue(), text);
  assert.equal(await page.evaluate(() => window.draftInjected), undefined);

  const other = await page.context().newPage();
  try
  {
    await other.goto(page.url(), { waitUntil: 'networkidle' });
    await other.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
    assert.equal(await other.getByLabel('Story input').inputValue(), text);
    await other.getByLabel('Story input').fill('Latest successful save from another tab.');
    await other.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await page.waitForFunction(() => document.querySelector('#story-input').value === 'Latest successful save from another tab.');
    assert.equal(await page.getByRole('alert').count(), 0);
  }
  finally
  {
    await other.close();
  }

  let dropped = false;
  await page.route('**/wails/runtime', async route =>
  {
    if (!dropped && route.request().postDataJSON()?.args?.methodName === 'main.LibraryService.SaveDraft')
    {
      dropped = true;
      await route.fetch();
      await route.abort('failed');
      return;
    }
    await route.continue();
  });
  await input.fill('A draft whose success reply is lost.');
  await page.getByRole('button', { name: 'Retry draft', exact: true }).waitFor();
  assert.equal(dropped, true);
  assert.match(await page.getByRole('status', { name: 'Draft status' }).innerText(), /unconfirmed/);
  assert.equal(await input.inputValue(), 'A draft whose success reply is lost.');
  await page.unroute('**/wails/runtime');
  await page.getByRole('button', { name: 'Retry draft', exact: true }).focus();
  await page.keyboard.press('Enter');
  await saved();

  await page.route('**/wails/runtime', async route =>
  {
    if (route.request().postDataJSON()?.args?.methodName === 'main.LibraryService.ReadDraft')
      await route.abort('failed');
    else await route.continue();
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Retry draft', exact: true }).waitFor();
  assert.match(await page.getByRole('status', { name: 'Draft status' }).innerText(), /could not be loaded/);
  await page.unroute('**/wails/runtime');
  await page.getByRole('button', { name: 'Retry draft', exact: true }).click();
  await saved();
  assert.equal(await input.inputValue(), 'A draft whose success reply is lost.');

  await input.fill('');
  await saved();
  await page.reload({ waitUntil: 'networkidle' });
  await saved();
  assert.equal(await input.inputValue(), '', 'Clearing input replaces the saved draft with empty input');

  await input.fill('Persist this unfinished Story input through a host restart. 🦉');
  await saved();
  for (const theme of ['dark', 'bright'])
  {
    await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
    for (const width of [390, 768, 1024, 1440])
    {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      const status = await page.getByRole('status', { name: 'Draft status' }).boundingBox();
      assert.ok(status && status.y >= 0 && status.y + status.height <= 900);
      if (artifacts) await page.screenshot({ path: path.join(artifacts, `story-draft-${theme}-${width}.png`), fullPage: true });
    }
  }
  assert.deepEqual(await canonical(), before);
  console.log('PASS: real SQLite draft autosave/reload, shared latest value, focus restore, lost-response recovery, empty replacement and responsive draft feedback; canon unchanged');
}
