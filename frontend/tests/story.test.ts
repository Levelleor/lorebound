import { test } from 'node:test';
import assert from 'node:assert/strict';
import { documentToText, plainTextToDocument, readDocument, reconstruct, type Turn } from '../src/lib/story.ts';
import { readSnapshot, type Snapshot, type CommitRequest, type CommitResult } from '../src/lib/library.ts';
import { StoryCoordinator, type Generator, type StoryStorage } from '../src/lib/coordinator.ts';

function blank(): Snapshot {
  return { schemaVersion: 2, epoch: 'epoch', adventure: { id: 'adventure', title: 'Story', version: 0 }, baseline: { schemaVersion: 1 }, turns: [] };
}
function turn(order: number, suffix = String(order)): Turn {
  return {
    schemaVersion: 1, id: `turn-${suffix}`, order,
    passages: [
      { id: `authored-${suffix}`, source: 'authored', body: plainTextToDocument(`A passage ${order}.\nA line.\n\nA paragraph.`) },
      { id: `generated-${suffix}`, source: 'generated', body: plainTextToDocument('A provisional response.') }
    ], events: []
  };
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (cause: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

// Deliberately simulated storage for coordinator unit contracts. Actual durable
// Wails/SQLite operation is verified independently by Go and real browser tests.
function fixture(generate: Generator = async () => 'A provisional response.') {
  let current = blank();
  let ids = 0;
  let readFailure = false;
  let dropResponse = false;
  let commitFailure = '';
  const writes: CommitRequest[] = [];
  const receipts = new Map<string, { request: string; result: CommitResult }>();
  const storage: StoryStorage = {
    list: async () => ({ schemaVersion: 2, epoch: current.epoch, adventures: [current.adventure] }),
    read: async (epoch, id) => {
      if (readFailure) throw new Error('read_failed');
      if (epoch !== current.epoch) throw new Error('wrong_epoch');
      assert.equal(id, current.adventure.id);
      return structuredClone(current);
    },
    commit: async request => {
      writes.push(structuredClone(request));
      if (commitFailure) throw new Error(commitFailure);
      if (request.epoch !== current.epoch) throw new Error('wrong_epoch');
      const old = receipts.get(request.operationId);
      if (old) {
        if (old.request !== JSON.stringify(request)) throw new Error('operation_id_conflict');
        return { ...old.result, replayed: true };
      }
      if (request.expectedVersion !== current.adventure.version) throw new Error('stale_version');
      current = { ...current, adventure: { ...current.adventure, version: current.adventure.version + 1 }, turns: [...current.turns, structuredClone(request.turn)] };
      const result: CommitResult = { schemaVersion: 2, epoch: request.epoch, adventureId: request.adventureId, operationId: request.operationId, version: current.adventure.version, turnId: request.turn.id, replayed: false };
      receipts.set(request.operationId, { request: JSON.stringify(request), result });
      if (dropResponse) { dropResponse = false; throw new Error('lost_response'); }
      return result;
    }
  };
  const coordinator = new StoryCoordinator(blank(), { storage, generate, newId: () => `id-${++ids}` });
  return { coordinator, storage, writes, head: () => current, replace: (next: Snapshot) => { current = next; }, failRead: (fail: boolean) => { readFailure = fail; }, dropReply: () => { dropResponse = true; }, failCommit: (message: string) => { commitFailure = message; } };
}

test('IDEA-0040/R02: structured prose roundtrips paragraphs, hard breaks, Unicode and literal HTML', () => {
  const text = '<script>alert("text only")</script>\nA line.\n\n\nA second paragraph. 🦉';
  const document = plainTextToDocument(text);
  assert.equal(documentToText(document), text);
  assert.equal(document.content[0].content[1].type, 'hard_break');
  assert.equal(documentToText(plainTextToDocument('a\r\nb\rc')), 'a\nb\nc');
  for (const invalid of ['', ' \n\n ', 'a'.repeat(20001), '\ud800', ...Array.from({ length: 1 }, () => 'a\n'.repeat(2001))]) assert.throws(() => plainTextToDocument(invalid), /invalid_passage_document/);
  assert.equal(documentToText(plainTextToDocument('🦉'.repeat(20000))).length, 40000);
  for (const invalid of [
    { schemaVersion: 2, type: 'doc', content: document.content },
    { ...document, html: '<b>hidden</b>' },
    { schemaVersion: 1, type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'raw\nline' }] }] },
    { schemaVersion: 1, type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'hard_break', text: 'hidden' }] }] }
  ]) assert.throws(() => readDocument(invalid));
});

