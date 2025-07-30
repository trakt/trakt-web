export function bodyPortal(
  node: HTMLElement,
  targetRect: DOMRect,
) {
  node.style.position = 'absolute';
  node.style.zIndex = 'var(--layer-menu)';

  const openDialog = document.querySelector('dialog[open]');
  if (openDialog) {
    const dialogRect = openDialog.getBoundingClientRect();

    node.style.left = `${targetRect.left - dialogRect.left}px`;
    node.style.top = `${targetRect.top - dialogRect.top}px`;

    openDialog.appendChild(node);
    return;
  }

  node.style.left = `${globalThis.window.scrollX + targetRect.left}px`;
  node.style.top = `${globalThis.window.scrollY + targetRect.top}px`;
  document.body.appendChild(node);
}
