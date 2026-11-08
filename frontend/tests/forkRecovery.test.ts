import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ForkController, type ForkRequest, type ForkResult, type ForkStorage } from '../src/lib/fork.ts';
import { SessionForkRecovery } from '../src/lib/forkRecovery.ts';
import { schemaVersion, type Snapshot } from '../src/lib/library.ts';
import { plainTextToDocument } from '../src/lib/story.ts';

function fixture()
{
  let source: Snapshot = {
    schemaVersion, epoch: 'epoch', adventure: { id: 'source', title: 'Original 🦉', version: 3 }, baseline: { schemaVersion: 1 },
    turns: [1, 2, 3].map(order => ({
      schemaVersion: 1, id: `turn-${order}`, order, events: [], passages: [
        { id: `authored-${order}`, source: 'authored', body: plainTextToDocument(`Authored ${order}`) },
        { id: `generated-${order}`, source: 'generated', body: plainTextToDocument(`Generated ${order}`) }
      ]
    }))
  };
  const records = new Map<string, string>();
  let access = '';
  const journal = new SessionForkRecovery(() => ({
    getItem: key => { if (access === 'read') throw new Error('unavailable'); return records.get(key) ?? null; },
    setItem: (key, value) => { if (access === 'write') throw new Error('quota'); if (access !== 'write-silent') records.set(key, value); },
    removeItem: key => { if (access === 'clear') throw new Error('unavailable'); if (access !== 'clear-silent') records.delete(key); }
  }));
  const requests: ForkRequest[] = [];
  let destination: Snapshot | null = null;
  let receipt: ForkResult | null = null;
  let drop = 'after';
  let readFailure = false;
  let ids = 0;
  const storage: ForkStorage = {
    fork: async request =>
    {
      assert.deepEqual(journal.load(request.sourceAdventureId)?.request, request, 'Journal precedes every dispatch');
      requests.push(structuredClone(request));
      if (request.epoch !== source.epoch) throw new Error('wrong_epoch');
      if (!receipt)
      {
        if (drop === 'before') { drop = ''; throw new Error('lost_request'); }
        if (request.expectedVersion !== source.adventure.version) throw new Error('stale_version');
        const boundary = source.turns.find(turn => turn.id === request.turnId)!;
        destination = {
          ...structuredClone(source),
          adventure: { id: request.adventureId, title: request.title, version: boundary.order },
          turns: structuredClone(source.turns.slice(0, boundary.order))
        };
        receipt = {
          schemaVersion, epoch: request.epoch, operationId: request.operationId, adventureId: request.adventureId,
          turnId: request.turnId, version: boundary.order, replayed: false
        };
      }
      if (drop === 'after') { drop = ''; throw new Error('lost_response'); }
      return { ...receipt, replayed: true };
    },
    read: async () =>
    {
      if (readFailure) throw new Error('read_failed');
      return structuredClone(destination!);
    }
  };
  const open = () =>
  {
    const controller = new ForkController(source, storage, () => {}, () => `id-${++ids}`, journal);
    controller.restore();
    return controller;
  };
  return {
    open, journal, records, requests, storage, source: () => source, destination: () => destination,
    replaceSource: (value: Snapshot) => source = value,
    replaceDestination: (value: Snapshot) => destination = value,
    access: (value: string) => access = value, drop: (value: string) => drop = value,
    failRead: (value: boolean) => readFailure = value
  };
}

test('DEV-003J: reload explicitly recovers the original Fork before/after dispatch without another destination', async () =>
{
  for (const drop of ['before', 'after'])
  {
    const f = fixture();
    f.drop(drop);
    const first = f.open();
    assert.equal(await first.submit('turn-2', 'Fork 🦉'), null);
    first.dispose();
    const reloaded = f.open();
    assert.equal(reloaded.state.phase, 'uncertain');
    assert.equal(f.requests.length, 1, 'Reload does not automatically send');
    const destination = await reloaded.submit('turn-1', 'Changed');
    assert.equal(destination?.adventure.title, 'Fork 🦉');
    assert.equal(destination?.turns.length, 2);
    assert.deepEqual(f.requests[1], f.requests[0]);
    assert.equal(f.records.size, 0);
    assert.equal(f.open().state.phase, 'editing');
    assert.equal(f.source().turns.length, 3);
  }
});

