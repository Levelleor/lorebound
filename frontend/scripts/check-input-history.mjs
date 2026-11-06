import assert from 'node:assert/strict';
import path from 'node:path';

export async function exerciseInputHistory(page, base, artifacts, adventureId)
{
  await page.goto(`${base}/?adventure=${adventureId}`, { waitUntil: 'networkidle' });
  const input = page.getByLabel('Story input');
  const undo = page.getByRole('button', { name: 'Undo input edit', exact: true });
  const redo = page.getByRole('button', { name: 'Redo input edit', exact: true });
  const saved = () => page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
  const canonical = () => page.evaluate(async id =>
  {
    const library = await window.wails.Call.ByName('main.LibraryService.List');
    return window.wails.Call.ByName('main.LibraryService.Read', { schemaVersion: 2, epoch: library.epoch, adventureId: id });
  }, adventureId);
  await saved();
  const before = await canonical();
  assert.equal(await undo.isDisabled(), true, 'Restored input has no temporary history');
  assert.equal(await redo.isDisabled(), true);

  await input.fill('First input');
  await input.fill('Second input.\n\n🦉 <script>window.historyInjected = true</script>');
  await page.keyboard.press('Control+z');
  assert.equal(await input.inputValue(), 'First input');
  await page.keyboard.press('Control+Shift+z');
  assert.match(await input.inputValue(), /Second input/);
  await undo.click();
  assert.equal(await input.inputValue(), 'First input');
  assert.equal(await input.evaluate(element => element === document.activeElement), true);
  await redo.click();
  assert.match(await input.inputValue(), /Second input/);
  await page.keyboard.press('Control+z');
  await page.keyboard.press('Control+y');
  assert.match(await input.inputValue(), /Second input/);
  await undo.click();
  await input.fill('New input after Undo');
  assert.equal(await redo.isDisabled(), true, 'A new edit abandons redo');

  await input.fill('An owl');
  await input.evaluate(element => element.setSelectionRange(3, 6, 'backward'));
  await page.keyboard.insertText('fox');
  assert.equal(await input.inputValue(), 'An fox');
  await page.keyboard.press('Control+z');
  assert.equal(await input.inputValue(), 'An owl');
  assert.deepEqual(await input.evaluate(element => [element.selectionStart, element.selectionEnd]), [3, 6]);

  // Synthetic composition events test grouping without claiming an OS IME run.
  await input.evaluate(element =>
  {
    element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    for (const text of ['An 猫', 'An 猫頭鷹'])
    {
      element.value = text;
      element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertCompositionText', isComposing: true }));
    }
    element.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
  });
  await page.keyboard.press('Control+z');
  assert.equal(await input.inputValue(), 'An owl', 'A composition is one temporary edit');

  for (let i = 1; i <= 55; ++i) await input.fill(`Bounded edit ${i}`);
  for (let i = 0; i < 50; ++i) await page.keyboard.press('Control+z');
  assert.equal(await input.inputValue(), 'Bounded edit 5');
  assert.equal(await undo.isDisabled(), true);
  await page.keyboard.press('Control+z');
  assert.equal(await input.inputValue(), 'Bounded edit 5');
  // Exercise the fallback used when a browser's native menu input cannot be cancelled.
  await input.evaluate(element =>
  {
    element.value = 'Native history must not cross the boundary';
    element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'historyUndo' }));
  });
  await page.waitForFunction(() => document.querySelector('#story-input').value === 'Bounded edit 5');
  await saved();
  assert.deepEqual(await canonical(), before, 'Temporary Undo cannot roll back accepted history');
  await page.reload({ waitUntil: 'networkidle' });
  await saved();
  assert.equal(await input.inputValue(), 'Bounded edit 5', 'Undo result is the latest real SQLite draft');
  assert.equal(await undo.isDisabled(), true);
  assert.equal(await redo.isDisabled(), true, 'Reload does not restore edit history');

  await input.fill('An input edit before the final version.');
  await input.fill('Only this final input should be accepted.');
  for (const theme of ['dark', 'bright'])
  {
    await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
    for (const width of [390, 768, 1024, 1440])
    {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      const controls = await page.getByRole('group', { name: 'Temporary input history' }).boundingBox();
      assert.ok(controls && controls.y >= 0 && controls.y + controls.height <= 900);
      assert.equal(await undo.isEnabled(), true);
      if (artifacts) await page.screenshot({ path: path.join(artifacts, `input-history-${theme}-${width}.png`), fullPage: true });
    }
  }
  await page.evaluate(() => document.documentElement.dataset.loreboundUi = 'dark');
  await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
  await page.getByRole('button', { name: 'Accept turn', exact: true }).waitFor();
  assert.equal(await undo.isDisabled(), true);
  assert.equal(await redo.isDisabled(), true);
  await page.getByRole('button', { name: 'Discard', exact: true }).click();
  assert.equal(await input.inputValue(), 'Only this final input should be accepted.');
  await page.keyboard.press('Control+z');
  assert.equal(await input.inputValue(), 'Only this final input should be accepted.', 'Generation ends the temporary editing lifetime');
  await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
  await page.getByRole('button', { name: 'Accept turn', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('#story-input')?.value === '' && !document.querySelector('#story-input')?.disabled);
  await input.focus();
  await page.keyboard.press('Control+z');
  assert.equal(await input.inputValue(), '', 'Accepted input cannot reappear through native Undo');
  const after = await canonical();
  assert.equal(after.adventure.version, before.adventure.version + 1);
  assert.deepEqual(after.turns.slice(0, -1), before.turns);
  assert.equal(after.turns.at(-1).passages[0].body.content[0].content[0].text, 'Only this final input should be accepted.');
  assert.equal(await page.evaluate(() => window.historyInjected), undefined);
  console.log('PASS: real browser input Undo/Redo, selection, bounded exhaustion, native-history fencing, SQLite draft reload, generation/acceptance boundaries and four-width Dark/Bright controls; synthetic IME grouping');
}
