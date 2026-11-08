import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StoryCoordinator, type StoryStorage } from '../src/lib/coordinator.ts';
import { plainTextToDocument, documentToText, reconstruct, type Turn } from '../src/lib/story.ts';
import type { CommitRequest, CommitResult, Snapshot } from '../src/lib/library.ts';
import type { Draft, DraftStorage } from '../src/lib/draft.ts';

function fixture()
{
  const turns: Turn[] = [1, 2, 3].map(order => ({
    schemaVersion: 1, id: `turn-${order}`, order, events: [],
    passages: [
      { id: `authored-${order}`, source: 'authored', body: plainTextToDocument(`Authored ${order}`) },
      { id: `generated-${order}`, source: 'generated', body: plainTextToDocument(`Generated ${order}`) }
    ]
  }));
  let snapshot: Snapshot = { schemaVersion: 4, epoch: 'epoch', adventure: { id: 'story', title: 'Story', version: 3 }, baseline: { schemaVersion: 1 }, turns };
  let nextId = 0;
  let drop = false;
  let readFailure = false;
  let generates = 0;
  const writes: CommitRequest[] = [];
  const receipts = new Map<string, CommitResult>();
  const drafts = new Map<string, string>();
  const draftStorage: DraftStorage = {
    readDraft: async request => ({ ...request, text: drafts.get(request.target) ?? '', ...(request.target === 'composer_story' ? {} : { exists: drafts.has(request.target) }) }),
    saveDraft: async request =>
    {
      drafts.set(request.target, request.text);
      return { ...request, ...(request.target === 'composer_story' ? {} : { exists: true }) };
    },
    deleteDraft: async request => { if (drafts.get(request.target) === request.text) drafts.delete(request.target); }
  };
  const storage: StoryStorage = {
    list: async () => ({ schemaVersion: 4, epoch: snapshot.epoch, adventures: [snapshot.adventure] }),
    read: async () =>
    {
      if (readFailure) throw new Error('read_failed');
      return structuredClone(snapshot);
    },
    commit: async request =>
    {
      writes.push(structuredClone(request));
      if (request.epoch !== snapshot.epoch) throw new Error('wrong_epoch');
      const receipt = receipts.get(request.operationId);
      if (receipt) return { ...receipt, replayed: true };
      if (request.expectedVersion !== snapshot.adventure.version) throw new Error('stale_version');
      assert.ok(request.kind === 'edit_generated_passage' || request.kind === 'edit_authored_passage');
      if (request.kind !== 'edit_generated_passage' && request.kind !== 'edit_authored_passage') throw new Error('unexpected_operation');
      const index = snapshot.turns.findIndex(turn => turn.id === request.turnId);
      const updated = structuredClone(snapshot);
      const position = updated.turns[index].passages.findIndex(passage => passage.id === request.passageId);
      updated.turns[index].passages[position].body = structuredClone(request.body);
      if (request.later === 'truncate')
      {
        updated.turns.splice(index + 1);
        updated.turns[index].passages.splice(position + 1);
      }
      updated.adventure.version++;
      snapshot = updated;
      if (drafts.get(`passage:${request.passageId}`) === documentToText(request.body)) drafts.delete(`passage:${request.passageId}`);
      const result: CommitResult = { schemaVersion: 4, epoch: request.epoch, adventureId: request.adventureId, operationId: request.operationId, turnId: request.turnId, version: updated.adventure.version, replayed: false };
      receipts.set(request.operationId, result);
      if (drop) { drop = false; throw new Error('lost_response'); }
      return result;
    }
  };
  const coordinator = new StoryCoordinator(snapshot, { storage, draftStorage, generate: async () => { generates++; return 'Should not generate'; }, newId: () => `edit-${++nextId}` });
  return { coordinator, drafts, draftStorage, writes, head: () => snapshot, replace: (next: Snapshot) => { snapshot = next; }, drop: () => { drop = true; }, failRead: (value: boolean) => { readFailure = value; }, generates: () => generates };
}

async function ready(f: ReturnType<typeof fixture>, passageId = 'generated-1')
{
  await f.coordinator.draft?.restore();
  await f.coordinator.startEdit(passageId);
}

