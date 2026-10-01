/**
 * Dispatches a `touchscroll` event when the node scrolls while a finger is
 * down, so vertical page swipes that start on it do not count. Listeners are
 * passive, so they never delay the browser's own scrolling.
 */
export function touchScroll(node: HTMLElement, isEnabled = true) {
  if (!isEnabled) return {};

  const state = { isTouching: false };

  const handleTouchStart = () => (state.isTouching = true);
  const handleTouchEnd = () => (state.isTouching = false);
  const handleScroll = () => {
    if (!state.isTouching) return;
    node.dispatchEvent(new CustomEvent('touchscroll'));
  };

  node.addEventListener('touchstart', handleTouchStart, { passive: true });
  node.addEventListener('touchend', handleTouchEnd, { passive: true });
  node.addEventListener('touchcancel', handleTouchEnd, { passive: true });
  node.addEventListener('scroll', handleScroll, { passive: true });

  return {
    destroy() {
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchend', handleTouchEnd);
      node.removeEventListener('touchcancel', handleTouchEnd);
      node.removeEventListener('scroll', handleScroll);
    },
  };
}
