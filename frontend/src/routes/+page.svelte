<script lang="ts">
  import { onMount } from 'svelte';
  import { host, type HostInfo, type State } from '../lib/host';

  let info: HostInfo | null = null;
  let state: State | null = null;
  let error = '';
  let value = '';

  async function refresh() {
    try {
      info = await host.ping();
      state = await host.read();
      error = '';
    } catch (cause) { error = String(cause); }
  }

  async function save() {
    if (!state) return;
    try {
      const result = await host.commit({
        schemaVersion: 1,
        epoch: state.epoch,
        expectedVersion: state.version,
        operationId: crypto.randomUUID(),
        value
      });
      state = result.state;
      error = '';
    } catch (cause) { error = String(cause); }
  }

  onMount(() => {
    if (window.wails) void refresh();
    else window.addEventListener('wails:runtime:ready', () => void refresh(), { once: true });
  });
</script>

<svelte:head><title>Lorebound Gate 0</title></svelte:head>
<main>
  <h1>Lorebound</h1>
  <p>Gate 0 host and persistence check</p>
  {#if info}
    <p id="host-status">Connected to {info.name} (schema {info.schemaVersion})</p>
  {:else}
    <p id="host-status">Connecting to Go host…</p>
  {/if}
  {#if state}<p id="record-status">Record version {state.version}: {state.value || '(empty)'}</p>{/if}
  <label for="value">Test record</label>
  <input id="value" bind:value maxlength="1024" />
  <button onclick={save} disabled={!state}>Save test record</button>
  {#if error}<p role="alert">{error}</p>{/if}
</main>

<style>
  :global(body) { font-family: system-ui, sans-serif; margin: 0; background: #f6f3ed; color: #211b16; }
  main { max-width: 42rem; margin: 5rem auto; padding: 2rem; background: white; border: 1px solid #d9d1c5; border-radius: .75rem; }
  h1 { margin-top: 0; }
  input { display: block; width: 100%; box-sizing: border-box; padding: .6rem; margin: .4rem 0 1rem; }
  button { padding: .6rem 1rem; cursor: pointer; }
</style>
