import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StoryCoordinator, type StoryStorage } from '../src/lib/coordinator.ts';
import { SessionSaveRecovery } from '../src/lib/saveRecovery.ts';
import { documentToText, plainTextToDocument, type Turn } from '../src/lib/story.ts';
import { schemaVersion, type CommitRequest, type CommitResult, type Snapshot } from '../src/lib/library.ts';
import type { DraftStorage } from '../src/lib/draft.ts';

function fixture()
{
  let snapshot: Snapshot = {
    schemaVersion, epoch: 'epoch', adventure: { id: 'story', title: 'Story', version: 3 }, baseline: { schemaVersion: 1 },
    turns: [1, 2, 3].map(order => ({
      schemaVersion: 1, id: `turn-${order}`, order, events: [], passages: [
        { id: `authored-${order}`, source: 'authored', body: plainTextToDocument(`Authored ${order}`) },
        { id: `generated-${order}`, source: 'generated', body: plainTextToDocument(`Generated ${order}`) }
      ]
    }))
  };
  const records = new Map<string, string>();
  let readError = false;
  let writeError = false;
  let clearError = false;
  const journal = new SessionSaveRecovery(() => ({
    getItem: key => { if (readError) throw new Error('unavailable'); return records.get(key) ?? null; },
    setItem: (key, value) => { if (writeError) throw new Error('quota'); records.set(key, value); },
    removeItem: key => { if (clearError) throw new Error('unavailable'); records.delete(key); }
  }));
  const writes: CommitRequest[] = [];
  const receipts = new Map<string, CommitResult>();
  let drop: 'before' | 'after' | null = 'after';
  let nextId = 0;
  let generations = 0;
  const storage: StoryStorage = {
    list: async () => ({ schemaVersion, epoch: snapshot.epoch, adventures: [snapshot.adventure] }),
    read: async () => structuredClone(snapshot),
    commit: async request =>
    {
      assert.deepEqual(journal.load(request.adventureId), request, 'Journal must precede canonical dispatch');
      writes.push(structuredClone(request));
      if (request.epoch !== snapshot.epoch) throw new Error('wrong_epoch');
      const receipt = receipts.get(request.operationId);
      if (receipt) return { ...receipt, replayed: true };
      if (drop === 'before') { drop = null; throw new Error('lost_request'); }
      if (request.expectedVersion !== snapshot.adventure.version) throw new Error('stale_version');
      if (request.kind === 'append_story_turn') snapshot.turns.push(structuredClone(request.turn));
      else if (request.kind === 'undo_story_turn') snapshot.turns.pop();
      else
      {
        const target = snapshot.turns.find(turn => turn.id === request.turnId)!;
        const index = target.passages.findIndex(passage => passage.id === request.passageId);
        target.passages[index].body = structuredClone(request.body);
        if (request.later === 'truncate')
        {
          snapshot.turns = snapshot.turns.slice(0, target.order);
          target.passages = target.passages.slice(0, index + 1);
        }
      }
      snapshot.adventure.version++;
      const result: CommitResult = {
        schemaVersion, epoch: request.epoch, adventureId: request.adventureId, operationId: request.operationId,
        turnId: request.kind === 'append_story_turn' ? request.turn.id : request.turnId,
        version: snapshot.adventure.version, replayed: false
      };
      receipts.set(request.operationId, result);
      if (drop === 'after') { drop = null; throw new Error('lost_response'); }
      return result;
    }
  };
  const open = (draftStorage?: DraftStorage) => new StoryCoordinator(structuredClone(snapshot), {
    storage, recoveryStorage: journal, draftStorage,
    generate: async () => { generations++; return 'Simulated continuation'; }, newId: () => `operation-${++nextId}`
  });
  return {
    open, journal, records, writes, storage, head: () => snapshot,
    replace: (next: Snapshot) => { snapshot = next; }, generations: () => generations,
    drop: (next: typeof drop) => { drop = next; },
    access: (read = false, write = false, clear = false) => { readError = read; writeError = write; clearError = clear; }
  };
}

