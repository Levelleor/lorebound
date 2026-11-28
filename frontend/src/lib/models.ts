import { ModelError, contextOverflow, endpointUrl, readJson, requestValue, type ModelEndpoint } from './modelTransport.ts';
import { discoverOllamaModels, generateOllama, testOllamaConnection } from './ollama.ts';
import { isModelServer, type ModelServer } from './modelServers.ts';
export { ModelError, endpointUrl } from './modelTransport.ts';
import { schemaVersion } from './library.ts';
import { isID, isObject, plainTextToDocument } from './story.ts';
import type { GenerationInput } from './coordinator.ts';
import type { DiagnosticsObserver, TokenUsage } from './generationDiagnostics.ts';
import { narrationInstructions, type NarrationStyle } from './narration.ts';
import { authorNotesGuidance, readAuthorNotesText } from './authorNotes.ts';
import { loreContext, type LoreEntry } from './lorebook.ts';

export interface ModelProfile
{
  id: string;
  name: string;
  kind: ModelServer;
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

export function modelError(cause: unknown): string
{
  return cause instanceof ModelError ? cause.message
    : 'The response could not be prepared. Your input is retained. Check Models and try again.';
}

export function readProfile(value: unknown): ModelProfile
{
  if (!isObject(value) || Object.keys(value).length !== 6 || !isID(value.id)
    || !isModelServer(value.kind)
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

function readUsage(value: unknown): TokenUsage | null
{
  if (!isObject(value)) return null;
  const count = (value: unknown) => Number.isSafeInteger(value) && Number(value) >= 0 ? Number(value) : null;
  const usage = { prompt: count(value.prompt_tokens), completion: count(value.completion_tokens), total: count(value.total_tokens) };
  return Object.values(usage).some(value => value !== null) ? usage : null;
}

async function readContinuationStream(response: Response, signal: AbortSignal, onProgress: (text: string) => void): Promise<{ text: string; usage: TokenUsage | null }>
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
  let usage: TokenUsage | null = null;
  const cancel = () => { void reader.cancel().catch(() => {}); };

  function dispatch(): void
  {
    if (!data.length) { event = ''; return; }
    const frameEvent = event;
    const payload = data.join('\n');
    data = [];
    event = '';
    if (payload === '[DONE]')
    {
      if (!stopped || (frameEvent && frameEvent !== 'message')) throw invalid();
      plainTextToDocument(text);
      completed = true;
      return;
    }
    const value: unknown = JSON.parse(payload);
    const overflow = contextOverflow(value);
    if (overflow) throw overflow;
    if ((frameEvent && frameEvent !== 'message') || !isObject(value) || value.error || !Array.isArray(value.choices)) throw invalid();
    if (value.usage !== undefined) usage = readUsage(value.usage);
    // Compatible servers may send a final usage-only chunk. It is not prose.
    if (value.choices.length === 0 && stopped && value.usage !== undefined) return;
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
        if (completed) return { text, usage };
      }
    }
    return { text, usage };
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

export async function discoverModels(profile: ModelEndpoint & { kind?: ModelProfile['kind'] }, signal: AbortSignal, fetcher: typeof fetch = fetch): Promise<string[]>
{
  if (profile.kind === 'ollama') return discoverOllamaModels(profile, signal, fetcher);
  const value = await requestValue(profile, 'models', signal, readJson, undefined, fetcher);
  if (!isObject(value) || !Array.isArray(value.data) || value.data.length > 1000
    || !value.data.every(model => isObject(model) && typeof model.id === 'string' && model.id.trim() && model.id.isWellFormed() && [...model.id].length <= 200))
    throw new ModelError('The model list was not compatible. Enter a model ID manually; generation does not require discovery.');
  return [...new Set(value.data.map(model => model.id as string))];
}

export async function testConnection(profile: ModelEndpoint & Pick<ModelProfile, 'kind' | 'model'>, signal: AbortSignal, fetcher: typeof fetch = fetch): Promise<'complete' | 'limited'>
{
  const selected = { ...profile };
  if (!isModelServer(selected.kind))
    throw new ModelError('Choose a supported server type before testing the connection.');
  if (typeof selected.model !== 'string' || !selected.model.trim() || !selected.model.isWellFormed() || [...selected.model].length > 200)
    throw new ModelError('Enter a model ID up to 200 characters before testing the connection. Discovery is optional.');
  if (selected.kind === 'ollama') return testOllamaConnection(selected, signal, fetcher);
  const value = await requestValue(selected, 'chat/completions', signal, readJson, {
    model: selected.model,
    stream: false,
    max_tokens: 32,
    ...(selected.kind === 'llamacpp' ? { chat_template_kwargs: { enable_thinking: false } } : {}),
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

export async function generateLocal(profile: ModelProfile, input: GenerationInput, signal: AbortSignal, fetcher: typeof fetch = fetch, onProgress?: (text: string) => void, onDiagnostics?: DiagnosticsObserver, style?: NarrationStyle, authorNotes?: string, loreEntries?: readonly LoreEntry[]): Promise<string>
{
  const selected = structuredClone(readProfile(profile));
  const narration = style ? narrationInstructions(style) : '';
  const notes = authorNotes === undefined ? '' : authorNotesGuidance(authorNotes);
  const lorebook = loreEntries === undefined ? undefined : loreContext(loreEntries);
  const guidance = [narration, notes, lorebook?.text].filter(Boolean).join('\n\n');
  const details = {
    profileName: selected.name,
    server: selected.kind,
    requestedModel: selected.model,
    streaming: Boolean(onProgress),
    timeoutMs: selected.timeoutMs,
    usage: null,
    ...(style ? { narration } : {}),
    ...(authorNotes === undefined ? {} : { authorNotes: readAuthorNotesText(authorNotes) }),
    ...(lorebook ? { lorebook } : {})
  };
  const dispatch: typeof fetch = (url, options) =>
  {
    const response = fetcher(url, options);
    onDiagnostics?.(details);
    return response;
  };
  const body = {
    model: selected.model,
    stream: Boolean(onProgress),
    messages: [
      { role: 'system', content: 'Continue the player’s fiction as narrative prose. Return only the next continuation. Do not call tools or change application state.' + (guidance ? `\n\n${guidance}` : '') },
      ...(input.history.length ? [{ role: 'user', content: `Accepted story so far:\n\n${input.history.join('\n\n')}` }] : []),
      { role: 'user', content: input.input }
    ]
  };
  if (selected.kind === 'ollama')
  {
    const result = await generateOllama(selected, body, signal, dispatch, onProgress);
    onDiagnostics?.({ ...details, usage: result.usage });
    return result.text;
  }
  if (onProgress)
  {
    const result = await requestValue(selected, 'chat/completions', signal, (response, activeSignal) => readContinuationStream(response, activeSignal, onProgress), body, dispatch);
    onDiagnostics?.({ ...details, usage: result.usage });
    return result.text;
  }
  const value = await requestValue(selected, 'chat/completions', signal, readJson, body, dispatch);
  const overflow = contextOverflow(value);
  if (overflow) throw overflow;
  const choice = isObject(value) && Array.isArray(value.choices) && value.choices.length === 1 ? value.choices[0] : null;
  const message = isObject(choice) && isObject(choice.message) ? choice.message : null;
  if (!isObject(choice) || choice.finish_reason !== 'stop' || !message || message.role !== 'assistant'
    || typeof message.content !== 'string' || message.tool_calls || message.function_call || message.refusal)
    throw new ModelError('The server did not return a complete text continuation. Incomplete output and tool calls were discarded.');
  try { plainTextToDocument(message.content); }
  catch { throw new ModelError('The server returned empty, malformed or oversized prose. No proposal was retained.'); }
  onDiagnostics?.({ ...details, usage: isObject(value) ? readUsage(value.usage) : null });
  return message.content;
}