test('DEV-003H: authored/generated temporary edit history autosaves only its latest value and never commits', async () =>
{
  for (const source of ['authored', 'generated'])
  {
    const f = fixture();
    await ready(f, `${source}-1`);
    const before = structuredClone(f.head());
    const selection = { start: 1, end: 4, direction: 'backward' as const };
    f.coordinator.selectEditText(selection);
    f.coordinator.setEditText('A paragraph. 🦉\n\nAnother paragraph.');
    f.coordinator.setEditText('Changed again');
    assert.equal(f.coordinator.state.edit?.canUndo, true);
    f.coordinator.moveEditHistory('undo');
    assert.equal(f.coordinator.state.edit?.text, 'A paragraph. 🦉\n\nAnother paragraph.');
    assert.deepEqual(f.coordinator.moveEditHistory('undo'), selection);
    assert.equal(f.coordinator.state.edit?.text, `${source === 'authored' ? 'Authored' : 'Generated'} 1`);
    assert.equal(f.coordinator.moveEditHistory('undo'), null);
    f.coordinator.moveEditHistory('redo');
    await f.coordinator.editDraft?.flush();
    assert.equal(f.drafts.get(`passage:${source}-1`), 'A paragraph. 🦉\n\nAnother paragraph.');
    f.coordinator.reviewEdit();
    assert.equal(f.coordinator.moveEditHistory('undo'), null);
    f.coordinator.continueEditing();
    f.coordinator.moveEditHistory('undo');
    f.coordinator.setEditText('Replacement after Undo');
    assert.equal(f.coordinator.moveEditHistory('redo'), null);
    assert.deepEqual(f.head(), before);
    assert.equal(f.writes.length, 0);
    assert.equal(f.generates(), 0);
    await f.coordinator.discardEdit();
    await f.coordinator.startEdit(`${source}-1`);
    assert.equal(f.coordinator.state.edit?.canUndo, false);
    assert.equal(f.coordinator.state.edit?.canRedo, false);
    f.coordinator.dispose();
    assert.equal(f.coordinator.moveEditHistory('undo'), null);
  }
});

test('DEV-003H: one IME composition is one temporary edit; shared replacement resets history, equal restore preserves it', async () =>
{
  const f = fixture();
  await ready(f);
  const cursor = { start: 0, end: 0, direction: 'none' as const };
  f.coordinator.beginEditComposition(cursor);
  f.coordinator.setEditText('仮');
  f.coordinator.reviewEdit();
  assert.equal(f.coordinator.state.phase, 'editing');
  assert.equal(f.coordinator.moveEditHistory('undo'), null);
  assert.equal(f.coordinator.state.edit?.canUndo, false);
  f.coordinator.endEditComposition('確定', { ...cursor, start: 2, end: 2 });
  f.coordinator.moveEditHistory('undo');
  assert.equal(f.coordinator.state.edit?.text, 'Generated 1');
  f.coordinator.moveEditHistory('redo');
  await f.coordinator.editDraft?.flush();
  await f.coordinator.editDraft?.restore();
  assert.equal(f.coordinator.state.edit?.canUndo, true);
  f.drafts.set('passage:generated-1', 'A different shared draft');
  await f.coordinator.editDraft?.restore();
  assert.equal(f.coordinator.state.edit?.text, 'A different shared draft');
  assert.equal(f.coordinator.moveEditHistory('undo'), null);
  assert.equal(f.coordinator.moveEditHistory('redo'), null);
  f.coordinator.dispose();
});

test('DEV-003H: temporary edits cannot cross confirmation, uncertain recovery, conflict or a reopened target', async () =>
{
  const f = fixture();
  await ready(f);
  f.coordinator.setEditText('First draft');
  f.coordinator.setEditText('Latest draft');
  f.coordinator.reviewEdit();
  f.drop();
  await f.coordinator.confirmEdit('keep');
  assert.equal(f.coordinator.state.phase, 'uncertain');
  assert.equal(f.coordinator.moveEditHistory('undo'), null);
  assert.equal(f.coordinator.state.edit?.canUndo, false);
  await f.coordinator.retrySave();
  assert.deepEqual(f.writes[0], f.writes[1]);
  assert.equal(documentToText(f.head().turns[0].passages[1].body), 'Latest draft');
  await f.coordinator.startEdit('generated-1');
  assert.equal(f.coordinator.moveEditHistory('undo'), null);
  f.coordinator.setEditText('A stale draft');
  f.coordinator.reviewEdit();
  const changed = structuredClone(f.head());
  changed.adventure.version++;
  f.replace(changed);
  await f.coordinator.confirmEdit('keep');
  assert.equal(f.coordinator.state.phase, 'edit-conflict');
  assert.equal(f.coordinator.moveEditHistory('undo'), null);
  await f.coordinator.reconsiderEdit();
  assert.equal(f.coordinator.moveEditHistory('undo'), null);
  f.coordinator.setEditText('A fresh edit');
  f.coordinator.moveEditHistory('undo');
  assert.equal(f.coordinator.state.edit?.text, 'A stale draft');
  f.coordinator.dispose();
});

