import { test } from 'node:test';
import assert from 'node:assert/strict';
import { discoverModels, generateLocal, readConnections, testConnection, type ModelProfile } from '../src/lib/models.ts';
import { isModelServer, modelServers } from '../src/lib/modelServers.ts';
import type { GenerationDetails } from '../src/lib/generationDiagnostics.ts';

for (const kind of ['lmstudio', 'vllm'] as const)
{
  const profile: ModelProfile = { id: kind, name: kind, kind, baseUrl: modelServers[kind].baseUrl, model: 'chosen-model', timeoutMs: 1000 };
  const input = { input: 'Player prose.', history: ['Accepted prose.'] };
  const complete = { choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: 'Complete prose.' } }], usage: { prompt_tokens: 4, completion_tokens: 3, total_tokens: 7 } };
  const json = (value: unknown) => new Response(JSON.stringify(value));
  const frame = (content: string, finish: string | null = null) => `data: ${JSON.stringify({ choices: [{ index: 0, delta: { content }, finish_reason: finish }] })}\n\n`;
  const stream = (text: string) => new Response(text, { headers: { 'Content-Type': 'text/event-stream' } });

  test(`DEV-004F: ${kind} round-trips strict profiles and uses compatible discovery/test paths`, async () =>
  {
    const settings = { schemaVersion: 4, epoch: 'epoch', revision: 1, mode: 'local', activeProfileId: kind, profiles: [profile] };
    assert.deepEqual(readConnections(settings, 'epoch'), settings);
    let calls = 0;
    const fetcher: typeof fetch = async (url, options) =>
    {
      calls++;
      assert.equal(options?.credentials, 'omit');
      assert.equal(options?.redirect, 'error');
      assert.equal(options?.referrerPolicy, 'no-referrer');
      assert.equal(options?.mode, 'cors');
      assert.equal(options?.cache, 'no-store');
      if (options?.method === 'GET')
      {
        assert.equal(url, `${profile.baseUrl}/models`);
        assert.equal(options.body, undefined);
        return json({ data: [{ id: 'chosen-model' }, { id: 'chosen-model' }] });
      }
      assert.equal(url, `${profile.baseUrl}/chat/completions`);
      assert.deepEqual(JSON.parse(String(options?.body)), {
        model: profile.model, stream: false, max_tokens: 32, messages: [{ role: 'user', content: 'Reply with OK.' }]
      });
      return json(complete);
    };
    assert.deepEqual(await discoverModels(profile, new AbortController().signal, fetcher), ['chosen-model']);
    assert.equal(await testConnection(profile, new AbortController().signal, fetcher), 'complete');
    assert.equal(calls, 2);
  });

  test(`DEV-004F: ${kind} completed/SSE prose shares terminal validation and captured diagnostics`, async () =>
  {
    for (const streaming of [false, true])
    {
      const details: GenerationDetails[] = [];
      const previews: string[] = [];
      const result = await generateLocal(profile, input, new AbortController().signal, async (url, options) =>
      {
        assert.equal(url, `${profile.baseUrl}/chat/completions`);
        assert.deepEqual(JSON.parse(String(options?.body)), {
          model: 'chosen-model', stream: streaming,
          messages: [
            { role: 'system', content: 'Continue the player’s fiction as narrative prose. Return only the next continuation. Do not call tools or change application state.' },
            { role: 'user', content: 'Accepted story so far:\n\nAccepted prose.' },
            { role: 'user', content: 'Player prose.' }
          ]
        });
        return streaming ? stream(frame('Complete prose.') + frame('', 'stop') + 'data: [DONE]\n\n') : json(complete);
      }, streaming ? text => previews.push(text) : undefined, value => details.push(value));
      assert.equal(result, 'Complete prose.');
      assert.equal(details.at(-1)?.server, kind);
      assert.equal(details.at(-1)?.requestedModel, 'chosen-model');
      assert.deepEqual(details.at(-1)?.usage, streaming ? null : { prompt: 4, completion: 3, total: 7 });
      assert.deepEqual(previews, streaming ? ['Complete prose.'] : []);
    }
    for (const text of [frame('Partial.'), frame('Partial.') + frame('', 'stop'), frame('Partial.') + frame('', 'length') + 'data: [DONE]\n\n'])
      await assert.rejects(generateLocal(profile, input, new AbortController().signal, async () => stream(text), () => {}), /complete text continuation/);
    await assert.rejects(generateLocal(profile, input, new AbortController().signal, async () => json({ choices: [{ ...complete.choices[0], finish_reason: 'length' }] })), /complete text continuation/);
  });
}

test('DEV-004F: server metadata rejects inherited, array and unknown kinds', () =>
{
  for (const value of ['toString', '__proto__', ['lmstudio'], 'future-server', null])
    assert.equal(isModelServer(value), false);
});
