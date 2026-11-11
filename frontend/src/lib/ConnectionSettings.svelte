<script lang="ts">
  import { onMount } from 'svelte';
  import { host } from './host';
  import { schemaVersion } from './library';
  import { discoverModels, endpointUrl, modelError, readProfile, testConnection, type Connections, type ModelProfile } from './models';

  export let epoch: string;
  export let onSaved: (value: Connections) => void;
  export let onClose: () => void;
  let dialog: HTMLDialogElement;
  let settings: Connections | null = null;
  let editingId = '';
  let name = '';
  let kind: ModelProfile['kind'] = 'llamacpp';
  let baseUrl = 'http://127.0.0.1:8081/v1';
  let model = '';
  let timeoutSeconds = 120;
  let busy = false;
  let probing = false;
  let testing = false;
  let testMessage = '';
  let testFailed = false;
  let error = '';
  let notice = '';
  let models: string[] = [];
  let probe: AbortController | null = null;
  let disposed = false;

  function selectProfile(id: string)
  {
    probe?.abort();
    probing = false;
    testing = false;
    testMessage = '';
    models = [];
    notice = '';
    error = '';
    editingId = id;
    const profile = settings?.profiles.find(profile => profile.id === id);
    name = profile?.name ?? '';
    kind = profile?.kind ?? 'llamacpp';
    baseUrl = profile?.baseUrl ?? 'http://127.0.0.1:8081/v1';
    model = profile?.model ?? '';
    timeoutSeconds = (profile?.timeoutMs ?? 120000) / 1000;
  }

  async function load()
  {
    busy = true;
    error = '';
    try
    {
      const value = await host.readConnections(epoch);
      if (disposed) return;
      settings = value;
      selectProfile(value.activeProfileId);
      onSaved(value);
    }
    catch { if (!disposed) error = 'Model settings could not be loaded. Check Lorebound and reload models. Your library remains available.'; }
    finally { if (!disposed) busy = false; }
  }

  async function save(profiles: ModelProfile[], mode: Connections['mode'], activeProfileId: string): Promise<boolean>
  {
    if (!settings || busy || probing) return false;
    busy = true;
    error = '';
    try
    {
      const value = await host.saveConnections({ schemaVersion, epoch, expectedRevision: settings.revision, profiles, mode, activeProfileId });
      if (disposed) return false;
      settings = value;
      onSaved(value);
      return true;
    }
    catch (cause)
    {
      if (!disposed) error = String(cause).includes('model_settings_changed')
        ? 'Model settings changed elsewhere. Your form is retained. Reload models and review the current settings before saving again.'
        : 'The settings save could not be confirmed. Your form is retained. Retry the same save or reload models to check it.';
      return false;
    }
    finally { if (!disposed) busy = false; }
  }

  async function saveProfile()
  {
    if (!settings || busy || probing) return;
    try
    {
      const profile = readProfile({ id: editingId || crypto.randomUUID(), name: name.trim(), kind,
        baseUrl: endpointUrl(baseUrl.trim()), model: model.trim(), timeoutMs: timeoutSeconds * 1000 });
      // Keep a new identity across an uncertain save reply.
      editingId = profile.id;
      const profiles = settings.profiles.filter(value => value.id !== profile.id);
      if (await save([...profiles, profile], 'local', profile.id)) dialog.close();
    }
    catch (cause) { error = modelError(cause); }
  }

  async function useSimulation()
  {
    if (settings && await save(settings.profiles, 'simulation', '')) dialog.close();
  }

  async function deleteProfile()
  {
    if (!settings || !editingId) return;
    const active = settings.activeProfileId === editingId ? '' : settings.activeProfileId;
    if (await save(settings.profiles.filter(profile => profile.id !== editingId), settings.mode, active))
    {
      selectProfile('');
      notice = 'Profile deleted. Local narration needs a selected profile; it will not fall back to Simulation.';
    }
  }

  async function discover()
  {
    if (busy || probing) return;
    probe?.abort();
    const request = new AbortController();
    probe = request;
    probing = true;
    testing = false;
    testMessage = '';
    error = '';
    notice = '';
    models = [];
    try
    {
      const found = await discoverModels({ baseUrl: baseUrl.trim(), timeoutMs: timeoutSeconds * 1000 }, request.signal);
      if (disposed || request !== probe) return;
      models = found;
      notice = found.length ? 'Model list received. Choose an ID or enter one manually. Narration has not been tested.'
        : 'The server returned no models. You can still enter an ID manually.';
    }
    catch (cause)
    {
      if (!disposed && request === probe && !request.signal.aborted)
        error = `${modelError(cause)} You can enter a model ID manually.`;
    }
    finally { if (!disposed && request === probe) probing = false; }
  }

  function stopTest()
  {
    probe?.abort();
    probe = null;
    probing = false;
    testing = false;
    testFailed = false;
    testMessage = 'Connection test stopped. No settings or story were saved.';
  }

  async function test()
  {
    if (busy || probing) return;
    const request = new AbortController();
    probe = request;
    probing = true;
    testing = true;
    error = '';
    notice = '';
    testFailed = false;
    testMessage = 'Testing the entered endpoint and model…';
    try
    {
      const result = await testConnection({ baseUrl: baseUrl.trim(), model: model.trim(), timeoutMs: timeoutSeconds * 1000 }, request.signal);
      if (disposed || request !== probe || request.signal.aborted) return;
      testMessage = result === 'complete'
        ? 'The endpoint returned a complete text response to the test request. Full Story generation and streaming were not tested.'
        : 'The endpoint answered the test request but reached the 32-token limit. Full Story generation and streaming remain unverified.';
    }
    catch (cause)
    {
      if (disposed || request !== probe || request.signal.aborted) return;
      testFailed = true;
      testMessage = modelError(cause);
    }
    finally
    {
      if (!disposed && request === probe)
      {
        probing = false;
        testing = false;
      }
    }
  }

  onMount(() =>
  {
    dialog.showModal();
    void load();
    const abandon = () =>
    {
      probe?.abort();
      probe = null;
      probing = false;
      testing = false;
      testMessage = '';
    };
    window.addEventListener('pagehide', abandon);
    return () =>
    {
      disposed = true;
      abandon();
      window.removeEventListener('pagehide', abandon);
    };
  });