test('DEV-003J: original receipt survives removed source boundary and opens current destination after its own Undo', async () =>
{
  const f = fixture();
  await f.open().submit('turn-2', 'Independent future');
  f.replaceSource({ ...f.source(), adventure: { ...f.source().adventure, version: 5 }, turns: [] });
  f.replaceDestination({ ...f.destination()!, adventure: { ...f.destination()!.adventure, version: 4 }, turns: [] });
  const reloaded = f.open();
  assert.equal(reloaded.state.turnOrder, 2);
  assert.equal(reloaded.state.turnId, 'turn-2');
  const destination = await reloaded.submit('missing', 'Not a fresh fork');
  assert.equal(destination?.turns.length, 0);
  assert.equal(destination?.adventure.version, 4);
  assert.deepEqual(f.requests[1], f.requests[0]);
  assert.equal(f.source().turns.length, 0);
});

test('DEV-003J: stale or wrong-epoch recovery clears only a definitive rejection and requires fresh choice', async () =>
{
  for (const reason of ['stale', 'epoch'])
  {
    const f = fixture();
    f.drop('before');
    await f.open().submit('turn-2', 'Fork');
    f.replaceSource({ ...f.source(), epoch: reason === 'epoch' ? 'new-epoch' : 'epoch', adventure: { ...f.source().adventure, version: 4 } });
    const reloaded = f.open();
    assert.equal(await reloaded.submit('turn-1', 'Fresh'), null);
    assert.equal(reloaded.state.phase, 'rejected');
    assert.equal(f.records.size, 0);
    assert.equal(f.destination(), null);
    assert.equal(await reloaded.submit('turn-1', 'Fresh'), null);
    assert.equal(f.requests.length, 2);
    assert.deepEqual(f.requests[1], f.requests[0]);
  }
});

test('DEV-003J: journal access/write/readback and cleanup failures block without unsafe dispatch or replacement', async () =>
{
  for (const failure of ['read', 'write', 'write-silent'])
  {
    const f = fixture();
    const controller = f.open();
    f.access(failure);
    await controller.submit('turn-2', 'Fork');
    assert.equal(controller.state.phase, 'blocked');
    assert.equal(f.requests.length, 0);
    assert.equal(await controller.submit('turn-1', 'Another'), null);
    f.access('');
    controller.restore();
    f.drop('');
    assert.ok(await controller.submit('turn-1', 'Another'));
    assert.equal(f.requests[0].turnId, 'turn-2');
  }
  for (const failure of ['clear', 'clear-silent'])
  {
    const f = fixture();
    f.drop('');
    f.access(failure);
    const controller = f.open();
    assert.equal(await controller.submit('turn-2', 'Fork'), null);
    assert.equal(controller.state.phase, 'blocked');
    assert.equal(f.records.size, 1);
    assert.equal(await controller.submit('turn-1', 'Another'), null);
    f.access('');
    controller.restore();
    assert.ok(await controller.submit('turn-1', 'Another'));
    assert.deepEqual(f.requests[1], f.requests[0]);
    assert.equal(f.records.size, 0);
  }
});

test('DEV-003J: failed or inconsistent destination read keeps immutable recovery across repeated reloads', async () =>
{
  const f = fixture();
  await f.open().submit('turn-2', 'Fork');
  f.failRead(true);
  assert.equal(await f.open().submit('turn-1', 'Changed'), null);
  assert.equal(f.records.size, 1);
  f.failRead(false);
  const original = f.destination()!;
  f.replaceDestination({ ...original, adventure: { ...original.adventure, id: 'wrong' } });
  assert.equal(await f.open().submit('turn-1', 'Changed'), null);
  f.replaceDestination(original);
  assert.ok(await f.open().submit('turn-1', 'Changed'));
  for (const request of f.requests) assert.deepEqual(request, f.requests[0]);
});

