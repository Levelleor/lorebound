export function autoSize(node: HTMLTextAreaElement, _value?: string): { update(): void; destroy(): void }
{
  let frame = 0;
  let width = node.clientWidth;
  const resize = () =>
  {
    node.style.height = 'auto';
    node.style.height = `${node.scrollHeight + node.offsetHeight - node.clientHeight}px`;
  };
  const schedule = () =>
  {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(resize);
  };
  const observer = new ResizeObserver(() =>
  {
    if (node.clientWidth === width) return;
    width = node.clientWidth;
    schedule();
  });
  observer.observe(node);
  node.addEventListener('input', schedule);
  node.ownerDocument.fonts.addEventListener('loadingdone', schedule);
  schedule();
  return {
    update: schedule,
    destroy: () =>
    {
      cancelAnimationFrame(frame);
      observer.disconnect();
      node.removeEventListener('input', schedule);
      node.ownerDocument.fonts.removeEventListener('loadingdone', schedule);
    }
  };
}