</script>

<dialog bind:this={dialog} aria-labelledby="models-title" onclose={onClose} oncancel={(event) => { if (busy) event.preventDefault(); }}>
  <div class="dialog-heading"><h2 id="models-title">Model connections</h2><button class="quiet" aria-label="Close model settings" disabled={busy} onclick={() => dialog.close()}>✕</button></div>
  <p class="supporting">Connect to your running llama.cpp server or a compatible endpoint. Requests go directly from this browser. Completed text and optional Story streaming are supported; authentication is not available yet.</p>
  {#if error}<p class="story-error" role="alert">{error}</p>{/if}
  {#if notice}<p class="supporting" role="status" aria-label="Model discovery result">{notice}</p>{/if}
  {#if settings}
    <p class="current-source">Current source: {settings.mode === 'simulation' ? 'Simulation · No AI connected' : settings.profiles.find(profile => profile.id === settings?.activeProfileId)?.name ?? 'Local model · No profile selected'}</p>
    <button class="quiet" disabled={busy || probing} onclick={useSimulation}>Use Simulation · No AI</button>
    <form oninput={() => { testMessage = ''; }} onchange={() => { testMessage = ''; }} onsubmit={(event) => { event.preventDefault(); void saveProfile(); }}>
      <label for="saved-connection">Saved connection</label>
      <div class="profile-picker">
        <select id="saved-connection" value={editingId} disabled={busy || probing} onchange={(event) => selectProfile(event.currentTarget.value)}>
          <option value="">New connection</option>
          {#each settings.profiles as profile (profile.id)}<option value={profile.id}>{profile.name}</option>{/each}
        </select>
        <button type="button" disabled={busy || probing} onclick={() => selectProfile('')}>New</button>
      </div>
      <label for="connection-name">Connection name</label>
      <input id="connection-name" bind:value={name} maxlength="80" required disabled={busy || probing} autocomplete="off" />
      <label for="server-kind">Server type</label>
      <select id="server-kind" bind:value={kind} disabled={busy || probing}><option value="llamacpp">llama.cpp (llama-server)</option><option value="custom">Custom compatible endpoint</option></select>
      <label for="model-base-url">API base URL</label>
      <input id="model-base-url" bind:value={baseUrl} maxlength="2048" required disabled={busy || probing} spellcheck="false" autocomplete="off" />
      <p class="supporting">Include the API path, usually /v1. Use the server’s actual port; it must allow this Lorebound browser origin. Do not put keys, passwords or secret parameters in these fields.</p>
      <label for="model-id">Model ID</label>
      <input id="model-id" bind:value={model} list="discovered-models" maxlength="200" required disabled={busy || probing} autocomplete="off" spellcheck="false" />
      <datalist id="discovered-models">{#each models as id}<option value={id}></option>{/each}</datalist>
      <div class="probe-row"><button type="button" disabled={busy || probing} onclick={discover}>{probing && !testing ? 'Reading models…' : 'Discover models'}</button><span class="supporting">Optional · Does not generate or send story text.</span></div>
      <label for="model-timeout">Request timeout (seconds)</label>
      <input id="model-timeout" type="number" bind:value={timeoutSeconds} min="1" max="300" step="1" required disabled={busy || probing} />
      <div class="probe-row">
        <button type="button" disabled={busy || probing} onclick={test}>Test connection</button>
        {#if testing}<button type="button" class="stop-test" onclick={stopTest}>Stop connection test</button>{/if}
      </div>
      <p class="supporting">Optional · Sends “Reply with OK.” with a 32-token limit using the entered URL/model and timeout. Generates test output only; no story text is sent and no settings are saved. Results apply to this test only.</p>
      {#if testMessage}<p class:story-error={testFailed} class="supporting test-result" role={testFailed ? 'alert' : 'status'} aria-label="Connection test result">{testMessage}</p>{/if}
      <div class="dialog-actions"><button type="button" disabled={busy} onclick={() => dialog.close()}>Cancel</button><button class="primary" disabled={busy || probing} type="submit">Save and use profile</button></div>
      {#if settings.profiles.some(profile => profile.id === editingId)}<button class="quiet delete-profile" type="button" disabled={busy || probing} onclick={deleteProfile}>Delete profile</button>{/if}
    </form>
  {/if}
  <button class="quiet" disabled={busy || probing} onclick={load}>{busy ? 'Loading…' : 'Reload models'}</button>
</dialog>

<style>
  dialog { width: calc(100% - 32px); max-width: 576px; max-height: 90dvh; overflow: auto; padding: 24px; border: 1px solid var(--border); border-radius: 6px; background: var(--card); color: var(--foreground); }
  dialog::backdrop { background: rgb(0 0 0 / .8); }
  h2 { margin: 0; font-size: 24px; }
  .dialog-heading, .dialog-actions, .profile-picker, .probe-row { display: flex; align-items: center; gap: 12px; }
  .dialog-heading { justify-content: space-between; }
  .current-source { color: var(--primary); overflow-wrap: anywhere; }
  form { margin-top: 20px; padding: 0; border: 0; }
  label { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; margin-top: 16px; }
  select { width: 100%; min-width: 0; padding: 10px; border: 1px solid var(--border); border-radius: 4px; background: var(--background); color: var(--foreground); font: inherit; }
  input { margin-bottom: 0; background: var(--background); }
  .profile-picker select { flex: 1; }
  .probe-row { flex-wrap: wrap; margin-top: 12px; }
  .test-result { overflow-wrap: anywhere; }
  .stop-test { color: var(--destructive); border-color: var(--destructive); }
  .dialog-actions { justify-content: flex-end; margin-top: 24px; flex-wrap: wrap; }
  .delete-profile { color: var(--destructive); margin-top: 12px; }
  @media (max-width: 639px) { dialog { padding: 20px; } }
</style>
