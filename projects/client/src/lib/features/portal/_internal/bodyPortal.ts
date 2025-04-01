export function bodyPortal(
  node: HTMLElement,
  targetRect: DOMRect,
) {
  node.style.position = 'absolute';
  node.style.left = `${globalThis.window.scrollX + targetRect.left}px`;
  node.style.top = `${globalThis.window.scrollY + targetRect.top}px`;
  node.style.zIndex = 'var(--layer-menu)';

  document.body.appendChild(node);
}
