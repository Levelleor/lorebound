import type { ModelServer } from './modelServers.ts';
import type { LoreContext } from './lorebook.ts';

export interface TokenUsage
{
  prompt: number | null;
  completion: number | null;
  total: number | null;
}

export interface GenerationDetails
{
  profileName: string;
  server: ModelServer;
  requestedModel: string;
  streaming: boolean;
  timeoutMs: number;
  usage: TokenUsage | null;
  narration?: string;
  authorNotes?: string;
  lorebook?: LoreContext;
}

export interface GenerationDiagnostics extends GenerationDetails
{
  status: 'running' | 'complete' | 'failed' | 'stopped';
  elapsedMs: number | null;
}

export type DiagnosticsObserver = (details: GenerationDetails) => void;
