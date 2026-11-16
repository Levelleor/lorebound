<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { host } from './host';
  import { StoryCoordinator, simulatedGeneration, type CoordinatorState, type Generator } from './coordinator';
  import { schemaVersion, type Snapshot } from './library';
  import { ForkController, defaultForkTitle, type ForkState } from './fork';
  import type { TextSelection } from './textHistory';
  import { SessionSaveRecovery } from './saveRecovery';
  import { SessionForkRecovery } from './forkRecovery';
  import { modelError } from './models';
  import GenerationInspector from './GenerationInspector.svelte';
  import NarrationSettings from './NarrationSettings.svelte';
  import { autoSize } from './autoSize';
  import { keepCaretInView } from './keepCaretInView';

  export let snapshot: Snapshot;
  export let mobileHidden = false;
  export let generateNarration: Generator = simulatedGeneration;
  export let sourceLabel = 'Simulated generation · No AI connected';
  export let canStream = false;
  let streamOutput = false;
  export let onUpdate: (value: { snapshot: Snapshot; status: string; locked: boolean; modelLocked: boolean }) => void;
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
  let undoButton: HTMLButtonElement;
  let confirmUndoButton: HTMLButtonElement;
  let passageInput: HTMLTextAreaElement;
  let reviewEditButton: HTMLButtonElement;
  let keepLaterButton: HTMLButtonElement;
  let narrationOpen = false;
  let narrationBusy = false;
  let narrationButton: HTMLButtonElement;
  let mainWidth = 0;
  let storyWidth = 0;
  let mainHeight = 0;
  let composerBaseHeight = 0;
  let composerHeight = 0;
  let inputHeight = 0;
  let narrationHeight = 0;
  let composerViewport: HTMLDivElement;
  $: inputBudget = Math.min(240, Math.max(160, mainHeight * .4));
  $: composerControlsHeight = Math.max(0, composerBaseHeight - inputHeight) + 2 * 16 + 1;
  $: composerOverflow = mainHeight > 0 && (inputHeight > inputBudget || composerBaseHeight + 2 * 16 + 1 > mainHeight);
  $: composerLimit = Math.min(mainHeight, composerControlsHeight + inputBudget + (narrationOpen ? narrationHeight : 0));
  $: editTargetMissing = state?.edit && !state.snapshot.turns.some(turn => turn.passages.some(passage => passage.id === state?.edit?.passageId));
  $: editHasContinuation = state?.edit && state.snapshot.turns.some(turn => turn.id === state?.edit?.turnId && turn.passages.some(passage => passage.source === 'generated'));
  $: detachedFork = forkState?.phase === 'blocked' || Boolean(forkState && forkTurnId && state && !state.snapshot.turns.some(turn => turn.id === forkTurnId));

  function editSelection(): TextSelection
  {
    return { start: passageInput.selectionStart, end: passageInput.selectionEnd, direction: passageInput.selectionDirection };
  }

  async function moveEditHistory(direction: 'undo' | 'redo')
  {
    const selection = coordinator.moveEditHistory(direction);
    const edit = coordinator.state.edit;
    // Also undo native history input when the browser cannot cancel beforeinput.
    passageInput.value = edit?.text ?? passageInput.value;
    if (!selection) return;
    await tick();
    if (state?.phase !== 'editing' || state.edit !== edit) return;
    passageInput.focus();
    passageInput.setSelectionRange(selection.start, selection.end, selection.direction);
  }

  function handleEditKey(event: KeyboardEvent)
  {
    if (event.isComposing || state?.edit?.composing || !(event.ctrlKey || event.metaKey) || event.altKey) return;
    const key = event.key.toLowerCase();
    if (key !== 'z' && !(key === 'y' && event.ctrlKey && !event.metaKey && !event.shiftKey)) return;
    event.preventDefault();
    void moveEditHistory(key === 'y' || event.shiftKey ? 'redo' : 'undo');
  }

  function handleEditBeforeInput(event: InputEvent)
  {
    if (event.inputType === 'historyUndo' || event.inputType === 'historyRedo')
    {
      if (!event.cancelable) return;
      event.preventDefault();
      void moveEditHistory(event.inputType === 'historyUndo' ? 'undo' : 'redo');
      return;
    }
    coordinator.selectEditText(editSelection());
  }

  function handleEditInput(event: Event)
  {
    const inputType = (event as InputEvent).inputType;
    if (inputType === 'historyUndo' || inputType === 'historyRedo')
    {
      void moveEditHistory(inputType === 'historyUndo' ? 'undo' : 'redo');
      return;
    }
    coordinator.setEditText(passageInput.value, editSelection());
  }

  async function startEdit(passageId: string)
  {
    if (narrationOpen) return;
    await coordinator.startEdit(passageId);
    await tick();
    passageInput?.focus();
  }

  async function reviewEdit()
  {
    coordinator.reviewEdit();
    await tick();
    keepLaterButton?.focus();
  }

  async function continueEditing()
  {
    coordinator.continueEditing();
    await tick();
    passageInput?.focus();
  }

  async function discardEdit()
  {
    const passageId = state?.edit?.passageId;
    await coordinator.discardEdit();
    await tick();
    document.querySelector<HTMLButtonElement>(`[data-edit-passage="${passageId}"]`)?.focus();
  }

  async function confirmEdit(later: 'keep' | 'truncate')
  {
    await coordinator.confirmEdit(later);
    await tick();
    if (state?.phase === 'idle') input?.focus();
  }

  async function requestUndo()
  {
    if (narrationOpen) return;
    coordinator.requestUndo();
    await tick();
    confirmUndoButton?.focus();
  }

  async function confirmUndo()
  {
    await coordinator.confirmUndo();
    await tick();
    if (state?.phase === 'idle') input?.focus();
  }

  async function cancelUndo()
  {
    coordinator.discard();
    await tick();
    undoButton?.focus();
  }

  function handleWorkspaceKey(event: KeyboardEvent)
  {
    if (event.key === 'Escape' && state?.phase === 'edit-ready')
    {
      event.preventDefault();
      void continueEditing();
      return;
    }
    if (event.key !== 'Escape' || state?.phase !== 'undo-ready') return;
    event.preventDefault();
    void cancelUndo();
  }

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
    if (!forkController || !state || state.phase !== 'idle' || state.refreshing) return;
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

  function initializeFork(source: Snapshot)
  {
    forkController?.dispose();
    forkController = new ForkController(source, host, next =>
    {
      forkState = next;
      forkTurnId = next.turnId || forkTurnId;
      forkBusy = next.phase === 'saving' || next.phase === 'uncertain' || next.phase === 'blocked';
      publish(coordinator.state);
      if (next.phase === 'rejected' || next.phase === 'blocked' || (next.phase === 'editing' && next.error))
      {
        waitingForkTab()?.close();
        forkTarget = null;
      }
      if (next.phase === 'complete' || next.phase === 'rejected') coordinator.requestRefresh();
    }, undefined, new SessionForkRecovery(() => window.sessionStorage));
    forkController.restore();
  }

  async function openFork(turnId: string)
  {
    if (!state || narrationOpen || forkBusy || state.phase !== 'idle' || state.refreshing || state.projection.blocked) return;
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
    initializeFork(state.snapshot);
    if (forkController?.state.phase !== 'editing')
    {
      waitingForkTab()?.close();
      forkTarget = null;
      return;
    }
    await saveFork();
  }

  async function generate()
  {
    if (narrationOpen) return;
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
    if (event.isComposing) return;
    if (!(event.ctrlKey || event.metaKey) || event.key !== 'Enter') return;
    if (forkBusy || narrationOpen || state?.phase !== 'idle' || state.refreshing) return;
    event.preventDefault();
    void generate();
  }

  function toggleNarration()
  {
    if (forkBusy || narrationBusy || state?.phase !== 'idle' || state.refreshing) return;
    narrationOpen = !narrationOpen;
    publish(coordinator.state);
  }

  async function closeNarration()
  {
    narrationOpen = false;
    narrationBusy = false;
    publish(coordinator.state);
    await tick();
    narrationButton?.focus({ preventScroll: true });
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
      const status = forkBusy ? forkState?.phase === 'saving' ? 'Creating fork…' : 'Fork needs recovery'
        : next.phase === 'saving' ? 'Saving…'
        : next.phase === 'uncertain' ? 'Save unconfirmed'
        : next.phase === 'generating' ? next.preview ? 'Streaming · not saved' : 'Generating…'
        : next.phase === 'ready' ? 'Proposed · not saved'
        : next.edit ? 'Draft edit'
        : next.refreshing ? 'Refreshing…'
        : next.phase === 'blocked' || next.phase === 'recovery-blocked' ? 'Read only'
        : next.error ? 'Needs attention'
        : next.draftStatus === 'loading' ? 'Loading draft…'
        : next.draftStatus === 'saving' ? 'Saving draft…'
        : next.draftStatus === 'error' ? 'Draft needs attention'
        : next.draftStatus === 'unsaved' ? 'Unsaved input'
        : next.input ? 'Draft saved' : '✓ Saved';
      onUpdate({ snapshot: next.snapshot, status, locked: narrationOpen || forkBusy || next.phase === 'saving' || next.phase === 'uncertain',
        modelLocked: narrationOpen || forkBusy || next.phase !== 'idle' });
    };
    coordinator = new StoryCoordinator(snapshot, {
      storage: host,
      draftStorage: host,
      recoveryStorage: new SessionSaveRecovery(() => window.sessionStorage),
      generate: (request, signal, onProgress, onDiagnostics) => generateNarration(request, signal, canStream && streamOutput ? onProgress : undefined, onDiagnostics),
      generationError: modelError,
      onChange: publish
    });
    publish(coordinator.state);
    initializeFork(snapshot);
    const refresh = () =>
    {
      if (!forkBusy) coordinator.requestRefresh();
      if (coordinator.state.phase === 'editing') void coordinator.editDraft?.restore();
    };
    if (channel) channel.onmessage = event =>
    {
      if (event.data?.adventureId === snapshot.adventure.id) refresh();
    };
    window.addEventListener('focus', refresh);
    const abandonGeneration = () => coordinator.discard();
    window.addEventListener('pagehide', abandonGeneration);
    return () =>
    {
      forkController?.dispose();
      const target = waitingForkTab();
      if (target) target.location.replace(window.location.origin);
      coordinator.dispose();
      channel?.close();
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pagehide', abandonGeneration);
    };
  });