test('IDEA-0039/R04 + IDEA-0040/R01: pure replay preserves distinct passage identity and total order', () => {
  const snapshot = { ...blank(), adventure: { ...blank().adventure, version: 2 }, turns: [turn(1), turn(2)] };
  const before = JSON.stringify(snapshot);
  const projection = reconstruct(readSnapshot(snapshot));
  assert.deepEqual(reconstruct(structuredClone(snapshot)), projection);
  assert.equal(projection.version, 2);
  assert.equal(projection.epoch, 'epoch');
  assert.equal(projection.passages.length, 4);
  assert.equal(JSON.stringify(snapshot), before, 'Replay never mutates source');
  assert.deepEqual(projection.passages.map(passage => passage.source), ['authored', 'generated', 'authored', 'generated']);
  for (const mutate of [
    (s: Snapshot) => { s.turns[1].id = s.turns[0].id; },
    (s: Snapshot) => { s.turns[1].order = 1; },
    (s: Snapshot) => { s.turns[1].passages[1].id = s.turns[0].passages[0].id; },
    (s: Snapshot) => { s.turns[1].passages[1].source = 'authored'; },
    (s: Snapshot) => { s.adventure.version = 3; }
  ]) { const invalid = structuredClone(snapshot); mutate(invalid); assert.throws(() => readSnapshot(invalid)); }
});

test('IDEA-0039/R06: unknown required-core history is preserved as read-only prose and blocks generation', async () => {
  const snapshot = { ...blank(), adventure: { ...blank().adventure, version: 1 }, turns: [turn(1)] };
  snapshot.turns[0].events = [{ schemaVersion: 9, id: 'effect', order: 1, domainOwner: 'core', type: 'future', source: { turnId: 'turn-1', passageId: 'generated-1', origin: 'generated' }, payload: {} }];
  const before = JSON.stringify(snapshot);
  const f = fixture();
  const coordinator = new StoryCoordinator(readSnapshot(snapshot), { storage: f.storage, generate: async () => { assert.fail('No generation with incompatible history'); } });
  assert.equal(coordinator.state.phase, 'blocked');
  assert.equal(coordinator.state.projection.passages.length, 2);
  assert.match(coordinator.state.error, /read-only/);
  await coordinator.generate(); await coordinator.accept();
  assert.deepEqual(f.writes, []);
  assert.equal(JSON.stringify(snapshot), before);
  assert.equal(new StoryCoordinator(blank(), { storage: f.storage }).state.phase, 'idle', 'Other adventures remain available');
});

test('IDEA-0002/R01–R02: Story stays provisional until one explicit acceptance; narrator receives no internal IDs', async () => {
  let observed;
  const f = fixture(async request => { observed = request; return 'A response.'; });
  f.coordinator.setInput('The moon becomes a library.\n\nAn impossible authorial declaration.');
  await f.coordinator.generate();
  assert.equal(f.coordinator.state.phase, 'ready');
  assert.deepEqual(observed, { input: f.coordinator.state.input, history: [] });
  assert.equal(f.head().adventure.version, 0);
  await f.coordinator.generate();
  assert.equal(f.writes.length, 0, 'Another Send cannot accept the pending candidate');
  const candidate = f.coordinator.state.candidate!;
  assert.notEqual(candidate.passages[0].id, candidate.passages[1].id);
  assert.deepEqual(candidate.events, []);
  await f.coordinator.accept();
  assert.equal(f.writes.length, 1);
  assert.equal(f.coordinator.state.snapshot.adventure.version, 1);
  assert.equal(f.coordinator.state.input, '');
  assert.equal(f.coordinator.state.phase, 'idle');
  assert.deepEqual(f.coordinator.state.snapshot.turns[0], candidate);
});

