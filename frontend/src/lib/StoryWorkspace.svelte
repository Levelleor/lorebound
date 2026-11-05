<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { host } from './host';
  import { StoryCoordinator, type CoordinatorState } from './coordinator';
  import type { Snapshot } from './library';

  export let snapshot: Snapshot;
  export let mobileHidden = false;
  export let onUpdate: (value: { snapshot: Snapshot; status: string; locked: boolean }) => void;
  let coordinator: StoryCoordinator;
  let state: CoordinatorState | null = null;
  let input: HTMLTextAreaElement;
  let candidateSection: HTMLElement;
  let acceptButton: HTMLButtonElement;

  async function generate()
  {
    await coordinator.generate();
    await tick();
    candidateSection?.scrollIntoView({ block: 'nearest' });
    if (state?.phase === 'ready') acceptButton?.focus();
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
    if (!(event.ctrlKey || event.metaKey) || event.key !== 'Enter') return;
    if (state?.phase !== 'idle' || state.refreshing) return;
    event.preventDefault();
    void generate();
  }

  onMount(() =>
  {
    const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('lorebound-story-changes');
    let lastVersion = snapshot.adventure.version;
    let lastEpoch = snapshot.epoch;
    const publish = (next: CoordinatorState) =>
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
        : next.input ? 'Unsaved input' : '✓ Saved';
      onUpdate({ snapshot: next.snapshot, status, locked: next.phase === 'saving' || next.phase === 'uncertain' });
    };
    coordinator = new StoryCoordinator(snapshot, {
      storage: host,
      onChange: publish
    });
    publish(coordinator.state);
    const refresh = () => coordinator.requestRefresh();
    if (channel) channel.onmessage = event =>
    {
      if (event.data?.adventureId === snapshot.adventure.id) refresh();
    };
    window.addEventListener('focus', refresh);
    return () =>
    {
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
        </section>
      {/each}
      {#if state.phase === 'generating'}
        <section class="provisional" aria-label="Generating proposal"><p class="passage-label">Simulated generation</p><p class="prose">Preparing a proposed continuation…</p><p class="supporting">Nothing has been added to your story.</p></section>
      {:else if state.candidate}
        <section class="provisional" bind:this={candidateSection} aria-label="Proposed turn">
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
          disabled={!state || state.phase !== 'idle'}
          oninput={(event) => coordinator.setInput(event.currentTarget.value)}
          onkeydown={handleInputKey}></textarea>
        {#if state?.phase === 'ready' || state?.phase === 'saving' || state?.phase === 'uncertain'}
          <div class="pending-overlay" aria-label="Turn acceptance">
            <p>{state.phase === 'saving' ? 'Saving your accepted turn…' : state.phase === 'uncertain' ? 'Confirm the save before continuing.' : 'Accept both passages into your story?'}</p>
            <div class="pending-actions">
              {#if state.phase === 'uncertain'}<button class="primary" onclick={() => coordinator.retrySave()}>Recover save</button>
              {:else}<button class="primary" bind:this={acceptButton} onclick={() => coordinator.accept()} disabled={state.phase === 'saving'}>Accept turn</button>{/if}
              <button onclick={discard} disabled={state.phase !== 'ready'}>Discard</button>
            </div>
          </div>
        {:else if state?.phase === 'generating'}
          <button class="send stop" aria-label="Stop generation" onclick={stop}>■</button>
        {:else if state?.phase === 'blocked'}
          <div class="pending-overlay"><p>Story writes are unavailable.</p><button onclick={() => coordinator.refresh()}>Reload story</button></div>
        {:else}
          <button class="send primary" aria-label="Generate continuation" onclick={generate} disabled={!state?.input.trim() || state.refreshing}>↑</button>
        {/if}
      </div>
      <p class="composer-hint">{state?.phase === 'idle' ? 'Ctrl / ⌘ + Enter to generate. Input is not saved until you accept.' : 'Only accepted passages are saved. World tracking is not available yet.'}</p>
    </div>
  </div>
</main>
