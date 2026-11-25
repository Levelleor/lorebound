<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { host } from './host';
  import { readStyle, type NarrationRequest, type NarrationSettings } from './narration';
  import { authorNotesLimit, readAuthorNotesText, type AuthorNotes } from './authorNotes';
  import { autoSize } from './autoSize';
  import { keepCaretInView } from './keepCaretInView';

  export let request: NarrationRequest;
  export let onClose: () => void;
  export let onBusy: (value: boolean) => void;
  // Keep retained edits bound to the library that supplied them.
  const target = { ...request };
  let perspective: HTMLSelectElement;
  let panel: HTMLElement;
  let settings: NarrationSettings | null = null;
  let style: NarrationSettings['style'] | null = null;
  let notes: AuthorNotes | null = null;
  let notesText = '';
  let notesOpen = false;
  let busy = true;
  let error = '';
  let notesError = '';
  let disposed = false;
  $: notesCount = [...notesText].length;
  $: notesDirty = Boolean(notes && notesText !== notes.notes);
  $: if (notesError) notesOpen = true;

  async function loadStyle()
  {
    try
    {
      const value = await host.readNarration(target);
      if (disposed) return;
      settings = value;
      style = structuredClone(value.style);
    }
    catch
    {
      if (!disposed) error = 'Narration settings could not be loaded. Reload settings to try again, or close and reopen Narration style if the library changed. Your story is unchanged.';
    }
  }

  async function loadNotes()
  {
    try
    {
      const value = await host.readAuthorNotes(target);
      if (disposed) return;
      notes = value;
      notesText = value.notes;
      notesError = '';
    }
    catch
    {
      if (disposed) return;
      notes = null;
      notesError = 'Author notes could not be loaded. Reload settings to try again, or close and reopen Narration style if the library changed. Your story and draft are unchanged.';
    }
  }

  async function load()
  {
    busy = true;
    onBusy(true);
    error = '';
    notesError = '';
    try
    {
      await loadStyle();
      if (!disposed) await loadNotes();
    }
    finally
    {
      if (!disposed)
      {
        busy = false;
        onBusy(false);
      }
    }
  }

  async function save()
  {
    if (!settings || !style || busy) return;
    error = '';
    notesError = '';
    // Validate retained notes before writing either form; the player's text stays intact.
    const notesChanged = Boolean(notes && notesText !== notes.notes);
    if (notesChanged)
    {
      try
      {
        readAuthorNotesText(notesText);
      }
      catch
      {
        notesError = 'Author notes must be valid text of 4,000 characters or fewer. Your notes are retained.';
        return;
      }
    }
    busy = true;
    onBusy(true);
    try
    {
      try
      {
        settings = await host.saveNarration({ ...target, expectedRevision: settings.revision, style: readStyle(style) });
      }
      catch (cause)
      {
        if (disposed) return;
        error = String(cause).includes('wrong_epoch')
          ? 'The library changed. Close and reopen Narration style before editing settings in this library.'
          : String(cause).includes('narration_settings_changed')
          ? 'Narration settings changed elsewhere. Your form is retained. Reload settings to review the current value before saving again.'
          : 'The settings save could not be confirmed. Your form is retained. Retry the same save or reload settings to check it.';
        return;
      }
      if (disposed) return;
      // Author notes are separately owned metadata with their own revision.
      if (!notes || !notesChanged)
      {
        onClose();
        return;
      }
      try
      {
        notes = await host.saveAuthorNotes({ ...target, expectedRevision: notes.revision, notes: readAuthorNotesText(notesText) });
        if (!disposed) onClose();
      }
      catch (cause)
      {
        if (disposed) return;
        notesError = String(cause).includes('wrong_epoch')
          ? 'The library changed. Close and reopen Narration style before editing notes in this library.'
          : String(cause).includes('author_notes_changed')
          ? 'Author notes changed elsewhere. Your notes are retained. Reload settings to review the current value before saving again.'
          : 'The notes save could not be confirmed. Your notes are retained. Retry the same save or reload settings to check it.';
      }
    }
    finally
    {
      if (!disposed)
      {
        busy = false;
        onBusy(false);
      }
    }
  }

  onMount(() =>
  {
    void load().then(async () =>
    {
      await tick();
      if (!disposed) perspective?.focus({ preventScroll: true });
    });
    return () => { disposed = true; };
  });
</script>

<svelte:window onkeydown={(event) =>
{
  if (event.key !== 'Escape' || event.isComposing || busy) return;
  event.preventDefault();
  onClose();
}} />