test('DEV-003F: inline draft, four decisions, exact Keep and Truncate, composer isolation and no AI', async () =>
{
  const f = fixture();
  const before = structuredClone(f.head());
  await f.coordinator.draft?.restore();
  f.coordinator.setInput('Unfinished input');
  await f.coordinator.startEdit('missing');
  assert.equal(f.coordinator.state.edit, null);
  await f.coordinator.startEdit('generated-1');
  assert.equal(f.coordinator.state.edit?.text, 'Generated 1');
  f.coordinator.setEditText('Reordered paragraphs.\n\nA line. 🦉');
  f.coordinator.setInput('Cannot overwrite input');
  await f.coordinator.generate();
  f.coordinator.requestUndo();
  assert.equal(f.coordinator.state.phase, 'editing');
  await f.coordinator.editDraft?.flush();
  assert.deepEqual(f.head(), before);
  assert.equal(f.drafts.get('passage:generated-1'), 'Reordered paragraphs.\n\nA line. 🦉');
  f.coordinator.reviewEdit();
  f.coordinator.continueEditing();
  assert.deepEqual(f.head(), before);
  f.coordinator.reviewEdit();
  await f.coordinator.confirmEdit('keep');
  assert.equal(f.coordinator.state.phase, 'idle');
  assert.equal(f.coordinator.state.input, 'Unfinished input');
  assert.deepEqual(f.head().turns.slice(1), before.turns.slice(1));
  assert.deepEqual(f.head().turns[0].passages[0], before.turns[0].passages[0]);
  assert.equal(f.head().turns[0].passages[1].id, 'generated-1');
  assert.equal(f.drafts.has('passage:generated-1'), false);
  await f.coordinator.startEdit('generated-2');
  f.coordinator.setEditText('Discard me');
  await f.coordinator.discardEdit();
  assert.equal(f.writes.length, 1);
  await f.coordinator.startEdit('generated-1');
  f.coordinator.setEditText('New future begins here.');
  f.coordinator.reviewEdit();
  await f.coordinator.confirmEdit('truncate');
  assert.equal(f.head().turns.length, 1);
  assert.equal(f.head().adventure.version, 5);
  assert.equal(f.generates(), 0);
  f.coordinator.dispose();
});

test('DEV-003F: lost edit reply and failed read recover identical request after newer canon', async () =>
{
  const f = fixture();
  await ready(f);
  f.coordinator.setEditText('Saved once');
  f.coordinator.reviewEdit();
  f.drop();
  await f.coordinator.confirmEdit('truncate');
  assert.equal(f.coordinator.state.phase, 'uncertain');
  f.coordinator.setEditText('Cannot alter uncertain request');
  await f.coordinator.discardEdit();
  await f.coordinator.confirmEdit('keep');
  assert.equal(f.writes.length, 1);
  const next = structuredClone(f.head());
  next.adventure.version++;
  next.turns[0].passages[1].body = plainTextToDocument('Later accepted replacement');
  f.replace(next);
  f.failRead(true);
  await f.coordinator.retrySave();
  assert.equal(f.coordinator.state.phase, 'uncertain');
  f.failRead(false);
  await f.coordinator.retrySave();
  assert.deepEqual(f.writes[0], f.writes[1]);
  assert.deepEqual(f.writes[0], f.writes[2]);
  assert.equal(documentToText(f.coordinator.state.snapshot.turns[0].passages[1].body), 'Later accepted replacement');
  assert.equal(f.coordinator.state.phase, 'idle');
  f.coordinator.dispose();
});

