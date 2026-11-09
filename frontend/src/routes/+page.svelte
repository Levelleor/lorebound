<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { host } from '../lib/host';
  import { prepareCreate, type Library, type Snapshot, type CreateRequest } from '../lib/library';
  import '../lib/appearance.css';
  import StoryWorkspace from '../lib/StoryWorkspace.svelte';
  import ConnectionSettings from '../lib/ConnectionSettings.svelte';
  import { ModelError, generateLocal, type Connections } from '../lib/models';
  import { simulatedGeneration, type GenerationInput } from '../lib/coordinator';

  let library: Library | null = null;
  let current: Snapshot | null = null;
  let title = '';
  let busy = true;
  let error = '';
  let pending: CreateRequest | null = null;
  let mobileView = 'story';
  let heading: HTMLHeadingElement;
  let loadSequence = 0;
  let storyStatus = '✓ Saved';
  let storyLocked = false;
  let modelLocked = false;
  let modelsOpen = false;
  let connections: Connections | null = null;
  let modelSequence = 0;
  $: activeProfile = connections?.profiles.find(profile => profile.id === connections?.activeProfileId);
  $: narrationLabel = !connections ? 'Models · Settings unavailable'
    : connections.mode === 'simulation' ? 'Simulated generation · No AI connected'
    : activeProfile ? `${activeProfile.name} · ${activeProfile.model}` : 'Local model · Choose a profile in Models';

  async function loadModels(epoch: string)
  {
    const sequence = ++modelSequence;
    connections = null;
    try
    {
      const value = await host.readConnections(epoch);
      if (sequence === modelSequence && library?.epoch === epoch) connections = value;
    }
    catch { /* Model settings failures do not block manual library work. */ }
  }

  async function narrate(request: GenerationInput, signal: AbortSignal): Promise<string>
  {
    const settings = connections;
    if (!settings) throw new ModelError('Model settings are unavailable. Open Models and reload them before generating. Your input is retained.');
    if (settings.mode === 'simulation') return simulatedGeneration(request, signal);
    const profile = settings.profiles.find(profile => profile.id === settings.activeProfileId);
    if (!profile) throw new ModelError('Choose and save a local profile in Models before generating. Your input is retained.');
    return generateLocal(profile, request, signal);
  }

  function modelsSaved(value: Connections)
  {
    if (value.epoch !== library?.epoch) return;
    ++modelSequence;
    connections = value;
  }

  function message(cause: unknown) {
    const value = String(cause);
    if (value.includes('wrong_epoch')) return 'The library has changed. Reload the library before continuing.';
    if (value.includes('adventure_not_found')) return 'This adventure could not be found. Return to the library to choose another.';
    if (value.includes('title_too_long') || value.includes('invalid_request')) return 'Use an adventure title of 160 characters or fewer.';
    if (value.includes('unsupported_library')) return 'This library could not be read by this version of Lorebound.';
    return 'Lorebound could not reach or save to your library. Check that Lorebound is running, then retry.';
  }

  async function focusHeading() { await tick(); document.querySelector<HTMLHeadingElement>('h1')?.focus(); }
  function setAddress(id?: string) {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set('adventure', id); else url.searchParams.delete('adventure');
    window.history.pushState({}, '', url);
  }
  async function load() {
    const sequence = ++loadSequence;
    busy = true; error = ''; current = null; storyLocked = false; modelLocked = false; modelsOpen = false; storyStatus = '✓ Saved';
    try {
      const next = await host.list();
      const id = new URL(window.location.href).searchParams.get('adventure');
      const snapshot = id ? await host.read(next.epoch, id) : null;
      if (sequence !== loadSequence) return;
      library = next; current = snapshot;
      void loadModels(next.epoch);
      if (pending && pending.epoch !== next.epoch) {
        pending = null;
        error = 'The library changed. Your title is retained; choose whether to create it in this library.';
      }
    } catch (cause) { if (sequence === loadSequence) error = message(cause); }
    finally { if (sequence === loadSequence) busy = false; }
  }
  async function openAdventure(id: string) {
    if (!library || busy) return;
    const sequence = ++loadSequence;
    busy = true; error = '';
    try {
      const snapshot = await host.read(library.epoch, id);
      if (sequence !== loadSequence) return;
      current = snapshot;
      mobileView = 'story'; setAddress(id); await focusHeading();
    } catch (cause) { if (sequence === loadSequence) error = message(cause); }
    finally { if (sequence === loadSequence) busy = false; }
  }
  async function createAdventure() {
    if (!library || busy) return;
    const sequence = ++loadSequence;
    busy = true; error = '';
    try {
      pending ??= prepareCreate(library.epoch, title, crypto.randomUUID(), crypto.randomUUID());
      const result = await host.create(pending);
      // The original creation receipt may precede turns accepted in another tab.
      // Keep the same pending request until a coherent current read succeeds.
      const snapshot = await host.read(result.snapshot.epoch, result.snapshot.adventure.id);
      if (sequence !== loadSequence) return;
      current = snapshot;
      // A lost reply is resolved by retrying this unchanged request, never a fresh ID.
      pending = null; title = ''; mobileView = 'story'; setAddress(current.adventure.id);
      await focusHeading();
    } catch (cause) { if (sequence === loadSequence) error = message(cause); }
    finally { if (sequence === loadSequence) busy = false; }
  }
  async function showLibrary() {
    if (busy || storyLocked) return;
    setAddress(); await load(); await focusHeading();
  }
  onMount(() => {
    const ready = () => { void load(); };
    if (window.wails) ready(); else window.addEventListener('wails:runtime:ready', ready, { once: true });
    window.addEventListener('popstate', ready);
    return () => { loadSequence++; modelSequence++; window.removeEventListener('wails:runtime:ready', ready); window.removeEventListener('popstate', ready); };
  });