<section id="narration-style-panel" class="narration-settings" bind:this={panel} aria-labelledby="narration-title" aria-busy={busy}>
  <h2 id="narration-title" class="sr-only">Narration style</h2>
  {#if error}<p class="story-error" role="alert">{error}</p>{/if}
  {#if notesError}<p class="story-error" role="alert">{notesError}</p>{/if}
  {#if style}
    <form onsubmit={(event) => { event.preventDefault(); void save(); }}>
      <fieldset disabled={busy}>
        <div class="style-grid">
          <div>
            <label for="narration-perspective">Perspective</label>
            <select id="narration-perspective" bind:this={perspective} bind:value={style.perspective}>
              <option value="">No preference</option><option value="first">First person</option><option value="second">Second person</option><option value="third">Third person</option>
            </select>
          </div>
          <div>
            <label for="narration-tense">Tense</label>
            <select id="narration-tense" bind:value={style.tense}>
              <option value="">No preference</option><option value="past">Past</option><option value="present">Present</option>
            </select>
          </div>
          <div>
            <label for="narration-genre">Genre</label>
            <input id="narration-genre" bind:value={style.genre} maxlength="200" placeholder="No preference" />
          </div>
          <div>
            <label for="narration-tone">Tone</label>
            <input id="narration-tone" bind:value={style.tone} maxlength="200" placeholder="No preference" />
          </div>
          <div>
            <label for="narration-pacing">Pacing</label>
            <select id="narration-pacing" bind:value={style.pacing}>
              <option value="">No preference</option><option value="slow">Slow and descriptive</option><option value="balanced">Balanced</option><option value="fast">Fast and action-oriented</option>
            </select>
          </div>
          <div>
            <label for="narration-length">Response length</label>
            <select id="narration-length" bind:value={style.length}>
              <option value="">No preference</option><option value="brief">Brief</option><option value="balanced">Balanced</option><option value="detailed">Detailed</option>
            </select>
          </div>
        </div>
        <label for="narration-instructions">Custom style instructions</label>
        <textarea id="narration-instructions" use:autoSize={style.instructions} use:keepCaretInView={{ viewport: panel, enabled: true }} bind:value={style.instructions} maxlength="2000" rows="2" placeholder="Optional writing direction · sent with each AI continuation"></textarea>
        <details class="author-notes" bind:open={notesOpen}>
          <summary>Author notes <span class="supporting">{notesDirty ? '· unsaved changes' : notes && notes.notes.trim() ? '· saved guidance' : '· none sent'}</span></summary>
          <div class="author-notes-field">
            {#if notes}
              <label for="narration-author-notes">Author notes</label>
              <textarea id="narration-author-notes" use:autoSize={notesText} use:keepCaretInView={{ viewport: panel, enabled: true }} bind:value={notesText} maxlength="8000" rows="3"
                placeholder="Optional current-adventure writing guidance · sent after narration settings on each local AI continuation"></textarea>
              <p class="supporting">Current adventure only · {notesCount} / {authorNotesLimit} characters · sent after style and before accepted story on each local Generate/Retry.</p>
            {:else}
              <p class="supporting">Author notes are unavailable in this form. Reload settings to try again; your story and draft are unchanged.</p>
            {/if}
          </div>
        </details>
        <details class="supporting" open={Boolean(error || notesError)}>
          <summary>About narration guidance</summary>
          <p>Saved for future AI continuations. Existing prose stays unchanged; Simulation ignores style and author notes.</p>
          <p>Genre and tone: up to 200 characters each. Custom instructions: up to 2,000. Author notes: up to 4,000. Sent in the order shown; conflicting creative directions are left for the model to interpret. No character selection is required.</p>
          <p>Author notes are optional current-adventure guidance for generated prose only. They cannot create or change accepted story, world state, drafts or the adventure version. Only current-adventure notes exist here: global, scene and template-derived notes are not implemented, and no note-conflict arbitration is performed. Adherence and context capacity are not guaranteed.</p>
          <p>Adherence and length are best-effort, not decoding parameters or a token cap. Model context capacity is unknown; guidance is sent in full without automatic trimming. Inspect Generation details after a request.</p>
          <button class="quiet" type="button" onclick={load}>Reload settings</button>
        </details>
      </fieldset>
      <div class="shelf-actions"><button type="button" disabled={busy} onclick={onClose}>Cancel</button><button class="primary" disabled={busy} type="submit">Save narration settings</button></div>
    </form>
  {:else}
    <button class="quiet" disabled={busy} onclick={load}>{busy ? 'Loading…' : 'Reload settings'}</button>
  {/if}
</section>

<style>
  .narration-settings
  {
    max-height: var(--narration-height);
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
    padding: 6px;
    margin-inline: -6px;
    color: var(--foreground);
  }

  .shelf-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
  .shelf-actions button { padding: 6px 10px; font-size: 12px; }
  .story-error { max-height: none; overflow: visible; }
  input, select, textarea, button, summary { scroll-margin-block: 8px; }
  form, fieldset { margin: 0; padding: 0; border: 0; min-width: 0; }
  .style-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px 16px; }
  .style-grid > div { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  label { color: var(--muted-foreground); font: 600 10.88px/1.4 var(--font-ui); text-transform: uppercase; letter-spacing: .14em; margin: 0; }
  input, select, textarea { box-sizing: border-box; width: 100%; min-width: 0; padding: 6px 8px; margin: 0; border: 1px solid var(--border); border-radius: 4px; background: var(--background); color: var(--foreground); font: 12px/1.5 var(--font-ui); }
  input, select { height: 32px; }
  form > fieldset > label, .author-notes-field > label { display: block; margin: 16px 0 6px; }
  textarea { min-height: 64px; max-height: none; overflow: hidden; resize: none; }
  .author-notes-field .supporting { margin: 6px 0 0; }
  details { margin-top: 12px; }
  details.author-notes > summary { margin-bottom: 0; }
  details.author-notes[open] > summary { margin-bottom: 10px; }
  summary { cursor: pointer; }
  @media (max-width: 639px)
  {
    .style-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
</style>