test('IDEA-0044/R05: Stop prevents even an abort-ignoring late response from becoming a candidate', async () => {
  const late = deferred<string>();
  let signal: AbortSignal | undefined;
  const f = fixture(async (_request, nextSignal) => { signal = nextSignal; return late.promise; });
  f.coordinator.setInput('Keep this text.');
  const generation = f.coordinator.generate();
  assert.equal(f.coordinator.state.phase, 'generating');
  f.coordinator.stop();
  assert.equal(signal!.aborted, true);
  late.resolve('Too late.');
  await generation;
  assert.equal(f.coordinator.state.phase, 'idle');
  assert.equal(f.coordinator.state.candidate, null);
  assert.equal(f.coordinator.state.input, 'Keep this text.');
  assert.equal(f.writes.length, 0);
});

test('IDEA-0039/R05: Discard preserves authored text and never stores candidate prose', async () => {
  const f = fixture();
  f.coordinator.setInput('Authored text.'); await f.coordinator.generate();
  f.coordinator.discard(); await f.coordinator.accept();
  assert.equal(f.coordinator.state.input, 'Authored text.');
  assert.equal(f.coordinator.state.candidate, null);
  assert.equal(f.head().adventure.version, 0);
  assert.equal(f.writes.length, 0);
});

test('IDEA-0044/R04: rejected generation, malformed output and invalid input preserve canon and player text', async () => {
  for (const generate of [async () => { throw new Error('simulated_provider_failure'); }, async () => '', async () => 'x'.repeat(20001)]) {
    const f = fixture(generate);
    f.coordinator.setInput('Preserve this.'); await f.coordinator.generate();
    assert.equal(f.coordinator.state.phase, 'idle');
    assert.equal(f.coordinator.state.input, 'Preserve this.');
    assert.match(f.coordinator.state.error, /could not be prepared/);
    assert.equal(f.writes.length, 0);
  }
  const f = fixture(async () => { assert.fail('Blank input cannot generate'); });
  f.coordinator.setInput('   '); await f.coordinator.generate();
  assert.match(f.coordinator.state.error, /Enter a story/);
});

test('IDEA-0044/R08: lost response retries identical frozen operation and reads newer canon than original receipt', async () => {
  const f = fixture();
  f.coordinator.setInput('First.'); await f.coordinator.generate();
  f.dropReply(); await f.coordinator.accept();
  assert.equal(f.coordinator.state.phase, 'uncertain');
  assert.equal(f.head().adventure.version, 1);
  const request = structuredClone(f.writes[0]);
  f.coordinator.setInput('Cannot replace uncertain request.');
  f.coordinator.discard(); await f.coordinator.generate();
  assert.equal(f.coordinator.state.input, 'First.');
  f.replace({ ...f.head(), adventure: { ...f.head().adventure, version: 2 }, turns: [...f.head().turns, turn(2, 'other-tab')] });
  await f.coordinator.retrySave();
  assert.deepEqual(f.writes, [request, request]);
  assert.equal(f.coordinator.state.snapshot.adventure.version, 2);
  assert.equal(f.coordinator.state.snapshot.turns.length, 2);
});

test('IDEA-0044/R08: successful commit followed by read failure remains recoverable without a duplicate', async () => {
  const f = fixture();
  f.coordinator.setInput('First.'); await f.coordinator.generate();
  f.failRead(true); await f.coordinator.accept();
  assert.equal(f.coordinator.state.phase, 'uncertain');
  assert.equal(f.coordinator.state.input, 'First.');
  assert.equal(f.coordinator.canRefresh, false);
  f.failRead(false); await f.coordinator.retrySave();
  assert.deepEqual(f.writes[0], f.writes[1]);
  assert.equal(f.head().turns.length, 1);
  assert.equal(f.coordinator.state.phase, 'idle');
});

