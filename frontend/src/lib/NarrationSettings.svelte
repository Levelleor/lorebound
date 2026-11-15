<script lang="ts">
  import { onMount } from 'svelte';
  import { host } from './host';
  import { readStyle, type NarrationRequest, type NarrationSettings } from './narration';

  export let request: NarrationRequest;
  export let onClose: () => void;
  let dialog: HTMLDialogElement;
  let settings: NarrationSettings | null = null;
  let style: NarrationSettings['style'] | null = null;
  let busy = true;
  let error = '';
  let disposed = false;

  async function load()
  {
    busy = true;
    error = '';
    try
    {
      const value = await host.readNarration(request);
      if (disposed) return;
      settings = value;
      style = structuredClone(value.style);
    }
    catch
    {
      if (!disposed) error = 'Narration settings could not be loaded. Reload settings to try again. Your story is unchanged.';
    }
    finally { if (!disposed) busy = false; }
  }

  async function save()
  {
    if (!settings || !style || busy) return;
    busy = true;
    error = '';
    try
    {
      await host.saveNarration({ ...request, expectedRevision: settings.revision, style: readStyle(style) });
      if (!disposed) dialog.close();
    }
    catch (cause)
    {
      if (disposed) return;
      error = String(cause).includes('narration_settings_changed')
        ? 'Narration settings changed elsewhere. Your form is retained. Reload settings to review the current value before saving again.'
        : 'The settings save could not be confirmed. Your form is retained. Retry the same save or reload settings to check it.';
    }
    finally { if (!disposed) busy = false; }
  }

  onMount(() =>
  {
    dialog.showModal();
    void load();
    return () => { disposed = true; };
  });
</script>

<dialog bind:this={dialog} aria-labelledby="narration-title" onclose={onClose} oncancel={(event) => { if (busy) event.preventDefault(); }}>
  <div class="dialog-heading">
    <h2 id="narration-title">Narration style</h2>
    <button class="quiet" aria-label="Close narration settings" disabled={busy} onclick={() => dialog.close()}>✕</button>
  </div>
  <p class="supporting">Saved for this adventure. Guides future AI continuations and Retry; existing prose and world state stay unchanged. Simulation ignores these preferences.</p>
  {#if error}<p class="story-error" role="alert">{error}</p>{/if}
  {#if style}
    <form onsubmit={(event) => { event.preventDefault(); void save(); }}>
      <fieldset disabled={busy}>
        <div class="style-grid">
          <div>
            <label for="narration-perspective">Perspective</label>
            <select id="narration-perspective" bind:value={style.perspective}>
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
        <textarea id="narration-instructions" bind:value={style.instructions} maxlength="2000" rows="4" placeholder="Optional writing direction"></textarea>
        <p class="supporting">Genre and tone: up to 200 characters each. Custom instructions: up to 2,000. Sent in the order shown; conflicting creative directions are left for the model to interpret. No character selection is required.</p>
        <p class="supporting">Adherence and length are best-effort, not decoding parameters or a token cap. Model context capacity is unknown; guidance is sent in full without automatic trimming. Inspect Generation details after a request.</p>
        <div class="dialog-actions"><button type="button" onclick={() => dialog.close()}>Cancel</button><button class="primary" type="submit">Save narration settings</button></div>
      </fieldset>
    </form>
  {/if}
  <button class="quiet" disabled={busy} onclick={load}>{busy ? 'Loading…' : 'Reload settings'}</button>
</dialog>

<style>
  dialog
  {
    width: calc(100% - 32px);
    max-width: 576px;
    max-height: 90dvh;
    overflow: auto;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--card);
    color: var(--foreground);
  }

  dialog::backdrop { background: rgb(0 0 0 / .8); }
  h2 { margin: 0; font-size: 24px; }
  .dialog-heading, .dialog-actions { display: flex; align-items: center; gap: 12px; }
  .dialog-heading { justify-content: space-between; }
  .dialog-actions { justify-content: flex-end; margin-top: 24px; flex-wrap: wrap; }
  form, fieldset { margin: 0; padding: 0; border: 0; min-width: 0; }
  .style-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0 16px; }
  label { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; margin-top: 16px; }
  input { margin-bottom: 0; background: var(--background); }
  select, textarea { width: 100%; min-width: 0; padding: 10px; border: 1px solid var(--border); border-radius: 4px; background: var(--background); color: var(--foreground); font: inherit; }
  textarea { resize: vertical; }
  @media (max-width: 639px)
  {
    dialog { padding: 20px; }
    .style-grid { grid-template-columns: minmax(0, 1fr); }
  }
</style>