async function prepare(coordinator: StoryCoordinator, kind: string, later: 'keep' | 'truncate' = 'keep')
{
  if (kind === 'append')
  {
    coordinator.setInput('The next direction. 🦉');
    await coordinator.generate();
    await coordinator.accept();
  }
  else if (kind === 'undo')
  {
    coordinator.requestUndo();
    await coordinator.confirmUndo();
  }
  else
  {
    await coordinator.startEdit(`${kind}-1`);
    coordinator.setEditText('A revised beginning. 🦉\n\nA second paragraph.');
    coordinator.reviewEdit();
    await coordinator.confirmEdit(later);
  }
}

test('DEV-003I: all confirmed Story save kinds survive reload before or after dispatch with identical requests', async () =>
{
  for (const drop of ['before', 'after'] as const)
  {
    for (const [kind, later] of [['append', 'keep'], ['undo', 'keep'], ['authored', 'keep'], ['authored', 'truncate'], ['generated', 'keep'], ['generated', 'truncate']] as const)
    {
      const f = fixture();
      f.drop(drop);
      const first = f.open();
      await prepare(first, kind, later);
      assert.equal(first.state.phase, 'uncertain');
      const request = structuredClone(f.journal.load('story'));
      first.dispose();
      const reloaded = f.open();
      assert.equal(reloaded.state.phase, 'uncertain');
      assert.equal(f.writes.length, 1, 'Loading never resubmits');
      assert.ok(reloaded.state.recovery?.summary);
      if (kind !== 'undo') assert.match(reloaded.state.recovery!.text, /🦉/);
      await reloaded.generate();
      await reloaded.startEdit('authored-1');
      reloaded.requestUndo();
      reloaded.discard();
      reloaded.requestRefresh();
      assert.equal(reloaded.state.phase, 'uncertain');
      await reloaded.retrySave();
      assert.equal(reloaded.state.phase, 'idle');
      assert.equal(f.head().adventure.version, 4, 'Exactly one logical mutation');
      assert.deepEqual(f.writes, [request, request]);
      assert.deepEqual(reloaded.state.snapshot, f.head());
      assert.equal(f.records.size, 0);
      assert.equal(f.generations(), kind === 'append' ? 1 : 0);
      reloaded.dispose();
      assert.equal(f.open().state.recovery, null);
    }
  }
});

test('DEV-003I: old receipt recovery shows newer canon and cannot resurrect a later-undone turn or delete new history', async () =>
{
  for (const kind of ['append', 'undo', 'authored', 'generated'])
  {
    const f = fixture();
    const first = f.open();
    await prepare(first, kind, 'truncate');
    first.dispose();
    const newer = structuredClone(f.head());
    if (kind === 'append') newer.turns.pop();
    else
    {
      const order = newer.turns.length + 1;
      newer.turns.push({ schemaVersion: 1, id: 'new-turn', order, events: [], passages: [
        { id: 'new-authored', source: 'authored', body: plainTextToDocument('New accepted history') }
      ] });
    }
    newer.adventure.version++;
    f.replace(newer);
    const reloaded = f.open();
    await reloaded.retrySave();
    assert.equal(reloaded.state.phase, 'idle');
    assert.deepEqual(reloaded.state.snapshot, newer);
    assert.deepEqual(f.head(), newer);
    assert.equal(f.records.size, 0);
    reloaded.dispose();
  }
});

