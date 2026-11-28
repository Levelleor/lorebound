<script lang="ts">
  import type { GenerationDiagnostics } from './generationDiagnostics';
  import { modelServers } from './modelServers';

  export let diagnostics: GenerationDiagnostics;
  const labels = { running: 'In progress', complete: 'Response complete', failed: 'Failed', stopped: 'Stopped' };
</script>

<details class="generation-inspector">
  <summary>Generation details · {labels[diagnostics.status]}</summary>
  <div class="generation-details">
    <dl>
      <dt>Stage</dt><dd>Story narration</dd>
      <dt>Requested connection</dt><dd>{diagnostics.profileName}</dd>
      <dt>Server type</dt><dd>{modelServers[diagnostics.server].diagnosticLabel}</dd>
      <dt>Requested model</dt><dd>{diagnostics.requestedModel}</dd>
      <dt>Response mode</dt><dd>{diagnostics.streaming ? 'Streaming' : 'Completed response'}</dd>
      <dt>Request timeout</dt><dd>{diagnostics.timeoutMs / 1000} seconds</dd>
      <dt>Browser elapsed</dt><dd>{diagnostics.elapsedMs === null ? 'Available when this attempt ends' : `${diagnostics.elapsedMs} ms`}</dd>
    </dl>
    <p>Other model settings use server defaults; their effective values and model routing are unknown. Elapsed time includes browser/network work through response validation, not server compute time.</p>
    <p class="usage-heading">Narration style guidance</p>
    {#if diagnostics.narration}<pre class="style-guidance">{diagnostics.narration}</pre>
    {:else}<p>No narration preferences selected.</p>{/if}
    <p class="usage-heading">Author notes</p>
    {#if diagnostics.authorNotes?.trim()}<pre class="author-notes-guidance">{diagnostics.authorNotes}</pre>
    {:else}<p>No author notes were sent with this attempt.</p>{/if}
    {#if diagnostics.lorebook}
      <p class="usage-heading">Lorebook entries requested</p>
      {#if diagnostics.lorebook.requested.length}
        <ul class="lore-requested">
          {#each diagnostics.lorebook.requested as entry}<li>{entry.title} · {entry.kind}</li>{/each}
        </ul>
        <p class="usage-heading">Lorebook text sent</p>
        <pre class="lorebook-guidance">{diagnostics.lorebook.text}</pre>
      {:else}<p>No Lorebook entries were selected or sent with this attempt.</p>{/if}
    {/if}
    <p>Model context capacity is unknown. The browser sends the selected lore and writing guidance as provided.</p>
    <p class="usage-heading">Provider-reported tokens</p>
    {#if diagnostics.usage}
      <dl>
        <dt>Input tokens</dt><dd>{diagnostics.usage.prompt ?? 'Not reported'}</dd>
        <dt>Output tokens</dt><dd>{diagnostics.usage.completion ?? 'Not reported'}</dd>
        <dt>Total tokens</dt><dd>{diagnostics.usage.total ?? 'Not reported'}</dd>
      </dl>
    {:else}
      <p>No valid usage reported for this attempt. Token counts and costs are not estimated.</p>
    {/if}
    <p>Latest attempt in this workspace session.</p>
  </div>
</details>

<style>
  .generation-inspector
  {
    margin: 24px 0;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--card);
    color: var(--muted-foreground);
    font: 12px/1.6 var(--font-ui);
    overflow-wrap: anywhere;
  }

  summary
  {
    padding: 12px;
    color: var(--foreground);
    cursor: pointer;
  }

  .generation-details
  {
    padding: 0 12px 12px;
  }

  dl
  {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: 6px 12px;
    margin: 0;
  }

  dd
  {
    margin: 0;
    color: var(--foreground);
  }

  .lore-requested
  {
    margin: 0;
    padding-left: 20px;
    color: var(--foreground);
  }

  p
  {
    margin: 12px 0 0;
  }

  pre
  {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    font: inherit;
    color: var(--foreground);
  }

  .usage-heading
  {
    margin-bottom: 6px;
    color: var(--foreground);
    font-weight: 600;
  }
</style>
