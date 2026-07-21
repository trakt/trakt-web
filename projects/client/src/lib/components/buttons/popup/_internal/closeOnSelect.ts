export function closeOnSelect(node: HTMLElement, close: () => void) {
  let onSelect = close;

  const handler = () => queueMicrotask(() => onSelect());

  node.addEventListener('click', handler);

  return {
    update(next: () => void) {
      onSelect = next;
    },
    destroy() {
      node.removeEventListener('click', handler);
    },
  };
}
