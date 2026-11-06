<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { host } from './host';
  import { ForkController, type ForkState } from './fork';
  import type { Snapshot } from './library';

  export let snapshot: Snapshot;
  export let onClose: () => void;
  export let onCreated: (snapshot: Snapshot) => void;
  let dialog: HTMLDialogElement;
  let controller: ForkController;
  let submitButton: HTMLButtonElement;
  let cancelButton: HTMLButtonElement;
  let disposed = false;
  let state: ForkState = { phase: 'editing', error: '' };
  let turnId = snapshot.turns.at(-1)!.id;
  let title = [...`${snapshot.adventure.title} — Fork`].slice(0, 160).join('');
  $: locked = state.phase === 'saving' || state.phase === 'uncertain';

  async function publish(next: ForkState)
  {
    state = next;
    await tick();
    if (disposed || state !== next) return;
    if (next.phase === 'saving') dialog.focus();
    else if (next.phase === 'uncertain') submitButton?.focus();
    else if (next.phase === 'rejected') cancelButton?.focus();
  }

  function trapFocus(event: KeyboardEvent)
  {
    if (event.key !== 'Tab') return;
    const controls = dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled)');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first)
    {
      event.preventDefault();
      dialog.focus();
      return;
    }
    if (event.shiftKey && document.activeElement === first)
    {
      event.preventDefault();
      last.focus();
    }
    else if (!event.shiftKey && document.activeElement === last)
    {
      event.preventDefault();
      first.focus();
    }
  }

  async function submit()
  {
    const created = await controller.submit(turnId, title);
    if (created) onCreated(created);
  }

  function cancel(event: Event)
  {
    event.preventDefault();
    if (!locked) onClose();
  }

  function handleSubmit(event: SubmitEvent)
  {
    event.preventDefault();
    void submit();
  }

  onMount(() =>
  {
    controller = new ForkController(snapshot, host, next => void publish(next));
    dialog.showModal();
    return () =>
    {
      disposed = true;
      controller.dispose();
    };
  });
</script>

<dialog bind:this={dialog} tabindex="-1" onkeydown={trapFocus} aria-labelledby="fork-heading" oncancel={cancel}>
  <h2 id="fork-heading">Fork story</h2>
  <p>Create a separate adventure through the selected accepted turn. Your original story stays intact.</p>
  <form onsubmit={handleSubmit}>
    <label for="fork-turn">Fork through turn</label>
    <select id="fork-turn" bind:value={turnId} disabled={state.phase !== 'editing'}>
      {#each snapshot.turns as turn}<option value={turn.id}>Turn {turn.order}</option>{/each}
    </select>
    <label for="fork-title">New adventure title</label>
    <input id="fork-title" bind:value={title} maxlength="160" disabled={state.phase !== 'editing'} />
    <p class="supporting">Only accepted passages are copied. Unsent input and provisional output stay out of the fork.</p>
    {#if state.error}<p role="alert">{state.error}</p>{/if}
    <div class="dialog-actions">
      <button type="button" bind:this={cancelButton} onclick={onClose} disabled={locked}>Cancel</button>
      {#if state.phase !== 'rejected'}
        <button class="primary" bind:this={submitButton} type="submit" disabled={state.phase === 'saving' || state.phase === 'complete'}>{state.phase === 'saving' ? 'Creating fork…' : state.phase === 'uncertain' ? 'Recover fork' : 'Create fork'}</button>
      {/if}
    </div>
  </form>
</dialog>

<style>
  dialog { width: min(560px, calc(100vw - 32px)); max-height: 90dvh; overflow: auto; background: var(--background); color: var(--foreground); border: 1px solid var(--border); border-radius: 4px; padding: 24px; }
  dialog::backdrop { background: oklch(0.1 0.01 60 / .75); }
  h2 { margin-top: 0; font-size: 24px; }
  p { line-height: 1.6; }
  form { padding-bottom: 0; border-bottom: 0; }
  select { width: 100%; margin-bottom: 16px; padding: 12px; border: 1px solid var(--border); border-radius: 4px; background: var(--card); color: var(--foreground); font: inherit; }
  .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; flex-wrap: wrap; }
  [role='alert'] { border-left: 2px solid var(--destructive); padding-left: 12px; }
</style>
