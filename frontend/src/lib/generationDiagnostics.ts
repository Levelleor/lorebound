import type { ModelServer } from './modelServers.ts';
import type { LoreContext } from './lorebook.ts';
import type { StoryContextReport } from './storyPrompt.ts';

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
  context?: StoryContextReport;
}

export interface GenerationDiagnostics extends GenerationDetails
{
  status: 'running' | 'complete' | 'failed' | 'stopped';
  elapsedMs: number | null;
}

export type DiagnosticsObserver = (details: GenerationDetails) => void;
