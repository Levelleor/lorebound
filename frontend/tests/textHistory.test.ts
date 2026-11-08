import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TextHistory } from '../src/lib/textHistory.ts';

const cursor = { start: 1, end: 1, direction: 'none' as const };

test('temporary text history bounds depth and total retained text, including redo', () =>
{
  const history = new TextHistory('Initial');
  for (let index = 1; index <= 60; index++) history.record(`Edit ${index}`, cursor);
  for (let index = 59; index >= 10; index--) assert.equal(history.move('undo')?.text, `Edit ${index}`);
  assert.equal(history.move('undo'), null);
  assert.equal(history.move('redo')?.text, 'Edit 11');
  history.record('A new direction', cursor);
  assert.equal(history.move('redo'), null);
  assert.equal(history.move('undo')?.text, 'Edit 11');

  const large = new TextHistory('x'.repeat(20000));
  for (let index = 1; index <= 40; index++) large.record(String(index).padEnd(20000, 'x'), cursor);
  let available = 0;
  while (large.move('undo')) available++;
  assert.equal(available, 24);
  large.record('x'.repeat(500001), cursor);
  assert.equal(large.canUndo, false);
  assert.equal(large.canRedo, false);
});

test('temporary text history preserves detached selections, paragraph and Unicode text', () =>
{
  const history = new TextHistory('One 🦉\n\nTwo');
  const selection = { start: 4, end: 6, direction: 'backward' as const };
  history.select(selection);
  selection.start = 0;
  history.record('One bird\n\nTwo', cursor);
  const undone = history.move('undo')!;
  assert.equal(undone.text, 'One 🦉\n\nTwo');
  assert.deepEqual(undone.selection, { start: 4, end: 6, direction: 'backward' });
  undone.selection.start = 0;
  history.move('redo');
  assert.equal(history.move('undo')?.selection.start, 4);
});