</script>

<svelte:window onkeydown={handleWorkspaceKey} />

{#snippet forkFeedback()}
  <div class="fork-feedback">
    {#if forkState?.phase === 'saving'}<p class="supporting" role="status">Creating fork…</p>{/if}
    {#if forkState?.phase === 'uncertain'}<button onclick={saveFork} disabled={state?.phase !== 'idle' || state.refreshing}>Recover fork</button>{/if}
    {#if forkState?.phase === 'blocked'}<button onclick={() => forkController?.restore()}>Retry fork recovery access</button>{/if}
    {#if forkUrl}<a href={forkUrl} target="_blank" rel="noopener">Open fork</a>{/if}
    {#if forkError || forkState?.error}
      <div class="story-error" role="alert">
        <p>{forkError || forkState?.error}</p>
        {#if forkError || forkState?.phase === 'rejected' || forkState?.phase === 'editing'}<button class="quiet" onclick={dismissForkError}>Dismiss</button>{/if}
      </div>
    {/if}
  </div>
{/snippet}

<main class:mobile-hidden={mobileHidden} class="story-pane" bind:clientWidth={mainWidth} bind:clientHeight={mainHeight}
  style:--scrollbar-width={`${Math.max(8, mainWidth - storyWidth)}px`} style:--composer-height={`${composerHeight}px`}
  style:--narration-height={`${Math.max(0, mainHeight - composerBaseHeight - 2 * 16 - 2)}px`} style:--composer-limit={`${composerLimit}px`}>
  <div class="story-scroll" bind:clientWidth={storyWidth}>
    <article class="reader" aria-label="Story reader">
      <header class="story-heading">
        <p class="eyebrow">Adventure · Turn {state?.snapshot.turns.at(-1)?.order ?? 0}</p>
        <h1 tabindex="-1">{snapshot.adventure.title}</h1>
      </header>
      {#if state}
        {#if detachedFork}
          <section class="provisional" aria-label="Fork recovery">
            <p class="passage-label">Previous fork{forkState?.turnOrder ? ` · Turn ${forkState.turnOrder}` : ''}</p>
            <p class="supporting">Check the original fork before continuing. Your current saved story is shown below.</p>
            {@render forkFeedback()}
          </section>
        {/if}
        {#if state.recovery}
          <section class="provisional" aria-label="Save recovery">
            <p class="passage-label">Previous save · {state.recovery.summary}</p>
            <p class="supporting">Your current saved story is shown below. Retained text is available to copy while you check this save.</p>
            {#if state.recovery.text}
              <label class="sr-only" for="save-recovery-text">Retained save text</label>
              <textarea id="save-recovery-text" class="recovery-text" rows="4" readonly value={state.recovery.text}></textarea>
            {/if}
          </section>
        {/if}
        {#if state.edit && editTargetMissing}
          <section class="editing" aria-label="Retained passage edit">
            <p class="supporting">This passage is no longer in the current story. Copy any text you want to keep before closing the edit.</p>
            <label class="sr-only" for="retained-edit">Retained edit text</label>
            <textarea id="retained-edit" class="passage-editor" rows="7" readonly value={state.edit.text}></textarea>
          </section>
        {/if}
        {#if state.snapshot.turns.length === 0}
          <div class="empty-story"><span aria-hidden="true">✧</span><p>No passages yet.</p><p class="supporting">A blank beginning, ready for your story.</p></div>
        {/if}
        {#each state.snapshot.turns as turn (turn.id)}
          <section class="accepted-turn" data-turn-id={turn.id} aria-label={`Accepted turn ${turn.order}`}>
            <p class="turn-label"><span class="confirmed">✓ Accepted</span> · Turn {turn.order}</p>
            {#each turn.passages as passage (passage.id)}
              <div class:authored={passage.source === 'authored'} class:editing={state.edit?.passageId === passage.id} class="passage" data-passage-id={passage.id}>
                <p class="passage-label">{passage.source === 'authored' ? 'Story · You' : 'Continuation'}</p>
                {#if state.edit?.passageId === passage.id}
                  <label class="sr-only" for="passage-edit">Edit {passage.source === 'authored' ? 'Story text' : 'continuation'} for turn {turn.order}</label>
                  <textarea id="passage-edit" class="passage-editor" bind:this={passageInput} rows="7" value={state.edit.text}
                    readonly={state.phase !== 'editing' || state.edit.draftStatus === 'loading'}
                    onbeforeinput={handleEditBeforeInput} oninput={handleEditInput} onkeydown={handleEditKey}
                    onselect={() => coordinator.selectEditText(editSelection())}
                    oncompositionstart={() => coordinator.beginEditComposition(editSelection())}
                    oncompositionend={() => coordinator.endEditComposition(passageInput.value, editSelection())}></textarea>
                  <div class="edit-history" role="group" aria-label="Temporary passage edits">
                    <button class="quiet" onclick={() => moveEditHistory('undo')} disabled={state.phase !== 'editing' || state.edit.draftStatus === 'loading' || !state.edit.canUndo || state.edit.composing}>Undo edit</button>
                    <button class="quiet" onclick={() => moveEditHistory('redo')} disabled={state.phase !== 'editing' || state.edit.draftStatus === 'loading' || !state.edit.canRedo || state.edit.composing}>Redo edit</button>
                    <span class="supporting">Temporary edits in this session</span>
                  </div>
                  <details open={state.phase === 'edit-conflict' || Boolean(state.error)}>
                    <summary>Current accepted passage</summary>
                    {#each passage.body.content as paragraph}
                      <p class="prose">{#each paragraph.content as node}{#if node.type === 'text'}{node.text}{:else}<br />{/if}{/each}</p>
                    {/each}
                  </details>
                  <p class="supporting" role="status" aria-label="Passage draft status">{state.edit.draftError || (state.edit.draftStatus === 'saved' ? 'Passage draft saved · Not accepted.' : state.edit.draftStatus === 'loading' ? 'Loading passage draft…' : state.edit.draftStatus === 'saving' ? 'Saving passage draft…' : 'Editing · Not accepted. Autosaves after a short pause.')}</p>
                  {#if state.edit.draftError}<button class="quiet" onclick={() => coordinator.editDraft?.retry()} disabled={state.phase !== 'editing'}>Retry passage draft</button>{/if}
                {:else}
                  {#each passage.body.content as paragraph}
                    <p class="prose">{#each paragraph.content as node}{#if node.type === 'text'}{node.text}{:else}<br />{/if}{/each}</p>
                  {/each}
                  <button class="quiet edit-passage" data-edit-passage={passage.id} aria-label={`Edit ${passage.source === 'authored' ? 'Story text' : 'continuation'} for turn ${turn.order}`}
                    onclick={() => startEdit(passage.id)} disabled={narrationOpen || forkBusy || state.phase !== 'idle' || state.refreshing || state.draftStatus === 'loading'}>✎ Edit</button>
                {/if}
              </div>
            {/each}
            <div class="turn-actions">
              <button class="quiet fork-action" aria-label={`Fork from turn ${turn.order}`} title={`Fork from turn ${turn.order} in a new tab`}
                onclick={() => openFork(turn.id)} disabled={narrationOpen || forkBusy || state.phase !== 'idle' || state.refreshing}>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="6" cy="5" r="2.5" /><circle cx="6" cy="19" r="2.5" /><circle cx="18" cy="5" r="2.5" />
                  <path d="M6 7.5v9M18 7.5v1a5 5 0 0 1-5 5H6" />
                </svg>
              </button>
              {#if turn.id === state.snapshot.turns.at(-1)?.id}
                <button class="quiet undo-turn" bind:this={undoButton} aria-label={`Undo turn ${turn.order}`} onclick={requestUndo}
                  disabled={narrationOpen || forkBusy || state.phase !== 'idle' || state.refreshing || state.draftStatus === 'loading'}>↶ Undo turn {turn.order}</button>
              {/if}
            </div>
            {#if forkTurnId === turn.id && !detachedFork}
              {@render forkFeedback()}
            {/if}
          </section>
        {/each}
        {#if state.phase === 'generating'}
          <section class="provisional" aria-label="Generating proposal" aria-busy="true">
            <p class="passage-label" role="status">{state.preview ? 'Streaming · Provisional · Not saved' : 'Waiting for a proposed continuation…'}</p>
            <p class="supporting model-source">{sourceLabel}</p>
            {#if state.preview}<p class="prose stream-preview">{state.preview}</p>{/if}
            <p class="supporting">Nothing has been added to your story. Stop discards this output.</p>
          </section>
        {:else if state.candidate}
          <section class="provisional" bind:this={candidateSection} data-turn-id={state.candidate.id} aria-label="Proposed turn">
            <p class="passage-label">{state.phase === 'uncertain' ? 'Save unconfirmed' : state.phase === 'saving' ? 'Saving…' : 'Proposed · Not saved'}</p>
            <p class="supporting model-source">{sourceLabel}</p>
            {#each state.candidate.passages as passage}
              <p class="passage-label">{passage.source === 'authored' ? 'Story · You' : 'Continuation'}</p>
              {#each passage.body.content as paragraph}
                <p class="prose">{#each paragraph.content as node}{#if node.type === 'text'}{node.text}{:else}<br />{/if}{/each}</p>
              {/each}
            {/each}
          </section>
        {/if}
        {#if state.diagnostics}<GenerationInspector diagnostics={state.diagnostics} />{/if}
      {/if}
    </article>
  </div>
  <div class="composer" class:oversized={composerOverflow} bind:this={composerViewport} bind:clientHeight={composerHeight}>
    <div class="composer-inner">
      {#if narrationOpen && state}
        <div bind:clientHeight={narrationHeight}>
          <NarrationSettings request={{ schemaVersion, epoch: state.snapshot.epoch, adventureId: state.snapshot.adventure.id }} scrollWithComposer={composerOverflow}
            onBusy={(value) => narrationBusy = value} onClose={closeNarration} />
        </div>
      {/if}
      <div class="composer-base" bind:clientHeight={composerBaseHeight}>
        {#if state?.error}<div class="story-error" role="alert">{state.error}</div>{/if}
        {#if state?.notice}<p class="story-notice" role="status">{state.notice}</p>{/if}
        <div class="composer-heading">
          <span class="mode-selected"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 12.2a6 6 0 0 0-8.4-8.4L3 12.5V21h8.5ZM16 8 2 22m15.5-7H9" /></svg>Story</span>
          <span class="supporting model-source" title={sourceLabel}>{sourceLabel}</span>
          <button class="narration-toggle" class:selected={narrationOpen} bind:this={narrationButton} aria-label="Narration style" title="Narration style"
            aria-expanded={narrationOpen} aria-controls="narration-style-panel" disabled={forkBusy || narrationBusy || state?.phase !== 'idle' || state.refreshing} onclick={toggleNarration}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></svg>
          </button>
        </div>
        {#if canStream}
          <label class="stream-option"><input type="checkbox" bind:checked={streamOutput} disabled={forkBusy || state?.phase !== 'idle' || state.refreshing} /><span>Stream output</span><span class="supporting">This session · Server support required</span></label>
        {/if}
        <div class="composer-input" class:undo-pending={Boolean(state?.undoTurn || state?.edit)} class:edit-pending={Boolean(state?.edit)}>
          <label class="sr-only" for="story-input">Story input</label>
          <textarea id="story-input" use:autoSize={state?.input} use:keepCaretInView={{ viewport: composerViewport, enabled: composerOverflow }} bind:this={input} bind:offsetHeight={inputHeight} rows="3" placeholder="Write what happens next…" value={state?.input ?? ''}
            disabled={forkBusy || !state || state.phase !== 'idle'}
            oninput={(event) => coordinator.setInput(event.currentTarget.value)}
            onkeydown={handleInputKey}></textarea>
          {#if state?.phase === 'recovery-blocked'}
            <div class="pending-overlay" aria-label="Save recovery unavailable">
              <p>Check the previous save before continuing.</p>
              <button class="primary" onclick={() => coordinator.restoreSave()}>Retry recovery access</button>
            </div>
          {:else if state?.recovery && (state.phase === 'uncertain' || state.phase === 'saving')}
            <div class="pending-overlay" aria-label="Save recovery controls">
              <p>{state.phase === 'saving' ? 'Checking the previous save…' : 'Recover the previously confirmed save before continuing.'}</p>
              <button class="primary" onclick={() => coordinator.retrySave()} disabled={state.phase === 'saving'}>Recover save</button>
            </div>
          {:else if state?.edit}
            <div class="pending-overlay edit-overlay" aria-label="Passage edit controls">
              <p>{state.phase === 'edit-conflict' ? 'The story changed. Review the current story before a fresh decision.' : state.phase === 'uncertain' ? 'Confirm this edit’s result before continuing.' : state.phase === 'saving' ? 'Saving passage edit…' : state.phase === 'discarding-edit' ? 'Discarding draft…' : `Uncommitted edit · Turn ${state.edit.order}`}</p>
              {#if state.phase === 'edit-ready'}
                <p class="supporting">{state.edit.source === 'authored' && editHasContinuation
                  ? `Keep the continuation and later turns unchanged, or permanently delete the continuation in Turn ${state.edit.order} and every later turn.`
                  : `Keep later turns unchanged, or permanently delete every turn after Turn ${state.edit.order}.`} Your edited passage stays. No previous version is retained.</p>
              {/if}
              <div class="pending-actions">
                {#if state.phase === 'editing'}
                  <button class="primary" bind:this={reviewEditButton} onclick={reviewEdit} disabled={state.edit.draftStatus === 'loading' || state.edit.composing}>Review edit</button>
                  <button onclick={discardEdit} disabled={state.edit.draftStatus === 'loading'}>Discard</button>
                {:else if state.phase === 'edit-ready'}
                  <button class="primary" bind:this={keepLaterButton} onclick={() => confirmEdit('keep')}>Keep Later Turns</button>
                  <button onclick={() => confirmEdit('truncate')}>Delete All After Point</button>
                  <button onclick={continueEditing}>Continue Editing</button>
                  <button onclick={discardEdit}>Discard</button>
                {:else if state.phase === 'edit-conflict'}
                  <button onclick={() => coordinator.reconsiderEdit()} disabled={state.refreshing}>Review against current story</button>
                  <button onclick={() => coordinator.closeConflictedEdit()} disabled={state.refreshing}>Close edit</button>
                {:else if state.phase === 'uncertain'}
                  <button class="primary" onclick={() => coordinator.retrySave()}>Recover edit</button>
                {/if}
              </div>
            </div>
          {:else if state?.phase === 'undo-ready' || ((state?.phase === 'saving' || state?.phase === 'uncertain') && state.undoTurn)}
            <div class="pending-overlay" aria-label="Turn Undo confirmation">
              <p>{state.phase === 'saving' ? 'Removing the accepted turn…' : state.phase === 'uncertain' ? 'Confirm the Undo result before continuing.' : `Remove turn ${state.undoTurn?.order} and return to ${state.undoTurn?.order === 1 ? 'the beginning' : `turn ${(state.undoTurn?.order ?? 1) - 1}`}?`}</p>
              {#if state.phase === 'undo-ready'}<p class="supporting">All saved passages in this turn will be permanently removed. Fork first to keep this future. Your unfinished input stays.</p>{/if}
              <div class="pending-actions">
                {#if state.phase === 'uncertain'}<button class="primary" onclick={() => coordinator.retrySave()}>Recover Undo</button>
                {:else}<button class="primary" bind:this={confirmUndoButton} onclick={confirmUndo} disabled={state.phase === 'saving'}>Confirm Undo</button>{/if}
                <button onclick={cancelUndo} disabled={state.phase !== 'undo-ready'}>Cancel</button>
              </div>
            </div>
          {:else if state?.phase === 'ready' || state?.phase === 'saving' || state?.phase === 'uncertain'}
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
            <button class="send stop" bind:this={stopButton} aria-label="Stop generation" onclick={stop}><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="5" width="14" height="14" rx="2" /></svg></button>
          {:else if state?.phase === 'blocked'}
            <div class="pending-overlay"><p>Story writes are unavailable.</p><button onclick={() => coordinator.refresh()}>Reload story</button></div>
          {:else}
            <button class="send primary" aria-label="Generate continuation" onclick={generate} disabled={narrationOpen || forkBusy || !state?.input.trim() || state.refreshing}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5m-7 7 7-7 7 7" /></svg></button>
          {/if}
        </div>
        <p class="composer-hint" role="status" aria-label="Draft status">{state?.draftError || (state?.phase === 'recovery-blocked' || (state?.recovery && (state.phase === 'saving' || state.phase === 'uncertain')) ? 'Input draft resumes after save recovery.' : state?.draftStatus === 'saved' ? 'Draft saved · Not accepted story.' : state?.draftStatus === 'saving' ? 'Saving draft…' : state?.draftStatus === 'loading' ? 'Loading saved draft…' : 'Input autosaves after a short pause.')}</p>
        {#if state?.draftError}
          <button class="quiet" onclick={() => coordinator.draft?.retry()}>Retry draft</button>
        {/if}
        <p class="composer-hint">Ctrl / ⌘ + Enter to generate. Only accepted passages join your story. Choose your source in Models.</p>
      </div>
    </div>
  </div>
</main>

<style>
  .story-pane { position: relative; display: grid; grid-template-rows: minmax(0, 1fr); min-height: 0; }
  .story-scroll { grid-area: 1 / 1; min-height: 0; overflow-y: auto; scrollbar-gutter: stable; scrollbar-width: thin; scrollbar-color: var(--border) var(--background); overflow-anchor: none; padding-bottom: var(--composer-height); scroll-padding: 16px 0 calc(var(--composer-height) + 16px); }
  .story-scroll > .reader { overflow: visible; }
  .story-heading { text-align: center; margin-bottom: 40px; }
  .story-heading .eyebrow { margin: 0; }
  .story-heading h1 { margin: 8px 0 0; line-height: 1.111; }
  .accepted-turn { margin: 0 0 32px; }
  .turn-label { font-family: var(--font-mono); font-size: 10px; }
  .composer { grid-area: 1 / 1; align-self: end; min-height: 0; max-height: 100%; overflow-y: auto; overflow-anchor: none; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: var(--border) transparent; margin-right: var(--scrollbar-width); z-index: 1; background: color-mix(in oklch, var(--card) 80%, var(--background)); }
  .composer.oversized { max-height: var(--composer-limit); }
  .composer-heading { display: grid; grid-template-columns: auto minmax(0, 1fr) 30px; align-items: center; gap: 12px; }
  .composer-heading .model-source { max-width: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; }
  .mode-selected { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; line-height: 20px; border-radius: 6px; box-shadow: 0 0 0 1px oklch(.76 .12 70 / .35), 0 8px 30px -10px oklch(.76 .12 70 / .35); }
  #story-input { max-height: none; overflow: hidden; resize: none; border-radius: 6px; }
  .send { display: grid; place-items: center; }
  .send.primary { box-shadow: 0 0 0 1px oklch(.76 .12 70 / .35), 0 8px 30px -10px oklch(.76 .12 70 / .35); }
  .composer .story-error { max-height: none; overflow: visible; }
  .narration-toggle { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; width: 30px; height: 30px; padding: 5px; color: var(--muted-foreground); }
  .narration-toggle.selected { color: var(--primary); border-color: var(--primary); }
  .stream-preview { white-space: pre-wrap; overflow-wrap: anywhere; }
  .stream-option { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 12px; line-height: 18px; margin: 0 0 12px; }
  .stream-option input { flex: none; width: 14px; height: 14px; margin: 0; padding: 0; accent-color: var(--primary); }
  @media (max-width: 639px)
  {
    .stream-option .supporting { flex-basis: 100%; padding-left: 22px; font-size: 11px; }
  }
  .recovery-text { width: 100%; box-sizing: border-box; padding: 8px; background: transparent; color: var(--ink); resize: vertical; }
  .editing { border-left: 2px solid var(--primary); padding-left: 12px; }
  .passage-editor { width: 100%; box-sizing: border-box; padding: 12px 16px; color: var(--ink); background: transparent; font-family: var(--font-prose); font-size: 21px; line-height: 1.625; resize: vertical; min-height: 180px; }
  .edit-passage { font-size: 12px; margin-top: 8px; }
  .edit-history { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 8px 0; }
  .edit-history button { font-size: 12px; }
  .edit-overlay { overflow-y: auto; }
  .edit-overlay .pending-actions { flex-wrap: wrap; justify-content: center; width: 100%; }
  .edit-overlay .pending-actions button { flex: 1 1 130px; }
  @media (max-width: 639px)
  {
    .composer-input.edit-pending { min-height: 250px; }
  }
  .undo-pending { min-height: 200px; }
  .undo-turn { font-size: 12px; }
  .story-notice { color: var(--success); font-size: 12px; }
  .turn-actions { display: flex; align-items: center; gap: 12px; margin-top: 12px; min-height: 32px; }
  .fork-action { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 6px; }
  .fork-feedback { margin-top: 8px; }
  .fork-feedback a { color: var(--primary); font-size: 12px; }
</style>
