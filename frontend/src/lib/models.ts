import { schemaVersion } from './library.ts';
import { isID, isObject, plainTextToDocument } from './story.ts';
import type { GenerationInput } from './coordinator.ts';

export interface ModelProfile
{
  id: string;
  name: string;
  kind: 'llamacpp' | 'custom';
  baseUrl: string;
  model: string;
  timeoutMs: number;
}

export interface Connections
{
  schemaVersion: number;
  epoch: string;
  revision: number;
  mode: 'simulation' | 'local';
  activeProfileId: string;
  profiles: ModelProfile[];
}

export type SaveConnections = Omit<Connections, 'revision'> & { expectedRevision: number };

export class ModelError extends Error {}

export function modelError(cause: unknown): string
{
  return cause instanceof ModelError ? cause.message
    : 'The response could not be prepared. Your input is retained. Check Models and try again.';
}

export function endpointUrl(value: string): string
{
  if (value.length > 2048 || /[\s?#\\]/u.test(value))
    throw new ModelError('Use an HTTP(S) base URL without credentials, spaces, query or fragment.');
  let url: URL;
  try { url = new URL(value); }
  catch { throw new ModelError('Enter the server’s complete HTTP(S) API base URL.'); }
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password)
    throw new ModelError('Use an HTTP(S) base URL without credentials, query or fragment.');
  return url.href.replace(/\/+$/, '');
}

export function readProfile(value: unknown): ModelProfile
{
  if (!isObject(value) || Object.keys(value).length !== 6 || !isID(value.id)
    || (value.kind !== 'llamacpp' && value.kind !== 'custom')
    || typeof value.name !== 'string' || !value.name.trim() || !value.name.isWellFormed() || [...value.name].length > 80
    || typeof value.model !== 'string' || !value.model.trim() || !value.model.isWellFormed() || [...value.model].length > 200
    || typeof value.baseUrl !== 'string' || !Number.isInteger(value.timeoutMs) || Number(value.timeoutMs) < 1000 || Number(value.timeoutMs) > 300000)
    throw new ModelError('Use a name up to 80 characters, model ID up to 200 characters and timeout from 1 to 300 seconds.');
  endpointUrl(value.baseUrl);
  return value as unknown as ModelProfile;
}

export function readConnections(value: unknown, epoch: string): Connections
{
  if (!isObject(value) || Object.keys(value).length !== 6 || value.schemaVersion !== schemaVersion || value.epoch !== epoch
    || !Number.isSafeInteger(value.revision) || Number(value.revision) < 0
    || (value.mode !== 'simulation' && value.mode !== 'local') || typeof value.activeProfileId !== 'string'
    || !Array.isArray(value.profiles) || value.profiles.length > 32)
    throw new Error('unsupported_model_settings');
  const profiles = value.profiles.map(readProfile);
  if (new Set(profiles.map(profile => profile.id)).size !== profiles.length
    || (value.mode === 'simulation' && value.activeProfileId !== '')
    || (value.activeProfileId && !profiles.some(profile => profile.id === value.activeProfileId)))
    throw new Error('unsupported_model_settings');
  return value as unknown as Connections;
}

async function readJson(response: Response, signal: AbortSignal): Promise<unknown>
{
  if (!response.body) throw new ModelError('The server returned an empty response. Check its compatible API settings.');
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let text = '';
  let size = 0;
  const cancel = () => { void reader.cancel().catch(() => {}); };
  signal.addEventListener('abort', cancel, { once: true });
  try
  {
    signal.throwIfAborted();
    for (;;)
    {
      const { done, value } = await reader.read();
      signal.throwIfAborted();
      if (done) break;
      size += value.byteLength;
      if (size > 1048576) throw new ModelError('The server response exceeded the supported size. Try a shorter response.');
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  }
  catch (cause)
  {
    signal.throwIfAborted();
    if (cause instanceof ModelError) throw cause;
    throw new ModelError('The server response could not be read as supported UTF-8 JSON. Check its compatible API settings and server logs. No response was retained.');
  }
  finally
  {
    signal.removeEventListener('abort', cancel);
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

type ModelEndpoint = Pick<ModelProfile, 'baseUrl' | 'timeoutMs'>;

async function readContinuationStream(response: Response, signal: AbortSignal, onProgress: (text: string) => void): Promise<string>
{
  const invalid = () => new ModelError('The stream did not contain a complete text continuation. Partial output was discarded. Check the server or uncheck Stream output to request a completed response.');
  if (!response.body) throw invalid();
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let buffer = '';
  let data: string[] = [];
  let event = '';
  let text = '';
  let size = 0;
  let stopped = false;
  let completed = false;
  let skipLF = false;
  const cancel = () => { void reader.cancel().catch(() => {}); };

  function dispatch(): void
  {
    if (!data.length) { event = ''; return; }
    if (event && event !== 'message') throw invalid();
    const payload = data.join('\n');
    data = [];
    event = '';
    if (payload === '[DONE]')
    {
      if (!stopped) throw invalid();
      plainTextToDocument(text);
      completed = true;
      return;
    }
    const value: unknown = JSON.parse(payload);
    if (!isObject(value) || value.error || !Array.isArray(value.choices)) throw invalid();
    // Compatible servers may send a final usage-only chunk. It is not prose.
    if (value.choices.length === 0 && stopped && isObject(value.usage)) return;
    if (value.choices.length !== 1 || stopped) throw invalid();
    const choice = value.choices[0];
    const delta = isObject(choice) && isObject(choice.delta) ? choice.delta : null;
    if (!isObject(choice) || choice.index !== 0 || !delta
      || (delta.role !== undefined && delta.role !== 'assistant')
      || delta.tool_calls || delta.function_call || delta.refusal
      || (delta.content !== undefined && delta.content !== null && typeof delta.content !== 'string')
      || (choice.finish_reason !== null && choice.finish_reason !== 'stop')) throw invalid();
    if (typeof delta.content === 'string' && delta.content)
    {
      text += delta.content;
      if (!text.isWellFormed() || text.length > 40000 || [...text].length > 20000) throw invalid();
      onProgress(text);
    }
    stopped = choice.finish_reason === 'stop';
  }

  signal.addEventListener('abort', cancel, { once: true });
  try
  {
    signal.throwIfAborted();
    if (response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'text/event-stream') throw invalid();
    while (!completed)
    {
      const { done, value } = await reader.read();
      signal.throwIfAborted();
      if (done)
      {
        decoder.decode();
        throw invalid();
      }
      size += value.byteLength;
      if (size > 1048576) throw invalid();
      buffer += decoder.decode(value, { stream: true });
      for (;;)
      {
        if (skipLF && buffer)
        {
          if (buffer[0] === '\n') buffer = buffer.slice(1);
          skipLF = false;
        }
        const boundary = buffer.search(/[\r\n]/);
        if (boundary < 0) break;
        const line = buffer.slice(0, boundary);
        skipLF = buffer[boundary] === '\r';
        buffer = buffer.slice(boundary + 1);
        if (!line) dispatch();
        else
        {
          const colon = line.indexOf(':');
          const field = colon < 0 ? line : line.slice(0, colon);
          const value = colon < 0 ? '' : line.slice(colon + 1).replace(/^ /, '');
          if (field === 'data') data.push(value);
          if (field === 'event') event = value;
        }
        signal.throwIfAborted();
        if (completed) return text;
      }
    }
    return text;
  }
  catch (cause)
  {
    signal.throwIfAborted();
    if (cause instanceof ModelError) throw cause;
    throw invalid();
  }
  finally
  {
    signal.removeEventListener('abort', cancel);
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

async function requestValue<T>(profile: ModelEndpoint, path: string, signal: AbortSignal, read: (response: Response, signal: AbortSignal) => Promise<T>, body?: unknown, fetcher: typeof fetch = fetch): Promise<T>
{
  const selected = { ...profile, baseUrl: endpointUrl(profile.baseUrl) };
  if (!Number.isInteger(selected.timeoutMs) || selected.timeoutMs < 1000 || selected.timeoutMs > 300000)
    throw new ModelError('Use a timeout from 1 to 300 seconds.');
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), selected.timeoutMs);
  const combined = AbortSignal.any([signal, timeout.signal]);
  try
  {
    combined.throwIfAborted();
    const response = await fetcher(`${endpointUrl(selected.baseUrl)}/${path}`, {
      method: body ? 'POST' : 'GET',
      mode: 'cors',
      credentials: 'omit',
      redirect: 'error',
      referrerPolicy: 'no-referrer',
      cache: 'no-store',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: combined
    });
    combined.throwIfAborted();
    if (!response.ok)
    {
      await response.body?.cancel();
      if (response.status === 401 || response.status === 403)
        throw new ModelError('The server requires access this connection cannot provide. Authenticated connections are not supported yet.');
      if (response.status === 404)
        throw new ModelError('The server could not find this API or model. Check the base URL and model ID; discovery is optional.');
      if (response.status === 400)
        throw new ModelError('The server rejected this request. Check the model ID, API path and supported request settings (HTTP 400).');
      if (response.status === 429)
        throw new ModelError('The server is busy or rate limited. Try again when ready; no automatic retry was sent.');
      throw new ModelError(`The server returned HTTP ${response.status}. Check the server and try again.`);
    }
    const value = await read(response, combined);
    combined.throwIfAborted();
    return value;
  }
  catch (cause)
  {
    if (signal.aborted) throw signal.reason;
    if (timeout.signal.aborted) throw new ModelError('The model request timed out. Your input is retained; check the server or increase its timeout.');
    if (cause instanceof ModelError) throw cause;
    throw new ModelError('The model request failed. Check the server, HTTP(S) URL, browser CORS/origin and network permissions. No proxy or fallback was used.');
  }
  finally { clearTimeout(timer); }
}

export async function discoverModels(profile: ModelEndpoint, signal: AbortSignal, fetcher: typeof fetch = fetch): Promise<string[]>
{
  const value = await requestValue(profile, 'models', signal, readJson, undefined, fetcher);
  if (!isObject(value) || !Array.isArray(value.data) || value.data.length > 1000
    || !value.data.every(model => isObject(model) && typeof model.id === 'string' && model.id.trim() && model.id.isWellFormed() && [...model.id].length <= 200))
    throw new ModelError('The model list was not compatible. Enter a model ID manually; generation does not require discovery.');
  return [...new Set(value.data.map(model => model.id as string))];
}

export async function testConnection(profile: ModelEndpoint & Pick<ModelProfile, 'model'>, signal: AbortSignal, fetcher: typeof fetch = fetch): Promise<'complete' | 'limited'>
{
  const selected = { ...profile };
  if (typeof selected.model !== 'string' || !selected.model.trim() || !selected.model.isWellFormed() || [...selected.model].length > 200)
    throw new ModelError('Enter a model ID up to 200 characters before testing the connection. Discovery is optional.');
  const value = await requestValue(selected, 'chat/completions', signal, readJson, {
    model: selected.model,
    stream: false,
    max_tokens: 32,
    messages: [{ role: 'user', content: 'Reply with OK.' }]
  }, fetcher);
  const choice = isObject(value) && !value.error && Array.isArray(value.choices) && value.choices.length === 1 ? value.choices[0] : null;
  const message = isObject(choice) && isObject(choice.message) ? choice.message : null;
  if (!isObject(choice) || (choice.finish_reason !== 'stop' && choice.finish_reason !== 'length') || !message || message.role !== 'assistant'
    || message.tool_calls || message.function_call || message.refusal
    || (message.content !== null && typeof message.content !== 'string')
    || (typeof message.content === 'string' && (!message.content.isWellFormed() || [...message.content].length > 20000)))
    throw new ModelError('The test response was not compatible text. Check the API path, model and server settings. No response was retained.');
  if (choice.finish_reason === 'length') return 'limited';
  if (typeof message.content !== 'string' || !message.content.trim())
    throw new ModelError('The test returned no text. Check the model and server settings; full narration remains untested.');
  return 'complete';
}

export async function generateLocal(profile: ModelProfile, input: GenerationInput, signal: AbortSignal, fetcher: typeof fetch = fetch, onProgress?: (text: string) => void): Promise<string>
{
  const selected = structuredClone(readProfile(profile));
  const body = {
    model: selected.model,
    stream: Boolean(onProgress),
    messages: [
      { role: 'system', content: 'Continue the player’s fiction as narrative prose. Return only the next continuation. Do not call tools or change application state.' },
      ...(input.history.length ? [{ role: 'user', content: `Accepted story so far:\n\n${input.history.join('\n\n')}` }] : []),
      { role: 'user', content: input.input }
    ]
  };
  if (onProgress)
    return requestValue(selected, 'chat/completions', signal, (response, activeSignal) => readContinuationStream(response, activeSignal, onProgress), body, fetcher);
  const value = await requestValue(selected, 'chat/completions', signal, readJson, body, fetcher);
  const choice = isObject(value) && Array.isArray(value.choices) && value.choices.length === 1 ? value.choices[0] : null;
  const message = isObject(choice) && isObject(choice.message) ? choice.message : null;
  if (!isObject(choice) || choice.finish_reason !== 'stop' || !message || message.role !== 'assistant'
    || typeof message.content !== 'string' || message.tool_calls || message.function_call || message.refusal)
    throw new ModelError('The server did not return a complete text continuation. Incomplete output and tool calls were discarded.');
  try { plainTextToDocument(message.content); }
  catch { throw new ModelError('The server returned empty, malformed or oversized prose. No proposal was retained.'); }
  return message.content;
}
