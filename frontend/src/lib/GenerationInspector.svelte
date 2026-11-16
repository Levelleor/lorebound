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
    <p class="usage-heading">Requested narration guidance</p>
    {#if diagnostics.narration}<pre>{diagnostics.narration}</pre>
    {:else}<p>No narration preferences selected.</p>{/if}
    <p>Writing guidance is best-effort. Model context capacity is unknown; no automatic trimming or token-budget measurement is performed.</p>
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
