import { test } from 'node:test';
import assert from 'node:assert/strict';
import { InputHistory } from '../src/lib/inputHistory.ts';

test('IDEA-0004/R06: temporary input history exhausts and a fresh edit removes redo', () =>
{
  const history = new InputHistory();
  history.reset('Recovered draft');
  history.edit('A new paragraph.\n\n🦉');
  history.edit('');
  assert.equal(history.undo()?.text, 'A new paragraph.\n\n🦉');
  assert.equal(history.undo()?.text, 'Recovered draft');
  assert.equal(history.undo(), null);
  assert.equal(history.redo()?.text, 'A new paragraph.\n\n🦉');
  history.edit('A different direction');
  assert.equal(history.redo(), null);
  assert.equal(history.undo()?.text, 'A new paragraph.\n\n🦉');
});

test('IDEA-0004/R06: at most 50 edits are available and older text cannot be recovered', () =>
{
  const history = new InputHistory();
  for (let i = 1; i <= 75; ++i) history.edit(`Edit ${i}`);
  for (let i = 74; i >= 25; --i) assert.equal(history.undo()?.text, `Edit ${i}`);
  assert.equal(history.undo(), null);
  for (let i = 26; i <= 75; ++i) assert.equal(history.redo()?.text, `Edit ${i}`);
  assert.equal(history.redo(), null);
});

test('IDEA-0004/R06: retained text also has a size budget; oversized input stays available', () =>
{
  const history = new InputHistory();
  for (let i = 0; i < 30; ++i) history.edit(`${i}${'🦉'.repeat(19998)}`);
  let depth = 0;
  while (history.undo()) ++depth;
  assert.equal(depth, 11);
  history.edit('x'.repeat(500001));
  assert.equal(history.undo(), null);
  history.edit('Short input');
  assert.equal(history.undo(), null, 'An oversized previous value is not retained');
});

test('IDEA-0004/R06: restore selection, group IME changes, and reset both directions', () =>
{
  const history = new InputHistory();
  history.reset('An owl');
  history.select({ start: 3, end: 6, direction: 'backward' });
  history.edit('An 猫', { start: 4, end: 4, direction: 'none' });
  history.edit('An 猫頭鷹', { start: 6, end: 6, direction: 'none' }, true);
  const undone = history.undo();
  assert.deepEqual(undone, { text: 'An owl', selection: { start: 3, end: 6, direction: 'backward' } });
  undone!.selection.start = 0;
  assert.equal(history.redo()?.text, 'An 猫頭鷹');
  assert.equal(history.undo()?.selection.start, 3, 'Returned selection cannot mutate stored history');
  history.reset('Latest shared draft');
  assert.equal(history.undo(), null);
  assert.equal(history.redo(), null);
  history.edit('Latest shared draft');
  assert.equal(history.canUndo, false, 'Repeated identical input adds no edit');
});
