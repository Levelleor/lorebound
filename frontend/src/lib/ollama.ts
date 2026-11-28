import { ModelError, contextOverflow, readJson, requestValue, type ModelEndpoint } from './modelTransport.ts';
import { isObject, plainTextToDocument } from './story.ts';
import type { TokenUsage } from './generationDiagnostics.ts';

interface Continuation
{
  text: string;
  usage: TokenUsage | null;
}

function invalidResponse(): ModelError
{
  return new ModelError('Ollama did not return a complete text continuation. Partial output and tool calls were discarded. Check the model and server settings.');
}

function readMessage(value: unknown): { content: string; done: boolean; reason: unknown }
{
  const overflow = contextOverflow(value);
  if (overflow) throw overflow;
  if (!isObject(value) || value.error || typeof value.done !== 'boolean' || !isObject(value.message)) throw invalidResponse();
  const message = value.message;
  if (message.role !== 'assistant' || typeof message.content !== 'string' || !message.content.isWellFormed()
    || (message.tool_calls !== undefined && (!Array.isArray(message.tool_calls) || message.tool_calls.length > 0))) throw invalidResponse();
  return { content: message.content, done: value.done, reason: value.done_reason };
}

function readUsage(value: unknown): TokenUsage | null
{
  if (!isObject(value)) return null;
  const count = (value: unknown) => Number.isSafeInteger(value) && Number(value) >= 0 ? Number(value) : null;
  const usage = { prompt: count(value.prompt_eval_count), completion: count(value.eval_count), total: null };
  return usage.prompt !== null || usage.completion !== null ? usage : null;
}

function readContinuation(value: unknown): Continuation
{
  const message = readMessage(value);
  if (!message.done || message.reason !== 'stop') throw invalidResponse();
  try { plainTextToDocument(message.content); }
  catch { throw invalidResponse(); }
  return { text: message.content, usage: readUsage(value) };
}

async function readStream(response: Response, signal: AbortSignal, onProgress: (text: string) => void): Promise<Continuation>
{
  if (!response.body) throw invalidResponse();
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let buffer = '';
  let text = '';
  let size = 0;
  const cancel = () => { void reader.cancel().catch(() => {}); };

  function readLine(line: string): Continuation | null
  {
    const value: unknown = JSON.parse(line);
    const message = readMessage(value);
    if (!message.done && message.reason !== undefined && message.reason !== '') throw invalidResponse();
    text += message.content;
    if (text.length > 40000 || [...text].length > 20000) throw invalidResponse();
    if (message.done)
    {
      if (message.reason !== 'stop') throw invalidResponse();
      plainTextToDocument(text);
      return { text, usage: readUsage(value) };
    }
    if (message.content) onProgress(text);
    return null;
  }

  signal.addEventListener('abort', cancel, { once: true });
  try
  {
    signal.throwIfAborted();
    if (response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/x-ndjson') throw invalidResponse();
    for (;;)
    {
      const { done, value } = await reader.read();
      signal.throwIfAborted();
      if (done)
      {
        buffer += decoder.decode();
        if (buffer.trim())
        {
          const result = readLine(buffer);
          if (result) return result;
        }
        throw invalidResponse();
      }
      size += value.byteLength;
      if (size > 1048576) throw invalidResponse();
      buffer += decoder.decode(value, { stream: true });
      for (;;)
      {
        const boundary = buffer.indexOf('\n');
        if (boundary < 0) break;
        const line = buffer.slice(0, boundary).trim();
        buffer = buffer.slice(boundary + 1);
        if (!line) continue;
        const result = readLine(line);
        signal.throwIfAborted();
        if (result) return result;
      }
    }
  }
  catch (cause)
  {
    signal.throwIfAborted();
    if (cause instanceof ModelError) throw cause;
    throw invalidResponse();
  }
  finally
  {
    signal.removeEventListener('abort', cancel);
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export async function discoverOllamaModels(profile: ModelEndpoint, signal: AbortSignal, fetcher: typeof fetch): Promise<string[]>
{
  const value = await requestValue(profile, 'tags', signal, readJson, undefined, fetcher);
  if (!isObject(value) || value.error || !Array.isArray(value.models) || value.models.length > 1000
    || !value.models.every(model => isObject(model) && typeof model.name === 'string' && model.name.trim() && model.name.isWellFormed() && [...model.name].length <= 200))
    throw new ModelError('Ollama returned an unsupported model list. Enter a model ID manually; discovery is optional.');
  return [...new Set(value.models.map(model => model.name as string))];
}

export async function testOllamaConnection(profile: ModelEndpoint & { model: string }, signal: AbortSignal, fetcher: typeof fetch): Promise<'complete' | 'limited'>
{
  const value = await requestValue(profile, 'chat', signal, readJson, {
    model: profile.model,
    stream: false,
    options: { num_predict: 32 },
    messages: [{ role: 'user', content: 'Reply with OK.' }]
  }, fetcher);
  const message = readMessage(value);
  if (!message.done || (message.reason !== 'stop' && message.reason !== 'length') || [...message.content].length > 20000) throw invalidResponse();
  if (message.reason === 'length') return 'limited';
  if (!message.content.trim()) throw new ModelError('Ollama returned no text. Check the model and server settings; full narration remains untested.');
  return 'complete';
}

export async function generateOllama(profile: ModelEndpoint, body: unknown, signal: AbortSignal, fetcher: typeof fetch, onProgress?: (text: string) => void): Promise<Continuation>
{
  if (onProgress) return requestValue(profile, 'chat', signal, (response, activeSignal) => readStream(response, activeSignal, onProgress), body, fetcher);
  const value = await requestValue(profile, 'chat', signal, readJson, body, fetcher);
  return readContinuation(value);
}
