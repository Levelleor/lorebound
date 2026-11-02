export interface HostInfo { name: string; schemaVersion: number }
export interface State { schemaVersion: number; epoch: string; version: number; value: string }
export interface CommitRequest { schemaVersion: number; epoch: string; expectedVersion: number; operationId: string; value: string }
export interface CommitResult { state: State; replayed: boolean }

interface WailsRuntime { Call: { ByName(name: string, ...args: unknown[]): Promise<unknown> } }
declare global { interface Window { wails?: WailsRuntime } }

async function call<T>(method: string, ...args: unknown[]): Promise<T> {
  if (!window.wails) throw new Error('Wails runtime unavailable');
  return await window.wails.Call.ByName(`main.GateService.${method}`, ...args) as T;
}

export const host = {
  ping: () => call<HostInfo>('Ping'),
  read: () => call<State>('Read'),
  commit: (request: CommitRequest) => call<CommitResult>('Commit', request)
};