test('DEV-003I: stale or wrong-epoch reload recovery clears only a definitive rejection, retains text and requires a fresh action', async () =>
{
  for (const epoch of [false, true])
  {
    const f = fixture();
    f.drop('before');
    const first = f.open();
    await prepare(first, 'authored', 'truncate');
    first.dispose();
    const newer = structuredClone(f.head());
    if (epoch) newer.epoch = 'other-library';
    else newer.adventure.version++;
    f.replace(newer);
    const reloaded = f.open();
    await reloaded.retrySave();
    assert.equal(f.records.size, 0);
    assert.deepEqual(f.head(), newer);
    assert.match(reloaded.state.error, /changed/);
    assert.match(reloaded.state.recovery!.text, /revised beginning/);
    assert.equal(f.writes[1].epoch, 'epoch');
    assert.equal(f.writes[1].expectedVersion, 3);
    await reloaded.retrySave();
    assert.equal(f.writes.length, 2, 'Rejected operations never automatically rebase');
    reloaded.dispose();
  }
});

test('DEV-003I: session storage read/write/cleanup failures block safely and can recover', async () =>
{
  const f = fixture();
  f.access(true);
  const coordinator = f.open();
  assert.equal(coordinator.state.phase, 'recovery-blocked');
  await coordinator.refresh();
  await coordinator.generate();
  assert.equal(coordinator.state.phase, 'recovery-blocked');
  f.access();
  coordinator.restoreSave();
  f.access(false, true);
  await prepare(coordinator, 'append');
  assert.equal(coordinator.state.phase, 'uncertain');
  assert.equal(f.writes.length, 0, 'No canonical dispatch without a saved recovery request');
  f.access(false, false, true);
  f.drop(null);
  await coordinator.retrySave();
  assert.equal(f.head().adventure.version, 4);
  assert.equal(coordinator.state.phase, 'uncertain');
  assert.equal(f.records.size, 1, 'Cleanup must complete before a new save is allowed');
  const request = structuredClone(f.writes[0]);
  coordinator.dispose();
  f.access();
  const reloaded = f.open();
  await reloaded.retrySave();
  assert.equal(reloaded.state.phase, 'idle');
  assert.equal(f.head().adventure.version, 4);
  assert.deepEqual(f.writes[1], request);
  assert.equal(f.records.size, 0);
  reloaded.dispose();
});

test('DEV-003I: provisional candidates and unconfirmed edits never enter the recovery journal', async () =>
{
  const f = fixture();
  const coordinator = f.open();
  coordinator.setInput('Draft input');
  await coordinator.generate();
  assert.equal(f.records.size, 0);
  coordinator.discard();
  await coordinator.startEdit('generated-1');
  coordinator.setEditText('Unconfirmed draft');
  coordinator.reviewEdit();
  assert.equal(f.records.size, 0);
  coordinator.dispose();
  const reloaded = f.open();
  assert.equal(reloaded.state.phase, 'idle');
  assert.equal(reloaded.state.candidate, null);
  assert.equal(reloaded.state.edit, null);
  reloaded.dispose();
});

test('DEV-003I: recovery restores a newer SQLite input draft without autosaving reconstructed stale input', async () =>
{
  const f = fixture();
  const first = f.open();
  await prepare(first, 'append');
  first.dispose();
  const reads: string[] = [];
  const draftStorage: DraftStorage = {
    readDraft: async request => { reads.push(request.target); return { ...request, text: 'A newer shared input draft' }; },
    saveDraft: async () => { throw new Error('Recovery must not autosave reconstructed input'); }
  };
  const reloaded = f.open(draftStorage);
  assert.deepEqual(reads, [], 'Draft restore waits for original-operation recovery');
  await reloaded.retrySave();
  assert.equal(reloaded.state.phase, 'idle');
  assert.equal(reloaded.state.input, 'A newer shared input draft');
  assert.deepEqual(reads, ['composer_story']);
  reloaded.dispose();
});

