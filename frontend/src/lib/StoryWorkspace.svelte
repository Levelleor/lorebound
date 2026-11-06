<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { host } from './host';
  import { StoryCoordinator, type CoordinatorState } from './coordinator';
  import type { Snapshot } from './library';
  import { ForkController, defaultForkTitle, type ForkState } from './fork';
  import type { InputSelection } from './inputHistory';

  export let snapshot: Snapshot;
  export let mobileHidden = false;
  export let onUpdate: (value: { snapshot: Snapshot; status: string; locked: boolean }) => void;
  let coordinator: StoryCoordinator;
  let state: CoordinatorState | null = null;
  let input: HTMLTextAreaElement;
  let candidateSection: HTMLElement;
  let acceptButton: HTMLButtonElement;
  let stopButton: HTMLButtonElement;
  let forkController: ForkController | null = null;
  let forkState: ForkState | null = null;
  let forkTarget: Window | null = null;
  let forkTurnId = '';
  let forkUrl = '';
  let forkError = '';
  let forkBusy = false;
  let publish: (next: CoordinatorState) => void;
  let composing = false;
  let compositionChanged = false;

  function waitingForkTab(): Window | null
  {
    try
    {
      return forkTarget && !forkTarget.closed && forkTarget.location.href === 'about:blank' ? forkTarget : null;
    }
    catch
    {
      return null;
    }
  }

  function showForkProgress(target: Window, message: string)
  {
    const progress = target.document.createElement('p');
    progress.textContent = message;
    const libraryLink = target.document.createElement('a');
    libraryLink.href = window.location.origin;
    libraryLink.textContent = 'Open adventure library';
    libraryLink.style.color = 'inherit';
    target.document.body.replaceChildren(progress, libraryLink);
  }

  function dismissForkError()
  {
    forkError = '';
    forkState = null;
  }

  async function saveFork()
  {
    if (!forkController || !state) return;
    const created = await forkController.submit(forkTurnId, defaultForkTitle(state.snapshot.adventure.title));
    const target = waitingForkTab();
    if (!created)
    {
      if (target && forkState?.phase === 'uncertain') showForkProgress(target, 'Return to the original Lorebound tab to recover this fork.');
      return;
    }
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('adventure', created.adventure.id);
    forkUrl = url.href;
    if (target) target.location.replace(forkUrl);
    forkTarget = null;
  }

  async function openFork(turnId: string)
  {
    if (!state || forkBusy || state.phase !== 'idle' || state.refreshing || state.projection.blocked) return;
    forkTurnId = turnId;
    forkUrl = '';
    forkError = '';
    forkState = null;
    // Reserve the tab inside the click's user activation, before awaiting storage.
    forkTarget = window.open('about:blank', '_blank');
    if (!forkTarget)
    {
      forkError = 'Allow pop-ups for Lorebound, then try this fork again. No adventure was created.';
      return;
    }
    forkTarget.opener = null;
    forkTarget.document.title = 'Creating fork — Lorebound';
    showForkProgress(forkTarget, 'Creating your fork…');
    const colors = getComputedStyle(document.documentElement);
    Object.assign(forkTarget.document.body.style, {
      background: colors.getPropertyValue('--background'),
      color: colors.getPropertyValue('--foreground'),
      font: '16px system-ui, sans-serif',
      padding: '32px'
    });
    forkController?.dispose();
    forkController = new ForkController(state.snapshot, host, next =>
    {
      forkState = next;
      forkBusy = next.phase === 'saving' || next.phase === 'uncertain';
      publish(coordinator.state);
      if (next.phase === 'rejected' || (next.phase === 'editing' && next.error))
      {
        waitingForkTab()?.close();
        forkTarget = null;
      }
      if (next.phase === 'complete' || next.phase === 'rejected') coordinator.requestRefresh();
    });
    await saveFork();
  }

  async function generate()
  {
    await coordinator.generate();
    await tick();
    candidateSection?.scrollIntoView({ block: 'nearest' });
    if (state?.phase === 'ready') acceptButton?.focus();
  }

  async function retry()
  {
    const replacement = coordinator.retry();
    await tick();
    stopButton?.focus();
    await replacement;
    await tick();
    candidateSection?.scrollIntoView({ block: 'nearest' });
    if (state?.phase === 'ready') acceptButton?.focus();
    else if (state?.phase === 'idle') input?.focus();
  }

  async function discard()
  {
    coordinator.discard();
    await tick();
    input?.focus();
  }

  async function stop()
  {
    coordinator.stop();
    await tick();
    input?.focus();
  }

  function handleInputKey(event: KeyboardEvent)
  {
    if (event.isComposing || composing || event.altKey) return;
    if ((event.ctrlKey || event.metaKey) && ['z', 'y'].includes(event.key.toLowerCase()))
    {
      event.preventDefault();
      void moveInputHistory(event.key.toLowerCase() === 'y' || event.shiftKey);
      return;
    }
    if (!(event.ctrlKey || event.metaKey) || event.key !== 'Enter') return;
    if (forkBusy || state?.phase !== 'idle' || state.refreshing) return;
    event.preventDefault();
    void generate();
  }

  function inputSelection(): InputSelection
  {
    return { start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection };
  }

  async function moveInputHistory(redo: boolean)
  {
    if (forkBusy || composing || state?.phase !== 'idle') return;
    const selection = redo ? coordinator.redoInput() : coordinator.undoInput();
    await tick();
    // Also override an uncancellable native history input at an exhausted boundary.
    input.value = coordinator.state.input;
    input.focus();
    if (selection) input.setSelectionRange(selection.start, selection.end, selection.direction);
  }

  function handleBeforeInput(event: InputEvent)
  {
    if (event.inputType === 'historyUndo' || event.inputType === 'historyRedo')
    {
      if (event.cancelable)
      {
        event.preventDefault();
        void moveInputHistory(event.inputType === 'historyRedo');
      }
      return;
    }
    coordinator.selectInput(inputSelection());
  }

  function handleInput(event: Event)
  {
    const inputType = (event as InputEvent).inputType;
    if (inputType === 'historyUndo' || inputType === 'historyRedo')
    {
      void moveInputHistory(inputType === 'historyRedo');
      return;
    }
    const changed = input.value !== coordinator.state.input;
    coordinator.setInput(input.value, inputSelection(), composing && compositionChanged);
    if (composing && changed) compositionChanged = true;
  }

  onMount(() =>
  {
    const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('lorebound-story-changes');
    let lastVersion = snapshot.adventure.version;
    let lastEpoch = snapshot.epoch;
    publish = (next: CoordinatorState) =>
    {
      if (next.snapshot.adventure.version !== lastVersion || next.snapshot.epoch !== lastEpoch)
      {
        lastVersion = next.snapshot.adventure.version;
        lastEpoch = next.snapshot.epoch;
        channel?.postMessage({ adventureId: next.snapshot.adventure.id });
      }
      state = next;
      const status = next.phase === 'saving' ? 'Saving…'
        : next.phase === 'uncertain' ? 'Save unconfirmed'
        : next.phase === 'generating' ? 'Generating · simulated'
        : next.phase === 'ready' ? 'Proposed · not saved'
        : next.refreshing ? 'Refreshing…'
        : next.phase === 'blocked' ? 'Read only'
        : next.error ? 'Needs attention'
        : next.draftStatus === 'loading' ? 'Loading draft…'
        : next.draftStatus === 'saving' ? 'Saving draft…'
        : next.draftStatus === 'error' ? 'Draft needs attention'
        : next.draftStatus === 'unsaved' ? 'Unsaved input'
        : next.input ? 'Draft saved' : '✓ Saved';
      onUpdate({ snapshot: next.snapshot, status, locked: forkBusy || next.phase === 'saving' || next.phase === 'uncertain' });
    };
    coordinator = new StoryCoordinator(snapshot, {
      storage: host,
      draftStorage: host,
      onChange: publish
    });
    publish(coordinator.state);
    const refresh = () =>
    {
      if (!forkBusy) coordinator.requestRefresh();
    };
    if (channel) channel.onmessage = event =>
    {
      if (event.data?.adventureId === snapshot.adventure.id) refresh();
    };
    window.addEventListener('focus', refresh);
    return () =>
    {
      forkController?.dispose();
      const target = waitingForkTab();
      if (target) target.location.replace(window.location.origin);
      coordinator.dispose();
      channel?.close();
      window.removeEventListener('focus', refresh);
    };
  });
