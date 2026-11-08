import assert from 'node:assert/strict';
import path from 'node:path';

export async function exerciseEditHistory(page, artifacts, source)
{
  const editor = page.locator('#passage-edit');
  const undo = page.getByRole('button', { name: 'Undo edit', exact: true });
  const redo = page.getByRole('button', { name: 'Redo edit', exact: true });
  const original = await editor.inputValue();
  assert.equal(await undo.isDisabled(), true);
  assert.equal(await redo.isDisabled(), true);

  await editor.evaluate(element => element.setSelectionRange(0, 4, 'backward'));
  await page.keyboard.insertText('Replacement 🦉');
  const changed = await editor.inputValue();
  await undo.click();
  assert.equal(await editor.inputValue(), original);
  assert.deepEqual(await editor.evaluate(element => [element.selectionStart, element.selectionEnd, element.selectionDirection]), [0, 4, 'backward']);
  assert.equal(await editor.evaluate(element => element === document.activeElement), true);
  await page.keyboard.press('Control+Shift+z');
  assert.equal(await editor.inputValue(), changed);
  await page.keyboard.press('Control+z');
  await page.keyboard.press('Control+y');
  assert.equal(await editor.inputValue(), changed);
  await page.keyboard.press('Meta+z');
  assert.equal(await editor.inputValue(), original);
  await page.keyboard.press('Meta+Shift+z');
  assert.equal(await editor.inputValue(), changed);

  // Browser edit-menu input uses the same bounded history, including a noncancelable input fallback.
  await editor.evaluate(element => element.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, cancelable: true, inputType: 'historyUndo' })));
  assert.equal(await editor.inputValue(), original);
  await editor.evaluate(element =>
  {
    element.value = 'A native value outside the temporary history';
    element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'historyRedo' }));
  });
  assert.equal(await editor.inputValue(), changed);
  await undo.click();
  await page.keyboard.insertText('New direction');
  assert.equal(await redo.isDisabled(), true, 'New typing discards temporary redo');

  const beforeComposition = await editor.inputValue();
  await editor.evaluate(element =>
  {
    element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    for (const text of ['仮', '確定'])
    {
      element.value = text;
      element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertCompositionText', isComposing: true }));
    }
  });
  assert.equal(await undo.isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Review edit', exact: true }).isDisabled(), true);
  await editor.dispatchEvent('compositionend', { data: '確定' });
  await undo.click();
  assert.equal(await editor.inputValue(), beforeComposition, 'A composition undoes as one edit');
  await redo.click();
  assert.equal(await editor.inputValue(), '確定');
  await page.getByRole('status', { name: 'Passage draft status' }).getByText('Passage draft saved · Not accepted.', { exact: true }).waitFor();

  for (const theme of ['dark', 'bright'])
  {
    await page.evaluate(theme => document.documentElement.dataset.loreboundUi = theme, theme);
    for (const width of [390, 768, 1024, 1440])
    {
      await page.setViewportSize({ width, height: 900 });
      await undo.scrollIntoViewIfNeeded();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      const group = await page.getByRole('group', { name: 'Temporary passage edits' }).boundingBox();
      assert.ok(group && group.x >= 0 && group.x + group.width <= width);
      if (artifacts) await page.screenshot({ path: path.join(artifacts, `edit-history-${source}-${theme}-${width}.png`), fullPage: true });
    }
  }
  await page.evaluate(() => document.documentElement.dataset.loreboundUi = 'dark');
  await page.getByRole('button', { name: 'Review edit', exact: true }).click();
  assert.equal(await undo.isDisabled(), true);
  assert.equal(await redo.isDisabled(), true);
  await page.getByRole('button', { name: 'Continue Editing', exact: true }).click();
  await undo.click();
  assert.equal(await editor.inputValue(), beforeComposition, 'Continue Editing preserves temporary history');
}
