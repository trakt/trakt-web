/**
 * Dispatches a `touchscroll` event whenever a finger drags across the node.
 * The listener is passive, so it never delays the browser's own scrolling.
 */
export function touchScroll(node: HTMLElement) {
  const handleTouchMove = () =>
    node.dispatchEvent(new CustomEvent('touchscroll'));

  node.addEventListener('touchmove', handleTouchMove, { passive: true });

  return {
    destroy() {
      node.removeEventListener('touchmove', handleTouchMove);
    },
  };
}