</script>

<main class:mobile-hidden={mobileHidden} class="story-pane">
  <article class="reader" aria-label="Story reader">
    <p class="eyebrow">Your adventure</p>
    <h1 tabindex="-1">{snapshot.adventure.title}</h1>
    {#if state}
      {#if state.snapshot.turns.length === 0}
        <div class="empty-story"><span aria-hidden="true">✧</span><p>No passages yet.</p><p class="supporting">A blank beginning, ready for your story.</p></div>
      {/if}
      {#each state.snapshot.turns as turn (turn.id)}
        <section class="accepted-turn" data-turn-id={turn.id} aria-label={`Accepted turn ${turn.order}`}>
          <p class="turn-label"><span class="confirmed">✓ Accepted</span> · Turn {turn.order}</p>
          {#each turn.passages as passage (passage.id)}
            <div class:authored={passage.source === 'authored'} class="passage" data-passage-id={passage.id}>
              <p class="passage-label">{passage.source === 'authored' ? 'Story · You' : 'Simulated continuation'}</p>
              {#each passage.body.content as paragraph}
                <p class="prose">{#each paragraph.content as node}{#if node.type === 'text'}{node.text}{:else}<br />{/if}{/each}</p>
              {/each}
            </div>
          {/each}
          <div class="turn-actions">
            <button class="quiet fork-action" aria-label={`Fork from turn ${turn.order}`} title={`Fork from turn ${turn.order} in a new tab`}
              onclick={() => openFork(turn.id)} disabled={forkBusy || state.phase !== 'idle' || state.refreshing}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="6" cy="5" r="2.5" /><circle cx="6" cy="19" r="2.5" /><circle cx="18" cy="5" r="2.5" />
                <path d="M6 7.5v9M18 7.5v1a5 5 0 0 1-5 5H6" />
              </svg>
            </button>
            {#if forkTurnId === turn.id}
              {#if forkState?.phase === 'saving'}<span class="supporting" role="status">Creating fork…</span>{/if}
              {#if forkState?.phase === 'uncertain'}<button onclick={saveFork}>Recover fork</button>{/if}
              {#if forkUrl}<a href={forkUrl} target="_blank" rel="noopener">Open fork</a>{/if}
            {/if}
          </div>
          {#if forkTurnId === turn.id && (forkError || forkState?.error)}
            <div class="story-error" role="alert">
              <p>{forkError || forkState?.error}</p>
              {#if forkError || forkState?.phase === 'rejected' || forkState?.phase === 'editing'}<button class="quiet" onclick={dismissForkError}>Dismiss</button>{/if}
            </div>
          {/if}
        </section>
      {/each}
      {#if state.phase === 'generating'}
        <section class="provisional" aria-label="Generating proposal"><p class="passage-label">Simulated generation</p><p class="prose">Preparing a proposed continuation…</p><p class="supporting">Nothing has been added to your story.</p></section>
      {:else if state.candidate}
        <section class="provisional" bind:this={candidateSection} data-turn-id={state.candidate.id} aria-label="Proposed turn">
          <p class="passage-label">{state.phase === 'uncertain' ? 'Save unconfirmed' : state.phase === 'saving' ? 'Saving…' : 'Proposed · Not saved'}</p>
          {#each state.candidate.passages as passage}
            <p class="passage-label">{passage.source === 'authored' ? 'Story · You' : 'Simulated continuation'}</p>
            {#each passage.body.content as paragraph}
              <p class="prose">{#each paragraph.content as node}{#if node.type === 'text'}{node.text}{:else}<br />{/if}{/each}</p>
            {/each}
          {/each}
        </section>
      {/if}
    {/if}
  </article>
  <div class="composer">
    <div class="composer-inner">
      {#if state?.error}<div class="story-error" role="alert">{state.error}</div>{/if}
      <div class="composer-heading"><span class="mode-selected">✎ Story</span><span class="supporting">Simulated generation · No AI connected</span></div>
      <div class="composer-input">
        <label class="sr-only" for="story-input">Story input</label>
        <textarea id="story-input" bind:this={input} rows="3" placeholder="Write what happens next…" value={state?.input ?? ''}
          disabled={forkBusy || !state || state.phase !== 'idle'}
          oninput={handleInput}
          onbeforeinput={handleBeforeInput}
          onselect={() => coordinator.selectInput(inputSelection())}
          oncompositionstart={() => { composing = true; compositionChanged = false; }}
          oncompositionend={() => { composing = false; }}
          onkeydown={handleInputKey}></textarea>
        {#if state?.phase === 'ready' || state?.phase === 'saving' || state?.phase === 'uncertain'}
          <div class="pending-overlay" aria-label="Turn acceptance">
            <p>{state.phase === 'saving' ? 'Saving your accepted turn…' : state.phase === 'uncertain' ? 'Confirm the save before continuing.' : 'Accept both passages into your story?'}</p>
            <div class="pending-actions">
              {#if state.phase === 'uncertain'}<button class="primary" onclick={() => coordinator.retrySave()}>Recover save</button>
              {:else}<button class="primary" bind:this={acceptButton} onclick={() => coordinator.accept()} disabled={state.phase === 'saving'}>Accept turn</button>{/if}
              <button onclick={retry} disabled={state.phase !== 'ready'}>Retry</button>
              <button onclick={discard} disabled={state.phase !== 'ready'}>Discard</button>
            </div>
          </div>
        {:else if state?.phase === 'generating'}
          <button class="send stop" bind:this={stopButton} aria-label="Stop generation" onclick={stop}>■</button>
        {:else if state?.phase === 'blocked'}
          <div class="pending-overlay"><p>Story writes are unavailable.</p><button onclick={() => coordinator.refresh()}>Reload story</button></div>
        {:else}
          <button class="send primary" aria-label="Generate continuation" onclick={generate} disabled={forkBusy || !state?.input.trim() || state.refreshing}>↑</button>
        {/if}
      </div>
      <div class="input-history" role="group" aria-label="Temporary input history">
        <button class="quiet" aria-label="Undo input edit" onclick={() => moveInputHistory(false)} disabled={forkBusy || composing || !state?.canUndoInput}>↶ Undo input</button>
        <button class="quiet" aria-label="Redo input edit" onclick={() => moveInputHistory(true)} disabled={forkBusy || composing || !state?.canRedoInput}>↷ Redo input</button>
        <span class="supporting">Temporary edits only</span>
      </div>
      <p class="composer-hint" role="status" aria-label="Draft status">{state?.draftError || (state?.draftStatus === 'saved' ? 'Draft saved · Not accepted story.' : state?.draftStatus === 'saving' ? 'Saving draft…' : state?.draftStatus === 'loading' ? 'Loading saved draft…' : 'Input autosaves after a short pause.')}</p>
      {#if state?.draftError}
        <button class="quiet" onclick={() => coordinator.draft?.retry()}>Retry draft</button>
      {/if}
      <p class="composer-hint">Ctrl / ⌘ + Enter to generate. Only accepted passages join your story. Generation is simulated.</p>
    </div>
  </div>
</main>

<style>
  .input-history { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .input-history button { padding: 4px 8px; font-size: 12px; }
  .input-history .supporting { font-size: 11px; }
  .turn-actions { display: flex; align-items: center; gap: 12px; margin-top: 12px; min-height: 32px; }
  .fork-action { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 6px; }
  .turn-actions a { color: var(--primary); font-size: 12px; }
</style>
