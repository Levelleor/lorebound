interface CaretViewport
{
  viewport?: HTMLElement;
  enabled: boolean;
}

export function keepCaretInView(node: HTMLTextAreaElement, options: CaretViewport): { update(next: CaretViewport): void; destroy(): void }
{
  let frame = 0;
  const reveal = () =>
  {
    const viewport = options.viewport;
    if (!options.enabled || !viewport || node.ownerDocument.activeElement !== node) return;

    // Native textarea caret scrolling does not follow an auto-grown outer viewport.
    const style = getComputedStyle(node);
    const mirror = node.ownerDocument.createElement('div');
    mirror.setAttribute('aria-hidden', 'true');
    mirror.style.cssText = 'position:fixed;top:0;left:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none;white-space:pre-wrap;overflow-wrap:break-word;border-style:solid;';
    for (const property of [
      'boxSizing', 'width', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'fontStretch', 'fontVariant',
      'fontFeatureSettings', 'fontVariationSettings', 'fontKerning', 'lineHeight', 'letterSpacing', 'wordSpacing',
      'textTransform', 'textIndent', 'textAlign', 'direction', 'tabSize', 'wordBreak',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'
    ] as const)
    {
      mirror.style[property] = style[property];
    }
    const position = node.selectionDirection === 'backward' ? node.selectionStart : node.selectionEnd;
    mirror.textContent = node.value.slice(0, position);
    const marker = node.ownerDocument.createElement('span');
    marker.textContent = node.value.slice(position) || '.';
    mirror.append(marker);
    node.ownerDocument.body.append(mirror);
    const caret = marker.getClientRects()[0] ?? marker.getBoundingClientRect();
    const top = node.getBoundingClientRect().top + caret.top - mirror.getBoundingClientRect().top - node.scrollTop;
    const bottom = top + (parseFloat(style.lineHeight) || caret.height);
    mirror.remove();

    const bounds = viewport.getBoundingClientRect();
    if (top < bounds.top + 8) viewport.scrollTop += top - bounds.top - 8;
    else if (bottom > bounds.bottom - 8) viewport.scrollTop += bottom - bounds.bottom + 8;
  };
  const schedule = () =>
  {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(reveal);
  };
  const observer = new ResizeObserver(schedule);
  const observe = () =>
  {
    observer.disconnect();
    observer.observe(node);
    if (options.viewport) observer.observe(options.viewport);
  };
  observe();
  const events = ['input', 'keyup', 'select', 'focus'];
  for (const event of events) node.addEventListener(event, schedule);
  node.ownerDocument.fonts.addEventListener('loadingdone', schedule);
  return {
    update: next =>
    {
      const changed = options.viewport !== next.viewport || options.enabled !== next.enabled;
      options = next;
      if (!changed) return;
      observe();
      schedule();
    },
    destroy: () =>
    {
      cancelAnimationFrame(frame);
      observer.disconnect();
      for (const event of events) node.removeEventListener(event, schedule);
      node.ownerDocument.fonts.removeEventListener('loadingdone', schedule);
    }
  };
}
