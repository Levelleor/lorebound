<script lang="ts">
  import { tick } from 'svelte';
  import { host } from './host';
  import { loreKinds, loreTitleLimit, loreDescriptionLimit, validLoreText, type LorebookRequest, type LoreEntry } from './lorebook';

  export let request: LorebookRequest;
  export let onOpenChange: (open: boolean) => void;

  let dialog: HTMLDialogElement;
  let titleInput: HTMLInputElement;
  let entries: LoreEntry[] = [];
  let saved: LoreEntry | null = null;
  let draft: LoreEntry | null = null;
  let reading = false;
  let saving = false;
  let closing = false;
  let loaded = false;
  let expanded = false;
  let width = 640;
  let error = '';
  let status = '';

  $: busy = reading || saving;
  $: dirty = draft !== null && saved !== null && (draft.kind !== saved.kind || draft.title !== saved.title
    || draft.description !== saved.description || draft.included !== saved.included);

  function edit(entry: LoreEntry | null)
  {
    saved = entry;
    draft = entry ? { ...entry } : null;
    error = '';
    status = '';
  }

  async function reload()
  {
    if (busy) return;
    reading = true;
    error = '';
    status = '';
    try
    {
      entries = (await host.readLorebook(request)).entries;
      loaded = true;
      if (!dirty && draft?.revision) edit(entries.find(entry => entry.id === draft?.id) ?? null);
      if (dirty && draft?.revision && entries.find(entry => entry.id === draft?.id)?.revision !== draft.revision)
        error = 'This entry changed in another tab. Discard your edits to open the current saved entry.';
    }
    catch { error = 'The Lorebook could not be loaded. Reload entries to try again.'; }
    finally { reading = false; }
  }

  export function show()
  {
    if (dialog.open) return;
    dialog.showModal();
    onOpenChange(true);
    void reload();
  }

  async function close()
  {
    if (closing) return;
    closing = true;
    const animation = matchMedia('(prefers-reduced-motion: reduce)').matches ? null
      : dialog.animate({ opacity: [1, 0] }, { duration: 140, easing: 'ease-out', fill: 'forwards' });
    await animation?.finished.catch(() => {});
    dialog.close();
    animation?.cancel();
    closing = false;
    onOpenChange(false);
  }

  async function add()
  {
    edit({ id: crypto.randomUUID(), revision: 0, kind: 'other', title: '', description: '', included: false });
    await tick();
    titleInput.focus();
  }

  function discard()
  {
    edit(entries.find(entry => entry.id === draft?.id) ?? null);
  }

  async function save(event: SubmitEvent)
  {
    event.preventDefault();
    if (!draft || busy) return;
    if (!validLoreText(draft.title, loreTitleLimit) || !draft.title.trim())
    {
      error = 'Enter a title of 1 to 160 characters.';
      titleInput.focus();
      return;
    }
    if (!validLoreText(draft.description, loreDescriptionLimit))
    {
      error = 'Use a description of up to 4,000 characters with valid text.';
      return;
    }
    saving = true;
    error = '';
    status = '';
    try
    {
      const entry = await host.saveLoreEntry(request, { ...draft });
      entries = entries.some(item => item.id === entry.id)
        ? entries.map(item => item.id === entry.id ? entry : item)
        : [...entries, entry];
      edit(entry);
      status = 'Entry saved.';
    }
    catch (cause)
    {
      error = String(cause).includes('stale_version')
        ? 'This entry changed in another tab. Reload entries to see the saved version. Your edits are still here.'
        : 'The save could not be confirmed. Your edits are still here. Try saving again.';
    }
    finally { saving = false; }
  }
</script>

