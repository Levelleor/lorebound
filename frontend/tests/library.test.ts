import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prepareCreate, readLibrary, readSnapshot, readCreateResult } from '../src/lib/library.ts';

test('blank creation prepares only stable identity and empty baseline, no fictional defaults', () => {
  assert.deepEqual(prepareCreate('epoch', '  ', 'adventure', 'operation'), {
    schemaVersion: 3, epoch: 'epoch', operationId: 'operation', adventureId: 'adventure',
    title: 'Untitled Adventure', baseline: { schemaVersion: 1 }
  });
  assert.equal(prepareCreate('epoch', '  A winter road  ', 'a', 'o').title, 'A winter road');
  assert.throws(() => prepareCreate('e', 'x'.repeat(161), 'a', 'o'), /title_too_long/);
});

test('unsupported or malformed host results fail closed instead of appearing saved', () => {
  for (const result of [null, {}, { schemaVersion: 2, epoch: 'e', adventures: [] }, { schemaVersion: 3, epoch: 'e', adventures: [{}] }]) {
    assert.throws(() => readLibrary(result), /unsupported_library_response/);
  }
  const snapshot = { schemaVersion: 3, epoch: 'e', adventure: { id: 'a', title: 'T', version: 0 }, baseline: { schemaVersion: 1 }, turns: [] };
  assert.deepEqual(readSnapshot(snapshot), snapshot);
  assert.throws(() => readSnapshot({ ...snapshot, baseline: { schemaVersion: 3 } }));
  assert.deepEqual(readCreateResult({ snapshot, replayed: true }), { snapshot, replayed: true });
  assert.throws(() => readCreateResult({ snapshot }));
});
