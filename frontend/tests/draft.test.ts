import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ComposerDraft, readDraft, type Draft, type DraftStorage, type DraftStatus } from '../src/lib/draft.ts';

const request = { schemaVersion: 2, epoch: 'epoch', adventureId: 'adventure', target: 'composer_story' as const };

function deferred<T>()
{
  let resolve!: (value: T) => void;
  let reject!: (cause: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function fixture(storage?: DraftStorage)
{
  let saved: Draft = { ...request, text: 'Stored input' };
  let input = '';
  let status: DraftStatus = 'loading';
  let error = '';
  const writes: Draft[] = [];
  const draft = new ComposerDraft(request.epoch, request.adventureId, storage ?? {
    readDraft: async () => saved,
    saveDraft: async value =>
    {
      writes.push(value);
      saved = value;
      return value;
    }
  }, text => { input = text; }, (next, message) => { status = next; error = message; });
  return { draft, writes, input: () => input, status: () => status, error: () => error };
}

test('IDEA-0005/R01: debounce saves one latest value, including empty input, without a turn', async t =>
{
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture();
  await f.draft.restore();
  assert.equal(f.input(), 'Stored input');
  f.draft.edit('First keystrokes');
  t.mock.timers.tick(599);
  assert.equal(f.writes.length, 0);
  f.draft.edit('Latest text 🦉');
  t.mock.timers.tick(599);
  assert.equal(f.writes.length, 0);
  t.mock.timers.tick(1);
  await f.draft.flush();
  assert.deepEqual(f.writes.map(write => write.text), ['Latest text 🦉']);
  assert.equal(f.status(), 'saved');
  f.draft.edit('');
  await f.draft.flush();
  assert.equal(f.writes[1].text, '');
  f.draft.dispose();
});

test('IDEA-0005/R02: late restores cannot overwrite typing or consumption', async () =>
{
  const read = deferred<Draft>();
  const f = fixture({ readDraft: () => read.promise, saveDraft: async value => value });
  const restoring = f.draft.restore();
  f.draft.edit('New input');
  read.resolve({ ...request, text: 'Old input' });
  await restoring;
  assert.equal(f.input(), '');
  assert.equal(f.status(), 'unsaved');
  await f.draft.flush();
  const late = deferred<Draft>();
  const consumed = fixture({ readDraft: () => late.promise, saveDraft: async value => value });
  const pending = consumed.draft.restore();
  consumed.draft.consumed();
  late.resolve({ ...request, text: 'Already accepted' });
  await pending;
  assert.equal(consumed.input(), '');
  f.draft.dispose();
  consumed.draft.dispose();
});

test('IDEA-0005/R02: disposal fences late restore and save replies', async () =>
{
  const read = deferred<Draft>();
  const restore = fixture({ readDraft: () => read.promise, saveDraft: async value => value });
  const loading = restore.draft.restore();
  restore.draft.dispose();
  read.resolve({ ...request, text: 'Must not appear in another workspace' });
  await loading;
  assert.equal(restore.input(), '');
  assert.equal(restore.status(), 'loading');

  const write = deferred<Draft>();
  const save = fixture({ readDraft: async () => ({ ...request, text: '' }), saveDraft: () => write.promise });
  save.draft.edit('An abandoned workspace');
  const saving = save.draft.flush();
  assert.equal(save.status(), 'saving');
  save.draft.dispose();
  write.resolve({ ...request, text: 'An abandoned workspace' });
  await saving;
  assert.equal(save.status(), 'saving', 'A durable write may finish, but its reply cannot publish into disposed UI');
});

test('IDEA-0005/R03: concurrent flushes serialize edits made during a save', async () =>
{
  const first = deferred<Draft>();
  const writes: Draft[] = [];
  const f = fixture({
    readDraft: async () => ({ ...request, text: '' }),
    saveDraft: async value =>
    {
      writes.push(value);
      return writes.length === 1 ? first.promise : value;
    }
  });
  f.draft.edit('First');
  const saving = f.draft.flush();
  f.draft.edit('Newer');
  const again = f.draft.flush();
  assert.equal(writes.length, 1);
  first.resolve(writes[0]);
  await Promise.all([saving, again]);
  assert.deepEqual(writes.map(write => write.text), ['First', 'Newer']);
  assert.equal(f.status(), 'saved');
  f.draft.dispose();
});

test('IDEA-0005/R06: read/save failures remain visible and retry only the current input', async () =>
{
  let fail = true;
  const writes: Draft[] = [];
  const f = fixture({
    readDraft: async () =>
    {
      if (fail) throw new Error('read_failed');
      return { ...request, text: 'Recovered' };
    },
    saveDraft: async value =>
    {
      writes.push(value);
      if (fail) throw new Error('lost_response');
      return value;
    }
  });
  await f.draft.restore();
  assert.equal(f.status(), 'error');
  fail = false;
  await f.draft.retry();
  assert.equal(f.input(), 'Recovered');
  fail = true;
  f.draft.edit('Unconfirmed');
  await f.draft.flush();
  assert.equal(f.status(), 'error');
  assert.match(f.error(), /unconfirmed/);
  f.draft.edit('Current input');
  fail = false;
  await f.draft.retry();
  assert.deepEqual(writes.map(write => write.text), ['Unconfirmed', 'Current input']);
  assert.equal(f.status(), 'saved');
  f.draft.dispose();
});

test('IDEA-0005/R06: invalid responses and oversized or malformed Unicode are never called saved', async () =>
{
  for (const invalid of [null, { ...request }, { ...request, text: '', extra: true }, { ...request, text: '', epoch: 'other' }, { ...request, text: '\ud800' }])
    assert.throws(() => readDraft(invalid, request));
  const f = fixture();
  for (const text of ['🦉'.repeat(20001), '\ud800'])
  {
    f.draft.edit(text);
    await f.draft.flush();
    assert.equal(f.status(), 'error');
  }
  assert.equal(f.writes.length, 0);
  f.draft.edit('🦉'.repeat(20000));
  await f.draft.flush();
  assert.equal(f.status(), 'saved');
  f.draft.dispose();
});
