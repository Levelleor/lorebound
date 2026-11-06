import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ForkController, prepareFork, type ForkRequest, type ForkResult, type ForkStorage } from '../src/lib/fork.ts';
import type { Snapshot } from '../src/lib/library.ts';
import { plainTextToDocument, type Turn } from '../src/lib/story.ts';

function turn(order: number): Turn
{
  return {
    schemaVersion: 1, id: `turn-${order}`, order,
    passages: [
      { id: `authored-${order}`, source: 'authored', body: plainTextToDocument(`Authored ${order}.`) },
      { id: `generated-${order}`, source: 'generated', body: plainTextToDocument(`Generated ${order}.`) }
    ], events: []
  };
}
function source(): Snapshot
{
  return { schemaVersion: 2, epoch: 'epoch', adventure: { id: 'source', title: 'Source', version: 3 }, baseline: { schemaVersion: 1 }, turns: [turn(1), turn(2), turn(3)] };
}
function fixture()
{
  const original = source();
  const requests: ForkRequest[] = [];
  let failure = '';
  let failRead = false;
  let dropReply = false;
  let destination: Snapshot | null = null;
  let receipt: ForkResult | null = null;
  let ids = 0;
  const storage: ForkStorage = {
    fork: async request =>
    {
      requests.push(request);
      if (failure) throw new Error(failure);
      if (!receipt)
      {
        destination = { ...structuredClone(original), adventure: { id: request.adventureId, title: request.title, version: 2 }, turns: structuredClone(original.turns.slice(0, 2)) };
        receipt = { schemaVersion: 2, epoch: request.epoch, adventureId: request.adventureId, operationId: request.operationId, version: 2, turnId: request.turnId, replayed: false };
      }
      if (dropReply)
      {
        dropReply = false;
        throw new Error('lost_response');
      }
      return { ...receipt };
    },
    read: async () =>
    {
      if (failRead) throw new Error('read_failed');
      return structuredClone(destination!);
    }
  };
  const controller = new ForkController(original, storage, () => {}, () => `id-${++ids}`);
  return {
    controller, requests, storage, original,
    fail: (value: string) => failure = value,
    failRead: (value: boolean) => failRead = value,
    drop: () => dropReply = true,
    destination: () => destination!,
    replace: (value: Snapshot) => destination = value
  };
}

test('IDEA-0011/R01-R03: request pins actual accepted boundary and source version without prose or input payload', () =>
{
  const original = source();
  const request = prepareFork(original, 'turn-2', '  New future  ', 'fork', 'operation');
  assert.deepEqual(request, { schemaVersion: 2, epoch: 'epoch', operationId: 'operation', sourceAdventureId: 'source', expectedVersion: 3, turnId: 'turn-2', adventureId: 'fork', title: 'New future' });
  assert.equal(Object.isFrozen(request), true);
  for (const boundary of ['baseline', 'provisional', 'authored-1', 'turn-4']) assert.throws(() => prepareFork(original, boundary, 'Title', 'fork', 'op'));
  assert.throws(() => prepareFork(original, 'turn-1', 'x'.repeat(161), 'fork', 'op'));
  assert.throws(() => prepareFork(original, 'turn-1', '\ud800', 'fork', 'op'));
  assert.throws(() => prepareFork(original, 'turn-1', 'Title', 'source', 'op'));
  original.turns[0].events = [{ type: 'unsupported' }];
  assert.throws(() => prepareFork(original, 'turn-1', 'Title', 'fork', 'op'));
});

test('IDEA-0011/R04-R06: lost reply recovers identical frozen request and reads destination current head', async () =>
{
  const f = fixture();
  f.drop();
  assert.equal(await f.controller.submit('turn-2', 'Fork'), null);
  assert.equal(f.controller.state.phase, 'uncertain');
  const next = f.destination();
  next.adventure.version = 3;
  next.turns.push(turn(3));
  f.replace(next);
  const result = await f.controller.submit('turn-1', 'Changed while uncertain');
  assert.equal(result?.adventure.version, 3);
  assert.equal(f.requests.length, 2);
  assert.equal(f.requests[0], f.requests[1]);
  assert.equal(f.requests[1].turnId, 'turn-2');
  assert.equal(f.controller.state.phase, 'complete');
});

test('failed destination read keeps request recoverable; corrupt or mismatched read cannot open as saved', async () =>
{
  const f = fixture();
  f.failRead(true);
  assert.equal(await f.controller.submit('turn-2', 'Fork'), null);
  assert.equal(f.controller.state.phase, 'uncertain');
  f.failRead(false);
  const bad = f.destination();
  bad.turns[0].passages[0].body = plainTextToDocument('Wrong prefix');
  f.replace(bad);
  assert.equal(await f.controller.submit('turn-2', 'Fork'), null);
  assert.equal(f.controller.state.phase, 'uncertain');
  f.replace({ ...f.destination(), turns: structuredClone(source().turns.slice(0, 2)) });
  assert.ok(await f.controller.submit('turn-2', 'Fork'));
  assert.equal(new Set(f.requests.map(request => request.operationId)).size, 1);
});

test('B3-D05: stale source/epoch or definitive rejection requires close and explicit fresh choice, never automatic rebase', async () =>
{
  for (const reason of ['stale_version', 'wrong_epoch', 'invalid_request', 'adventure_exists', 'adventure_not_found', 'operation_id_conflict', 'unsupported_history'])
  {
    const f = fixture();
    f.fail(reason);
    assert.equal(await f.controller.submit('turn-2', 'Fork'), null);
    assert.equal(f.controller.state.phase, 'rejected');
    f.fail('');
    assert.equal(await f.controller.submit('turn-2', 'Fresh'), null);
    assert.equal(f.requests.length, 1);
  }
});

test('pending Fork is single flight and disposed work cannot reopen a destination', async () =>
{
  const f = fixture();
  let release!: (value: ForkResult) => void;
  f.storage.fork = () => new Promise(resolve => release = resolve);
  const pending = f.controller.submit('turn-2', 'Fork');
  assert.equal(f.controller.state.phase, 'saving');
  assert.equal(await f.controller.submit('turn-2', 'Duplicate'), null);
  f.controller.dispose();
  release({ schemaVersion: 2, epoch: 'epoch', adventureId: 'id-1', operationId: 'id-2', version: 2, turnId: 'turn-2', replayed: false });
  assert.equal(await pending, null);
});

test('malformed/mismatched Fork receipt cannot be treated as confirmed', async () =>
{
  const f = fixture();
  f.storage.fork = async () => ({ schemaVersion: 2, epoch: 'other', adventureId: 'wrong', operationId: 'wrong', version: 2, turnId: 'turn-2', replayed: false });
  assert.equal(await f.controller.submit('turn-2', 'Fork'), null);
  assert.equal(f.controller.state.phase, 'uncertain');
});
