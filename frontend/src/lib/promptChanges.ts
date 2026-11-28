interface PromptChange
{
  epoch: string;
  adventureId?: string;
}

const eventName = 'lorebound-prompt-change';

export function announcePromptChange(change: PromptChange): void
{
  window.dispatchEvent(new CustomEvent(eventName, { detail: change }));
  if (typeof BroadcastChannel === 'undefined') return;
  const channel = new BroadcastChannel(eventName);
  channel.postMessage(change);
  channel.close();
}

export function watchPromptChanges(onChange: (change: PromptChange, remote: boolean) => void): () => void
{
  const receiveLocal = (event: Event) => onChange((event as CustomEvent<PromptChange>).detail, false);
  window.addEventListener(eventName, receiveLocal);
  const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(eventName);
  if (channel) channel.onmessage = event => onChange(event.data, true);

  return () =>
  {
    window.removeEventListener(eventName, receiveLocal);
    channel?.close();
  };
}
