<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { contextSectionLabels } from './contextLimits';
  import { host } from './host';
  import { schemaVersion } from './library';
  import type { LoreEntry } from './lorebook';
  import type { ModelProfile } from './models';
  import type { NarrationStyle } from './narration';
  import { watchPromptChanges } from './promptChanges';
  import { previewStoryPrompt } from './promptPreview';
  import { acceptedPromptHistory, documentToText, plainTextToDocument, type Projection } from './story';

  export let mobileHidden: boolean;
  export let epoch: string;
  export let adventureId: string;
  export let profile: ModelProfile | undefined;
  export let draft: string | null;
  export let projection: Projection | null;
  export let onRefreshModels: () => Promise<void>;

  type Tab = 'scene' | 'context';
  const number = new Intl.NumberFormat();
  const tabs = [
    { id: 'scene', label: 'Scene', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z' },
    { id: 'items', label: 'Items', icon: 'm12 2 9 5v10l-9 5-9-5V7l9-5Zm0 20V12m9-5-9 5-9-5m4.5-2.5 9 5' },
    { id: 'lore', label: 'Lore', icon: 'M12 21V6m0 0C9 3 5 3 2 4v14c4-1 7 0 10 3 3-3 6-4 10-3V4c-3-1-7-1-10 2Z' },
    { id: 'context', label: 'Context', icon: 'm12 2 10 5-10 5L2 7l10-5ZM2 12l10 5 10-5M2 17l10 5 10-5' }
  ] as const;

  let tab: Tab = 'scene';
  let nav: HTMLDivElement;
  let mounted = false;
  let sequence = 0;
  let reading = false;
  let readFailed = false;
  let guidance: { style: NarrationStyle; notes: string; entries: LoreEntry[] } | null = null;

  $: hasLocalProfile = Boolean(profile);
  $: if (mounted && tab === 'context' && hasLocalProfile) void loadGuidance(epoch, adventureId);
  $: history = tab === 'context' && projection?.epoch === epoch && projection.adventureId === adventureId && !projection.blocked
    ? acceptedPromptHistory(projection) : null;
  $: playerText = tab === 'context' ? draftText(draft) : null;
  $: preview = profile && guidance && history && playerText !== null
    ? previewStoryPrompt(profile, { input: playerText, history }, guidance.style, guidance.notes, guidance.entries) : null;

  function draftText(value: string | null): string | null
  {
    if (value === null) return null;
    try { return value.trim() ? documentToText(plainTextToDocument(value)) : ''; }
    catch { return null; }
  }

  async function loadGuidance(targetEpoch: string, targetId: string): Promise<void>
  {
    const attempt = ++sequence;
    const target = { schemaVersion, epoch: targetEpoch, adventureId: targetId };
    reading = true;
    readFailed = false;
    try
    {
      const [narration, notes, lore] = await Promise.all([
        host.readNarration(target), host.readAuthorNotes(target), host.readLorebook(target)
      ]);
      if (attempt === sequence) guidance = { style: narration.style, notes: notes.notes, entries: lore.entries };
    }
    catch
    {
      if (attempt === sequence) readFailed = true;
    }
    finally
    {
      if (attempt === sequence) reading = false;
    }
  }

  function selectTab(next: Tab)
  {
    if (tab === next) return;
    tab = next;
    if (next === 'context') void onRefreshModels();
    else ++sequence;
  }

  async function handleTabKey(event: KeyboardEvent)
  {
    let next: Tab;
    if (event.key === 'Home') next = 'scene';
    else if (event.key === 'End') next = 'context';
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') next = tab === 'scene' ? 'context' : 'scene';
    else return;
    event.preventDefault();
    selectTab(next);
    await tick();
    nav.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus();
  }

  onMount(() =>
  {
    mounted = true;
    const unwatch = watchPromptChanges((change, remote) =>
    {
      if (tab !== 'context' || change?.epoch !== epoch) return;
      if (!change.adventureId && remote) void onRefreshModels();
      if (change.adventureId === adventureId && profile) void loadGuidance(epoch, adventureId);
    });
    const refresh = () =>
    {
      if (tab !== 'context') return;
      void onRefreshModels();
      if (profile) void loadGuidance(epoch, adventureId);
    };
    window.addEventListener('focus', refresh);
    return () =>
    {
      ++sequence;
      unwatch();
      window.removeEventListener('focus', refresh);
    };
  });
</script>

<aside class:mobile-hidden={mobileHidden} class="context-rail" aria-label="World context">
  <div class="context-tabs" role="tablist" aria-label="World context" bind:this={nav}>
    {#each tabs as item (item.id)}
      <button type="button" id={`world-tab-${item.id}`} role="tab" aria-selected={tab === item.id}
        aria-controls={item.id === 'scene' || item.id === 'context' ? `world-panel-${item.id}` : undefined}
        tabindex={tab === item.id ? 0 : -1} disabled={item.id === 'items' || item.id === 'lore'}
        onclick={() => { if (item.id === 'scene' || item.id === 'context') selectTab(item.id); }} onkeydown={handleTabKey}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={item.icon} /></svg>
        {item.label}
      </button>
    {/each}
  </div>
  <div id="world-panel-scene" class="context-body" role="tabpanel" aria-labelledby="world-tab-scene" hidden={tab !== 'scene'} tabindex="0">
    <p class="eyebrow">Current scene</p>
    <h2>An unwritten world</h2>
    <p>No characters or places recorded.</p>
  </div>
  <div id="world-panel-context" class="context-body" role="tabpanel" aria-labelledby="world-tab-context" hidden={tab !== 'context'} tabindex="0">
    <div class="prompt-heading">
      <h2 class="eyebrow">Next prompt</h2>
      {#if preview && !reading && !readFailed}
        <span class="prompt-total" aria-label={`Estimated input ${number.format(preview.total)} tokens${preview.capacity === undefined ? '' : ` of ${number.format(preview.capacity)}`}`}>
          ≈ {number.format(preview.total)}{preview.capacity === undefined ? ' tokens' : ` / ${number.format(preview.capacity)}`}
        </span>
      {/if}
    </div>
    {#if !profile}
      <p class="supporting">Select a local profile in Models to preview the next prompt.</p>
    {:else if projection?.blocked}
      <p class="supporting">This adventure is read-only.</p>
    {:else if reading || draft === null}
      <p class="supporting" role="status">Preparing preview…</p>
    {:else if readFailed}
      <p class="supporting">The saved prompt settings could not be read.</p>
      <button class="quiet" type="button" onclick={() => loadGuidance(epoch, adventureId)}>Retry preview</button>
    {:else if playerText === null}
      <p class="prompt-warning">Enter a valid Story passage of up to 20,000 characters to preview the prompt.</p>
    {:else if preview}
      {@const scale = Math.max(preview.total, preview.capacity ?? 0)}
      <div class="prompt-bar" aria-hidden="true">
        {#each preview.rows as row (row.section)}
          <span data-section={row.section} style:width={`${100 * row.tokens / scale}%`}></span>
        {/each}
      </div>
      <dl class="prompt-breakdown" aria-label="Estimated tokens by section">
        {#each preview.rows as row (row.section)}
          <div>
            <dt><span class="swatch" data-section={row.section} aria-hidden="true"></span>{row.label}</dt>
            <dd>{number.format(row.tokens)}</dd>
          </div>
        {/each}
      </dl>
      <p class="supporting prompt-reply">{preview.replyAllowance === undefined ? 'Reply allowance unknown.' : `${number.format(preview.replyAllowance)} tokens reserved for the reply in this preview.`}</p>
      {#if preview.overBy > 0}
        <p class="prompt-warning">Estimated usage exceeds the model limit by {number.format(preview.overBy)} tokens.</p>
      {/if}
      <p class="supporting prompt-estimate">Token estimates exclude provider overhead.{preview.capacity === undefined ? ' Model limit unknown.' : ''}</p>
      {#if preview.context?.historyTrimmed || preview.skippedLore.length || preview.context?.blocked}
        <ul class="prompt-omissions">
          {#if preview.context?.historyTrimmed}<li>Older story trimmed to its character limit.</li>{/if}
          {#each preview.skippedLore as entry}<li>Skipped lore: {entry.title}.</li>{/each}
          {#if preview.context}
            {@const { counts, limits } = preview.context}
            {#each ['authorNotes', 'playerInput'] as section}
              {@const key = section as 'authorNotes' | 'playerInput'}
              {#if counts[key] > limits[key]}
                <li class="prompt-warning">Generation blocked · {contextSectionLabels[key]} has {number.format(counts[key])} characters, with a limit of {number.format(limits[key])}.</li>
              {/if}
            {/each}
          {/if}
        </ul>
      {/if}
    {/if}
  </div>
</aside>

<style>
  .context-tabs
  {
    position: sticky;
    top: 0;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border-bottom: 1px solid var(--sidebar-border);
    background: var(--sidebar);
  }

  .context-tabs button
  {
    display: grid;
    justify-items: center;
    gap: 4px;
    padding: 8px 2px 12px;
    border: 0;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    color: var(--muted-foreground);
    font: 11px/1.4 var(--font-ui);
  }

  .context-tabs button[aria-selected='true'] { border-bottom-color: var(--primary); color: var(--foreground); }
  .context-tabs button:disabled { opacity: .8; }
  .context-tabs button:focus-visible, .context-body:focus-visible { outline-offset: -2px; }
  .context-body { padding: 20px; }
  #world-panel-scene p:last-child { color: var(--muted-foreground); line-height: 1.6; }
  .prompt-heading { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 6px 12px; }
  .prompt-heading h2 { margin: 0; font: 600 11px/1.4 var(--font-ui); color: var(--muted-foreground); }
  .prompt-total { font: 12px/1.4 var(--font-mono); }

  .prompt-bar
  {
    display: flex;
    height: 8px;
    margin: 12px 0 16px;
    overflow: hidden;
    border-radius: 4px;
    background: var(--sidebar-border);
  }

  .prompt-bar > span, .swatch { background: var(--section-color); }
  [data-section='systemStyle'] { --section-color: oklch(0.69 0.027 75); }
  [data-section='authorNotes'] { --section-color: oklch(0.7 0.1 320); }
  [data-section='lorebook'] { --section-color: oklch(0.76 0.12 70); }
  [data-section='history'] { --section-color: oklch(0.72 0.09 210); }
  [data-section='playerInput'] { --section-color: oklch(0.72 0.12 150); }

  .prompt-breakdown { display: grid; gap: 8px; margin: 0; }
  .prompt-breakdown > div { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  .prompt-breakdown dd { margin: 0; color: var(--muted-foreground); font: 12px/1.4 var(--font-mono); }
  .swatch { display: inline-block; width: 8px; height: 8px; margin-right: 8px; border-radius: 2px; }
  .prompt-reply { margin: 18px 0 0; }
  .prompt-estimate { margin: 4px 0 0; }
  .prompt-warning { color: var(--foreground); font-size: 12px; }
  .prompt-omissions { display: grid; gap: 6px; margin: 12px 0 0; padding-left: 16px; overflow-wrap: anywhere; color: var(--muted-foreground); font-size: 12px; }
</style>
