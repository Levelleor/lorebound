export const modelServers = {
  llamacpp: {
    label: 'llama.cpp (llama-server)',
    baseUrl: 'http://127.0.0.1:8081/v1',
    guidance: 'Include /v1 and use the server’s actual port. The server must allow this Lorebound browser origin.'
  },
  ollama: {
    label: 'Ollama (native API)',
    baseUrl: 'http://127.0.0.1:11434/api',
    guidance: 'Include /api, for example http://127.0.0.1:11434/api. Ollama must allow this browser origin (OLLAMA_ORIGINS).'
  },
  lmstudio: {
    label: 'LM Studio',
    baseUrl: 'http://127.0.0.1:1234/v1',
    guidance: 'Use LM Studio’s compatible /v1 API and actual server port (usually 1234). Enable browser CORS access in its server settings. Authentication is not supported yet.'
  },
  vllm: {
    label: 'vLLM',
    baseUrl: 'http://127.0.0.1:8000/v1',
    guidance: 'Use vLLM’s compatible /v1 API and actual server port (usually 8000). Allow this Lorebound origin, POST and Content-Type in its CORS settings. The model needs a chat template. Authentication is not supported yet.'
  },
  custom: {
    label: 'Custom compatible endpoint',
    baseUrl: 'http://127.0.0.1:8081/v1',
    guidance: 'Include the API path, usually /v1. Use the server’s actual port; it must allow this Lorebound browser origin.'
  }
} as const;

export type ModelServer = keyof typeof modelServers;

export function isModelServer(value: unknown): value is ModelServer
{
  return typeof value === 'string' && Object.hasOwn(modelServers, value);
}
