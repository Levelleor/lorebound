import { isObject } from './story.ts';

export class ModelError extends Error {}

export function contextOverflow(value: unknown): ModelError | null
{
  const error = isObject(value) ? value.error : null;
  const codes = isObject(error) ? [error.code, error.type] : [];
  const message = isObject(error) ? error.message : error;
  const exceeded = typeof message === 'string' && (
    /(?:context (?:length|window|size|limit)|max(?:imum)? model len(?:gth)?).{0,120}(?:exceed|too (?:large|long)|only supports)/is.test(message)
    || /(?:exceed|too (?:large|long)|greater than|larger than).{0,120}(?:context (?:length|window|size|limit)|max(?:imum)? model len(?:gth)?)/is.test(message)
    || /maximum context length.{0,120}however,? you requested.{0,120}tokens/is.test(message)
  );
  return codes.includes('context_length_exceeded') || codes.includes('exceed_context_size') || exceeded
    ? new ModelError('The server reported that the request exceeds the model’s context capacity. Include fewer Lorebook entries or use a model with a larger context window. Your input is retained.')
    : null;
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

export async function readJson(response: Response, signal: AbortSignal): Promise<unknown>
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

export interface ModelEndpoint
{
  baseUrl: string;
  timeoutMs: number;
}

export async function requestValue<T>(profile: ModelEndpoint, path: string, signal: AbortSignal, read: (response: Response, signal: AbortSignal) => Promise<T>, body?: unknown, fetcher: typeof fetch = fetch): Promise<T>
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
      if ([400, 413, 422].includes(response.status))
      {
        const error = contextOverflow(await readJson(response, combined).catch(() => null));
        combined.throwIfAborted();
        if (error) throw error;
      }
      else await response.body?.cancel();
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