test('DEV-003I: failed or inconsistent post-recovery reads keep the original journal for another reload', async () =>
{
  const f = fixture();
  const first = f.open();
  await prepare(first, 'generated', 'truncate');
  first.dispose();
  const read = f.storage.read;
  f.storage.read = async () => { throw new Error('unavailable'); };
  let reloaded = f.open();
  await reloaded.retrySave();
  assert.equal(reloaded.state.phase, 'uncertain');
  assert.ok(f.journal.load('story'));
  reloaded.dispose();
  f.storage.read = async () =>
  {
    const wrong = structuredClone(f.head());
    wrong.turns[0].passages[1].body = plainTextToDocument('An inconsistent read');
    return wrong;
  };
  reloaded = f.open();
  await reloaded.retrySave();
  assert.equal(reloaded.state.phase, 'uncertain');
  assert.ok(f.journal.load('story'));
  assert.equal(f.head().adventure.version, 4);
  f.storage.read = read;
  await reloaded.retrySave();
  assert.equal(reloaded.state.phase, 'idle');
  assert.equal(f.head().adventure.version, 4);
  assert.equal(f.records.size, 0);
  reloaded.dispose();
});

test('DEV-003I: disposal during an in-flight Commit leaves its journal for explicit reload recovery', async () =>
{
  const f = fixture();
  f.drop(null);
  const commit = f.storage.commit;
  let release: (result: CommitResult) => void;
  let entered: () => void;
  const started = new Promise<void>(resolve => { entered = resolve; });
  const result = new Promise<CommitResult>(resolve => { release = resolve; });
  let committed: CommitResult;
  f.storage.commit = async request =>
  {
    committed = await commit(request);
    entered();
    return result;
  };
  const first = f.open();
  const saving = prepare(first, 'undo');
  await started;
  first.dispose();
  release!(committed!);
  await saving;
  assert.ok(f.journal.load('story'), 'A late success cannot clear the disposed session journal');
  f.storage.commit = commit;
  const reloaded = f.open();
  await reloaded.retrySave();
  assert.equal(reloaded.state.phase, 'idle');
  assert.equal(f.head().adventure.version, 4);
  assert.equal(f.records.size, 0);
  reloaded.dispose();
});

test('DEV-003I: malformed/incompatible/foreign recovery records fail closed and cannot overwrite another unresolved request', async () =>
{
  const f = fixture();
  const first = f.open();
  await prepare(first, 'append');
  first.dispose();
  const original = f.records.values().next().value!;
  const key = f.records.keys().next().value!;
  const record = JSON.parse(original);
  const invalid = [
    'bad json', JSON.stringify({ ...record, version: 2 }),
    JSON.stringify({ ...record, request: { ...record.request, adventureId: 'other' } }),
    JSON.stringify({ ...record, request: { ...record.request, schemaVersion: 999 } }),
    JSON.stringify({ ...record, request: { ...record.request, unexpected: true } }),
    JSON.stringify({ ...record, request: { ...record.request, expectedVersion: -1 } })
  ];
  const edit = {
    schemaVersion, epoch: 'epoch', operationId: 'edit', adventureId: 'story', expectedVersion: 3,
    kind: 'edit_authored_passage', turnId: 'turn-1', passageId: 'authored-1', body: plainTextToDocument('An edit')
  };
  for (const later of [['keep'], ['truncate'], null, 0, {}, 'other'])
  {
    invalid.push(JSON.stringify({ version: 1, request: { ...edit, later } }));
  }
  for (const encoded of invalid)
  {
    f.records.set(key, encoded);
    const blocked = f.open();
    assert.equal(blocked.state.phase, 'recovery-blocked');
    await blocked.retrySave();
    assert.equal(f.writes.length, 1, 'Malformed requests are never dispatched');
    assert.equal(f.records.get(key), encoded, 'Invalid data is retained for diagnosis, never dispatched or erased');
    blocked.dispose();
  }
  f.records.set(key, original);
  const request = f.journal.load('story')!;
  assert.equal(f.journal.load('other'), null);
  assert.throws(() => f.journal.save({ ...request, operationId: 'different' }), /conflict/);
  assert.throws(() => f.journal.clear({ ...request, operationId: 'different' }), /conflict/);
  assert.deepEqual(f.journal.load('story'), request);
  const turn = (request as { turn: Turn }).turn;
  assert.equal(documentToText(turn.passages[0].body), 'The next direction. 🦉');
});