test('DEV-003F: stale conflict retains edit and blocks until a deliberate review, including failed refetch', async () =>
{
  const f = fixture();
  await ready(f);
  f.coordinator.setEditText('Retain this text');
  f.coordinator.reviewEdit();
  const changed = structuredClone(f.head());
  changed.adventure.version++;
  changed.turns[0].passages[1].body = plainTextToDocument('Another tab changed this passage');
  f.replace(changed);
  f.failRead(true);
  await f.coordinator.confirmEdit('truncate');
  assert.equal(f.coordinator.state.phase, 'edit-conflict');
  assert.equal(f.coordinator.state.edit?.text, 'Retain this text');
  f.coordinator.requestRefresh();
  f.coordinator.setInput('Blocked');
  await f.coordinator.generate();
  assert.equal(f.writes.length, 1);
  f.failRead(false);
  await f.coordinator.reconsiderEdit();
  assert.equal(f.coordinator.state.phase, 'editing');
  assert.deepEqual(f.coordinator.state.snapshot, changed);
  f.coordinator.reviewEdit();
  await f.coordinator.confirmEdit('keep');
  assert.equal(f.writes.length, 2);
  assert.notEqual(f.writes[0].operationId, f.writes[1].operationId);
  assert.equal(f.writes[1].expectedVersion, 4);
  f.coordinator.dispose();
});

test('DEV-003F: removed target and replaced library cannot silently recreate or migrate an edit', async () =>
{
  for (const epochChange of [false, true])
  {
    const f = fixture();
    await ready(f);
    f.coordinator.setEditText('Keep for copying');
    f.coordinator.reviewEdit();
    const changed = structuredClone(f.head());
    changed.adventure.version++;
    if (epochChange) changed.epoch = 'replacement';
    else changed.turns = [];
    f.replace(changed);
    await f.coordinator.confirmEdit('keep');
    await f.coordinator.reconsiderEdit();
    assert.equal(f.coordinator.state.phase, 'edit-conflict');
    assert.equal(f.coordinator.state.edit?.text, 'Keep for copying');
    assert.deepEqual(f.head(), changed);
    f.coordinator.closeConflictedEdit();
    assert.equal(f.coordinator.state.phase, 'blocked');
    f.coordinator.dispose();
  }
});

test('DEV-003F: delayed draft restore cannot change a reviewed edit; empty and max-version validation are visible', async () =>
{
  const f = fixture();
  await ready(f);
  let resolve!: (value: Draft) => void;
  f.draftStorage.readDraft = request => new Promise(yes => { resolve = yes; });
  const restore = f.coordinator.editDraft!.restore();
  f.coordinator.reviewEdit();
  resolve({ schemaVersion: 4, epoch: 'epoch', adventureId: 'story', target: 'passage:generated-1', text: 'Different shared draft', exists: true });
  await restore;
  assert.equal(f.coordinator.state.edit?.text, 'Generated 1');
  await f.coordinator.confirmEdit('keep');
  assert.equal(documentToText(f.head().turns[0].passages[1].body), 'Generated 1');
  f.coordinator.dispose();

  const limited = fixture();
  await ready(limited);
  limited.coordinator.setEditText('');
  limited.coordinator.reviewEdit();
  assert.equal(limited.coordinator.state.phase, 'editing');
  assert.match(limited.coordinator.state.error, /nonempty/);
  limited.coordinator.setEditText('Valid text');
  limited.coordinator.reviewEdit();
  limited.coordinator.state = { ...limited.coordinator.state, snapshot: { ...limited.coordinator.state.snapshot, adventure: { ...limited.coordinator.state.snapshot.adventure, version: Number.MAX_SAFE_INTEGER } } };
  await limited.coordinator.confirmEdit('keep');
  assert.match(limited.coordinator.state.error, /version limit/);
  assert.equal(limited.writes.length, 0);
  limited.coordinator.dispose();
});

