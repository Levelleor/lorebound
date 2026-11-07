import { schemaVersion } from './library.ts';
import { isObject } from './story.ts';

export interface DraftRequest
{
  schemaVersion: number;
  epoch: string;
  adventureId: string;
  target: 'composer_story' | `passage:${string}`;
}
export interface Draft extends DraftRequest
{
  text: string;
  exists?: boolean;
}
export interface DraftStorage
{
  readDraft(request: DraftRequest): Promise<Draft>;
  saveDraft(request: Draft): Promise<Draft>;
  deleteDraft?(request: Draft): Promise<void>;
}
export type DraftStatus = 'loading' | 'saved' | 'unsaved' | 'saving' | 'error';

export function readDraft(value: unknown, request: DraftRequest): Draft
{
  const passage = request.target.startsWith('passage:');
  if (!isObject(value) || Object.keys(value).length !== (passage ? 6 : 5)
    || (passage && typeof value.exists !== 'boolean')
    || value.schemaVersion !== schemaVersion || value.epoch !== request.epoch
    || value.adventureId !== request.adventureId || value.target !== request.target
    || typeof value.text !== 'string' || !value.text.isWellFormed()
    || [...value.text].length > 20000) throw new Error('unsupported_draft_response');
  return value as unknown as Draft;
}

export class TextDraft
{
  private text = '';
  private revision = 0;
  private savedRevision = 0;
  private readSequence = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private saving: Promise<void> | null = null;
  private disposed = false;
  private discarding = false;
  private storedText: string | null = null;
  private unconfirmedText: string | null = null;
  private readonly request: DraftRequest;
  private readonly initialText: string;

  constructor(
    epoch: string,
    adventureId: string,
    storage: DraftStorage,
    restored: (text: string) => void,
    changed: (status: DraftStatus, error: string) => void,
    delay = 600,
    target: DraftRequest['target'] = 'composer_story',
    initialText = ''
  )
  {
    this.request = { schemaVersion, epoch, adventureId, target };
    this.text = initialText;
    this.initialText = initialText;
    this.storage = storage;
    this.restored = restored;
    this.changed = changed;
    this.delay = delay;
  }

  private readonly storage: DraftStorage;
  private readonly restored: (text: string) => void;
  private readonly changed: (status: DraftStatus, error: string) => void;
  private readonly delay: number;

  private status(status: DraftStatus, error = ''): void
  {
    if (!this.disposed) this.changed(status, error);
  }

  async restore(): Promise<void>
  {
    if (this.disposed || this.saving || this.revision !== this.savedRevision) return;
    const sequence = ++this.readSequence;
    const revision = this.revision;
    try
    {
      const draft = readDraft(await this.storage.readDraft(this.request), this.request);
      if (this.disposed || sequence !== this.readSequence || revision !== this.revision) return;
      this.text = draft.exists === false ? this.initialText : draft.text;
      this.storedText = draft.exists === false ? null : draft.text;
      this.unconfirmedText = null;
      this.restored(this.text);
      this.status('saved');
    }
    catch
    {
      if (!this.disposed && sequence === this.readSequence && revision === this.revision)
        this.status('error', 'The saved draft could not be loaded. Reload the draft to try again, or keep writing.');
    }
  }

  edit(text: string): void
  {
    if (this.disposed) return;
    this.text = text;
    ++this.revision;
    ++this.readSequence;
    if (this.timer) clearTimeout(this.timer);
    this.status('unsaved');
    this.timer = setTimeout(() => void this.flush(), this.delay);
  }

  async flush(): Promise<void>
  {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    if (this.saving) return this.saving;
    if (this.disposed || this.savedRevision === this.revision) return;
    this.saving = this.saveChanges();
    await this.saving;
    this.saving = null;
  }

  private async saveChanges(): Promise<void>
  {
    while (!this.disposed && !this.discarding && this.savedRevision !== this.revision)
    {
      const revision = this.revision;
      const text = this.text;
      if (!text.isWellFormed() || [...text].length > 20000)
      {
        this.status('error', 'Draft not saved. Use 20,000 characters or fewer. Your text is still here.');
        return;
      }
      this.status('saving');
      try
      {
        // Resolve the preceding uncertain value before another write, retaining
        // only the acknowledged and one possibly stored value for safe discard.
        if (this.unconfirmedText !== null)
        {
          const stored = readDraft(await this.storage.readDraft(this.request), this.request);
          if (this.disposed || this.discarding) return;
          this.storedText = stored.exists !== false && (stored.text === this.storedText || stored.text === this.unconfirmedText)
            ? stored.text : null;
          this.unconfirmedText = null;
        }
        this.unconfirmedText = text.replace(/\r\n?/g, '\n');
        const draft = readDraft(await this.storage.saveDraft({ ...this.request, text }), this.request);
        if (draft.text !== text.replace(/\r\n?/g, '\n')) throw new Error('inconsistent_draft_save');
        if (this.disposed) return;
        this.storedText = draft.text;
        this.unconfirmedText = null;
        this.savedRevision = revision;
        this.status(this.revision === revision ? 'saved' : 'unsaved');
      }
      catch
      {
        if (this.revision === revision) this.status('error', 'Draft save unconfirmed. Your text is still here; retry saving it.');
        if (this.revision === revision) return;
      }
    }
  }

  async retry(): Promise<void>
  {
    if (this.revision === this.savedRevision) await this.restore();
    else await this.flush();
  }

  consumed(): void
  {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    ++this.readSequence;
    this.savedRevision = ++this.revision;
    this.text = '';
    this.status('saved');
  }

  async discard(): Promise<void>
  {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.pauseRestore();
    this.discarding = true;
    try
    {
      await this.saving;
      const values = new Set([this.storedText, this.unconfirmedText]);
      for (const text of values)
      {
        if (text === null) continue;
        if (!this.storage.deleteDraft) throw new Error('draft_discard_unavailable');
        await this.storage.deleteDraft({ ...this.request, text });
      }
      this.consumed();
    }
    finally
    {
      this.discarding = false;
    }
  }

  pauseRestore(): void
  {
    ++this.readSequence;
  }

  dispose(): void
  {
    this.disposed = true;
    ++this.readSequence;
    if (this.timer) clearTimeout(this.timer);
  }
}
