export interface TokenUsage
{
  prompt: number | null;
  completion: number | null;
  total: number | null;
}

export interface GenerationDetails
{
  profileName: string;
  server: 'llamacpp' | 'custom' | 'ollama';
  requestedModel: string;
  streaming: boolean;
  timeoutMs: number;
  usage: TokenUsage | null;
}

export interface GenerationDiagnostics extends GenerationDetails
{
  status: 'running' | 'complete' | 'failed' | 'stopped';
  elapsedMs: number | null;
}

export type DiagnosticsObserver = (details: GenerationDetails) => void;