test('DEV-003G: authored draft restores independently; Keep preserves its continuation and later turns', async () =>
{
  const f = fixture();
  const before = structuredClone(f.head());
  f.drafts.set('passage:authored-1', 'A restored player edit.\n\nAnother paragraph.');
  f.drafts.set('passage:generated-1', 'Separate continuation draft');
  await ready(f, 'authored-1');
  assert.equal(f.coordinator.state.edit?.text, 'A restored player edit.\n\nAnother paragraph.');
  f.coordinator.reviewEdit();
  f.coordinator.continueEditing();
  assert.deepEqual(f.head(), before);
  f.coordinator.reviewEdit();
  await f.coordinator.confirmEdit('keep');
  assert.equal(f.writes[0].kind, 'edit_authored_passage');
  assert.deepEqual(f.head().turns[0].passages[1], before.turns[0].passages[1]);
  assert.deepEqual(f.head().turns.slice(1), before.turns.slice(1));
  assert.equal(f.head().turns[0].passages[0].id, before.turns[0].passages[0].id);
  assert.equal(f.head().turns[0].passages[0].source, 'authored');
  assert.equal(f.drafts.has('passage:authored-1'), false);
  assert.equal(f.drafts.get('passage:generated-1'), 'Separate continuation draft');
  await f.coordinator.startEdit('authored-2');
  f.coordinator.setEditText('Discard this player edit');
  await f.coordinator.discardEdit();
  assert.equal(f.writes.length, 1);
  assert.equal(f.generates(), 0);
  f.coordinator.dispose();
});

test('DEV-003G: authored truncation retains one passage; lost reply recovers without deleting newer history', async () =>
{
  const f = fixture();
  await ready(f, 'authored-2');
  const before = structuredClone(f.head());
  f.coordinator.setEditText('The authored boundary survives.');
  f.coordinator.reviewEdit();
  f.drop();
  await f.coordinator.confirmEdit('truncate');
  assert.equal(f.coordinator.state.phase, 'uncertain');
  assert.deepEqual(f.head().turns[0], before.turns[0]);
  assert.equal(f.head().turns.length, 2);
  assert.equal(f.head().turns[1].passages.length, 1);
  assert.equal(f.head().turns[1].passages[0].id, 'authored-2');
  const newer = structuredClone(f.head());
  newer.adventure.version++;
  newer.turns.push(before.turns[2]);
  f.replace(newer);
  f.failRead(true);
  await f.coordinator.retrySave();
  assert.equal(f.coordinator.state.phase, 'uncertain');
  f.failRead(false);
  await f.coordinator.retrySave();
  assert.deepEqual(f.writes[0], f.writes[1]);
  assert.deepEqual(f.writes[0], f.writes[2]);
  assert.deepEqual(f.coordinator.state.snapshot, newer);
  await f.coordinator.startEdit('generated-2');
  assert.equal(f.coordinator.state.edit, null);
  await f.coordinator.startEdit('authored-2');
  assert.equal(f.coordinator.state.edit?.text, 'The authored boundary survives.');
  f.coordinator.dispose();
});

test('DEV-003G: stale authored truncation preserves same-turn continuation until a fresh decision', async () =>
{
  const f = fixture();
  await ready(f, 'authored-1');
  f.coordinator.setEditText('My retained player edit');
  f.coordinator.reviewEdit();
  const changed = structuredClone(f.head());
  changed.adventure.version++;
  changed.turns[0].passages[0].body = plainTextToDocument('Another accepted player edit');
  f.replace(changed);
  await f.coordinator.confirmEdit('truncate');
  assert.equal(f.coordinator.state.phase, 'edit-conflict');
  assert.deepEqual(f.head(), changed);
  assert.equal(f.coordinator.state.edit?.text, 'My retained player edit');
  await f.coordinator.reconsiderEdit();
  f.coordinator.reviewEdit();
  await f.coordinator.confirmEdit('keep');
  assert.equal(f.writes[1].expectedVersion, changed.adventure.version);
  assert.notEqual(f.writes[0].operationId, f.writes[1].operationId);
  assert.deepEqual(f.head().turns[0].passages[1], changed.turns[0].passages[1]);
  f.coordinator.dispose();
});

test('DEV-003G: replay supports authored-only turns and rejects empty, generated-only and malformed history', () =>
{
  const f = fixture();
  const snapshot = structuredClone(f.head());
  snapshot.turns[1].passages.splice(1);
  assert.deepEqual(reconstruct(snapshot).passages, snapshot.turns.flatMap(turn => turn.passages));
  for (const passages of [[], [snapshot.turns[0].passages[1]], [...snapshot.turns[0].passages, snapshot.turns[0].passages[0]]])
  {
    const invalid = structuredClone(snapshot);
    invalid.turns[1].passages = passages;
    assert.throws(() => reconstruct(invalid));
  }
  const duplicate = structuredClone(snapshot);
  duplicate.turns[1].passages[0].id = duplicate.turns[0].passages[0].id;
  assert.throws(() => reconstruct(duplicate));
  f.coordinator.dispose();
});