test('IDEA-0044/R07: stale version and epoch reject, refetch and require deliberate fresh generation', async () => {
  for (const epochChange of [false, true]) {
    const f = fixture();
    f.coordinator.setInput('Retain local input.'); await f.coordinator.generate();
    f.replace(epochChange ? { ...blank(), epoch: 'new-epoch' } : { ...blank(), adventure: { ...blank().adventure, version: 1 }, turns: [turn(1, 'other')] });
    await f.coordinator.accept();
    assert.equal(f.coordinator.state.phase, 'idle');
    assert.equal(f.coordinator.state.candidate, null);
    assert.equal(f.coordinator.state.input, 'Retain local input.');
    assert.match(f.coordinator.state.error, /changed/);
    assert.equal(f.writes.length, 1);
    assert.equal(f.coordinator.state.snapshot.epoch, f.head().epoch);
    await f.coordinator.accept();
    assert.equal(f.writes.length, 1, 'Conflict is never automatically rebased or resubmitted');
    await f.coordinator.generate(); await f.coordinator.accept();
    assert.notEqual(f.writes[0].operationId, f.writes[1].operationId);
    assert.equal(f.coordinator.state.phase, 'idle');
  }
});

test('IDEA-0044/R07–R09: failed conflict refetch blocks new writes until authoritative refresh succeeds', async () => {
  const f = fixture();
  f.coordinator.setInput('Local text.'); await f.coordinator.generate();
  f.replace({ ...blank(), adventure: { ...blank().adventure, version: 1 }, turns: [turn(1, 'winner')] });
  f.failRead(true); await f.coordinator.accept();
  assert.equal(f.coordinator.state.phase, 'blocked');
  await f.coordinator.generate(); await f.coordinator.accept();
  assert.equal(f.writes.length, 1);
  f.failRead(false); await f.coordinator.refresh();
  assert.equal(f.coordinator.state.phase, 'idle');
  assert.equal(f.coordinator.state.input, 'Local text.');
  assert.equal(f.coordinator.state.snapshot.adventure.version, 1);
});

test('IDEA-0044/R09: refresh hints never interrupt a pending candidate or uncertain operation', async () => {
  const f = fixture();
  f.coordinator.setInput('Draft.'); await f.coordinator.generate();
  const candidate = f.coordinator.state.candidate;
  assert.equal(f.coordinator.canRefresh, false);
  await f.coordinator.refresh();
  assert.equal(f.coordinator.state.candidate, candidate);
  f.coordinator.discard();
  f.replace({ ...blank(), adventure: { ...blank().adventure, version: 1 }, turns: [turn(1)] });
  await f.coordinator.refresh();
  assert.equal(f.coordinator.state.snapshot.adventure.version, 1);
  assert.equal(f.coordinator.state.input, 'Draft.');
});

test('IDEA-0044/R05: disposing a workspace ignores late generation and save replies', async () => {
  const lateGeneration = deferred<string>();
  const f = fixture(async () => lateGeneration.promise);
  f.coordinator.setInput('Input.');
  const generated = f.coordinator.generate();
  f.coordinator.dispose(); lateGeneration.resolve('Late.'); await generated;
  assert.equal(f.coordinator.state.candidate, null);
  assert.equal(f.writes.length, 0);
  const lateSave = deferred<CommitResult>();
  const g = fixture();
  const original = g.storage.commit;
  g.storage.commit = async request => { const result = await original(request); await lateSave.promise; return result; };
  g.coordinator.setInput('Saved input.'); await g.coordinator.generate();
  const saved = g.coordinator.accept();
  g.coordinator.dispose();
  lateSave.resolve({} as CommitResult); await saved;
  assert.equal(g.head().turns.length, 1, 'Disposal cannot undo a durable commit');
  assert.equal(g.coordinator.state.phase, 'saving', 'Disposed state is never republished');
});

test('IDEA-0044/R04: typing during a delayed background read is retained', async () => {
  const f = fixture();
  const gate = deferred<Snapshot>();
  f.storage.read = async () => gate.promise;
  f.coordinator.setInput('Before refresh');
  const refreshing = f.coordinator.refresh();
  f.coordinator.setInput('Typed while refresh is in flight');
  gate.resolve(blank());
  await refreshing;
  assert.equal(f.coordinator.state.input, 'Typed while refresh is in flight');
  assert.equal(f.coordinator.state.phase, 'idle');
  assert.equal(f.writes.length, 0);
});