<dialog id="lorebook-drawer" aria-labelledby="lorebook-heading" bind:this={dialog}
  style:--lorebook-width={`${expanded ? 1120 : width}px`}
  oncancel={(event) => { event.preventDefault(); void close(); }}>
  <div class="drawer-layout">
    <header>
      <h2 id="lorebook-heading">Lorebook</h2>
      <div class="drawer-actions">
        <button type="button" class="expand" onclick={() => expanded = !expanded}>{expanded ? 'Collapse' : 'Expand'}</button>
        <button type="button" onclick={close}>Close</button>
      </div>
    </header>

    <nav class="lore-rail" aria-label="Lorebook entries">
      <button class="primary add" type="button" disabled={!loaded || busy || dirty} onclick={add}>New entry</button>
      {#if entries.length}
        <ul>
          {#each entries as entry (entry.id)}
            <li>
              <button type="button" aria-current={draft?.id === entry.id ? 'true' : undefined}
                disabled={busy || (dirty && draft?.id !== entry.id)} onclick={() => { if (draft?.id !== entry.id) edit(entry); }}>
                <span class="entry-title">{entry.title}</span>
                <span class="supporting">{loreKinds[entry.kind]} · {entry.included ? 'Included' : 'Excluded'}</span>
              </button>
            </li>
          {/each}
        </ul>
      {/if}
      <button type="button" class="quiet reload" disabled={busy} onclick={reload}>Reload entries</button>
    </nav>

    <section class="lore-editor" aria-label="Lorebook editor" aria-busy={busy}>
      {#if error}<p class="story-error" role="alert">{error}</p>{/if}
      {#if reading}<p role="status" class="supporting">Loading entries…</p>{/if}
      {#if draft}
        <form onsubmit={save}>
          <label for="lore-title">Entry title</label>
          <input id="lore-title" bind:this={titleInput} bind:value={draft.title} disabled={busy} required />
          <label for="lore-kind">Entry type</label>
          <select id="lore-kind" bind:value={draft.kind} disabled={busy}>
            {#each Object.entries(loreKinds) as [value, label]}<option {value}>{label}</option>{/each}
          </select>
          <label for="lore-description">Description</label>
          <textarea id="lore-description" bind:value={draft.description} disabled={busy} rows="6"></textarea>
          {#if draft.revision}
            <label class="include"><input type="checkbox" bind:checked={draft.included} disabled={busy} /> Include in Story generation</label>
          {:else}
            <p class="supporting">New entries start excluded from Story generation.</p>
          {/if}
          <div class="editor-actions">
            <button type="submit" class="primary" disabled={busy || !dirty}>{saving ? 'Saving…' : 'Save entry'}</button>
            {#if dirty}<button type="button" disabled={busy} onclick={discard}>Discard edits</button>{/if}
          </div>
          {#if status}<p class="saved" role="status">{status}</p>{/if}
        </form>
      {:else if loaded}
        <p class="supporting">{entries.length ? 'Choose an entry to edit or change its inclusion.' : 'No Lorebook entries yet.'}</p>
      {/if}
    </section>

    {#if !expanded}
      <label class="drawer-width">Drawer width <input type="range" min="420" max="1000" step="20" bind:value={width} /></label>
    {/if}
  </div>
</dialog>

<style>
  dialog
  {
    inset: 0 auto 0 0;
    margin: 0;
    width: min(100%, var(--lorebook-width));
    max-width: none;
    height: 100dvh;
    max-height: none;
    padding: 0;
    border: 0;
    border-right: 1px solid var(--sidebar-border);
    background: var(--card);
    color: var(--foreground);
    box-shadow: 12px 0 48px #0006;
    container-type: inline-size;
  }

  dialog::backdrop { background: #0007; }
  .drawer-layout { display: grid; grid-template: auto minmax(0, 1fr) auto / minmax(144px, 1fr) minmax(0, 2fr); height: 100%; }
  header { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 20px; border-bottom: 1px solid var(--sidebar-border); }
  h2 { margin: 0; }
  .drawer-actions, .editor-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .lore-rail, .lore-editor { min-width: 0; overflow: auto; padding: 16px; }
  .lore-rail { border-right: 1px solid var(--sidebar-border); background: var(--sidebar); }
  dialog[open] .lore-rail { animation: rail-in 160ms ease-out both; }
  dialog[open] .lore-editor { animation: editor-in 200ms 120ms ease-out both; }
  @keyframes rail-in { from { opacity: 0; transform: translateX(-16px); } }
  @keyframes editor-in { from { opacity: 0; clip-path: inset(0 100% 0 0); } to { opacity: 1; clip-path: inset(0); } }
  ul { list-style: none; padding: 0; margin: 12px 0; }
  li + li { margin-top: 4px; }
  li button, .add { width: 100%; }
  li button { display: grid; gap: 3px; text-align: left; background: transparent; border-color: transparent; }
  li button[aria-current='true'] { border-color: var(--primary); background: var(--card); }
  .entry-title { overflow-wrap: anywhere; }
  .reload { margin-top: 8px; }
  form { padding: 0; border: 0; }
  input:not([type]), select, textarea { width: 100%; padding: 9px 10px; margin: 0 0 16px; border: 1px solid var(--border); border-radius: 4px; background: var(--background); color: var(--foreground); font: inherit; }
  textarea { min-height: 120px; max-height: none; line-height: 1.55; }
  .include { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
  .include input { width: auto; margin: 0; accent-color: var(--primary); }
  .saved { color: var(--success); }
  .drawer-width { grid-column: 1 / -1; display: flex; gap: 12px; align-items: center; margin: 0; padding: 8px 16px; border-top: 1px solid var(--sidebar-border); font-size: 12px; }
  .drawer-width input { max-width: 180px; margin: 0; padding: 0; accent-color: var(--primary); }

  @container (max-width: 500px)
  {
    .drawer-layout { grid-template: auto auto minmax(0, 1fr) auto / minmax(0, 1fr); }
    .lore-rail { display: flex; flex-wrap: wrap; align-items: start; gap: 8px; padding: 10px 16px; border-right: 0; border-bottom: 1px solid var(--sidebar-border); }
    .add, .reload { width: auto; margin: 0; }
    ul { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(110px, max-content); gap: 4px; order: 1; width: 100%; margin: 0; padding: 3px; overflow-x: auto; }
    li { max-width: 175px; }
    li + li { margin: 0; }
  }

  @media (max-width: 419px) { .drawer-width, .expand { display: none; } }
</style>