</script>

<svelte:head><title>{current ? `${current.adventure.title} — Lorebound` : 'Lorebound'}</title></svelte:head>
<header class="topbar">
  <a class="brand" href="/" onclick={(event) => { event.preventDefault(); void showLibrary(); }} aria-label="Lorebound adventure library">▤ <span>Lorebound</span></a>
  <div class="header-actions">
    <span class="save-status" role="status">{busy ? 'Loading…' : pending ? 'Creation unconfirmed' : current && !error ? storyStatus : library && !error ? 'Library ready' : 'Unavailable'}</span>
    <button class="quiet" aria-label="Model settings" onclick={() => modelsOpen = true} disabled={!library || busy || modelLocked}>⚙ <span class="settings-text">Models</span></button>
    {#if current}<button class="quiet" onclick={showLibrary} disabled={busy || storyLocked}>Library</button>{/if}
  </div>
</header>

{#if modelsOpen && library}<ConnectionSettings epoch={library.epoch} onSaved={modelsSaved} onClose={() => modelsOpen = false} />{/if}

{#if error || (pending && !busy)}
  <div class="error-banner" role="alert">
    <span>{error || 'Creation has not been confirmed. Retry to recover the result without creating a duplicate.'}</span>
    {#if pending}<button onclick={createAdventure} disabled={busy}>Retry creation</button>{/if}
    <button onclick={load} disabled={busy}>Reload library</button>
    {#if !current}<button onclick={showLibrary} disabled={busy}>Back to library</button>{/if}
  </div>
{/if}

{#if current}
  <nav class="mobile-switch" aria-label="Adventure view">
    <button aria-pressed={mobileView === 'story'} onclick={() => mobileView = 'story'}>Story</button>
    <button aria-pressed={mobileView === 'world'} onclick={() => mobileView = 'world'}>World</button>
  </nav>
  <div class="workspace">
    {#key current.adventure.id}
      <StoryWorkspace snapshot={current} mobileHidden={mobileView !== 'story'} generateNarration={narrate} sourceLabel={narrationLabel}
        onUpdate={(update) => { current = update.snapshot; storyStatus = update.status; storyLocked = update.locked; modelLocked = update.modelLocked; }} />
    {/key}
    <aside class:mobile-hidden={mobileView !== 'world'} class="context-rail" aria-label="World context">
      <div class="context-tabs"><span class="selected">Scene</span><span>Items</span><span>Lore</span><span>Context</span></div>
      <div class="context-body"><p class="eyebrow">Current scene</p><h2>An unwritten world</h2><p>No characters or places recorded.</p></div>
    </aside>
  </div>
{:else}
  <main class="library-pane">
    <section class="reader">
      <p class="eyebrow">Your library</p>
      <h1 bind:this={heading} tabindex="-1">Every story starts somewhere.</h1>
      <p class="intro">Start with a blank page, or return to an adventure.</p>
      <form onsubmit={(event) => { event.preventDefault(); void createAdventure(); }}>
        <label for="adventure-title">Adventure title <span class="optional">(optional)</span></label>
        <input id="adventure-title" bind:value={title} maxlength="160" placeholder="Untitled Adventure" disabled={busy || !!pending} />
        <button class="primary" type="submit" disabled={!library || busy || !!pending}>{busy ? 'Please wait…' : 'Start blank adventure'}</button>
      </form>
      <div class="library-heading"><h2>Saved adventures</h2><button class="quiet" onclick={load} disabled={busy}>Refresh</button></div>
      {#if busy}<p role="status">Loading your library…</p>
      {:else if library && library.adventures.length === 0}<p class="empty-library">Your adventures will appear here.</p>
      {:else if library}
        <ul class="adventure-list">{#each library.adventures as item (item.id)}<li><button onclick={() => openAdventure(item.id)} disabled={busy} data-adventure-id={item.id}><span>{item.title}</span><span class="resume">Resume →</span></button></li>{/each}</ul>
      {/if}
    </section>
  </main>
{/if}