test('DEV-003J: restored receipt still checks destination boundary identity after source truncation', async () =>
{
  const f = fixture();
  await f.open().submit('turn-2', 'Fork');
  f.replaceSource({ ...f.source(), adventure: { ...f.source().adventure, version: 4 }, turns: [] });
  const original = structuredClone(f.destination()!);
  f.destination()!.turns[1].id = 'different-boundary';
  assert.equal(await f.open().submit('missing', 'Changed'), null);
  assert.equal(f.records.size, 1);
  f.replaceDestination({ ...original, turns: original.turns.slice(0, 1) });
  assert.equal(await f.open().submit('missing', 'Changed'), null);
  f.replaceDestination(original);
  assert.ok(await f.open().submit('missing', 'Changed'));
});

test('DEV-003J: disposal during in-flight Fork retains its request for deliberate reload recovery', async () =>
{
  const f = fixture();
  const original = f.storage.fork;
  let release!: () => void;
  const gate = new Promise<void>(resolve => release = resolve);
  f.storage.fork = async request => { await gate; return original(request); };
  const controller = f.open();
  const pending = controller.submit('turn-2', 'Fork');
  controller.dispose();
  f.drop('');
  release();
  assert.equal(await pending, null);
  assert.equal(f.records.size, 1);
  const reloaded = f.open();
  assert.equal(f.requests.length, 1);
  assert.ok(await reloaded.submit('turn-1', 'Changed'));
  assert.deepEqual(f.requests[1], f.requests[0]);
});

test('DEV-003J: malformed/foreign records fail closed; journal contains no source prose and cannot replace unresolved work', async () =>
{
  const f = fixture();
  await f.open().submit('turn-2', 'Fork');
  const [key, encoded] = [...f.records.entries()][0];
  const record = JSON.parse(encoded);
  assert.deepEqual(Object.keys(record.attempt).sort(), ['request', 'turnOrder']);
  assert.equal(encoded.includes('Authored'), false);
  assert.equal(encoded.includes('Generated'), false);
  const invalid = [
    '', '{', 'null', 'x'.repeat(8001), JSON.stringify({ ...record, version: 2 }),
    JSON.stringify({ ...record, extra: true }), JSON.stringify({ ...record, attempt: { ...record.attempt, turnOrder: 0 } }),
    JSON.stringify({ ...record, attempt: { ...record.attempt, turnOrder: 4 } }),
    ...[
      { sourceAdventureId: 'foreign' }, { adventureId: 'source' }, { operationId: '?' }, { turnId: null },
      { title: '' }, { title: '\ud800' }, { title: 'x'.repeat(161) }, { schemaVersion: 3 },
      { expectedVersion: 0 }, { expectedVersion: 1.5 }, { expectedVersion: Number.MAX_SAFE_INTEGER + 1 },
      { epoch: '' }, { extra: true }
    ].map(delta => JSON.stringify({ ...record, attempt: { ...record.attempt, request: { ...record.attempt.request, ...delta } } }))
  ];
  for (const value of invalid)
  {
    f.records.set(key, value);
    const blocked = f.open();
    assert.equal(blocked.state.phase, 'blocked');
    assert.equal(await blocked.submit('turn-1', 'Fresh'), null);
    assert.equal(f.records.get(key), value);
  }
  f.records.set(key, encoded);
  const attempt = f.journal.load('source')!;
  assert.equal(Object.isFrozen(attempt.request), true);
  assert.throws(() => f.journal.save({ ...attempt, request: { ...attempt.request, operationId: 'different' } }));
  assert.throws(() => f.journal.clear({ ...attempt, request: { ...attempt.request, operationId: 'different' } }));
  assert.equal(f.records.get(key), encoded);
  assert.equal(f.requests.length, 1);
});
