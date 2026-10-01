const GESTURE_END_DELAY_MS = 150;

/**
 * Media queries cannot tell a trackpad from a mouse, so a horizontal wheel
 * gesture (only produced by trackpads and similar) dispatches a
 * `horizontalwheel` event once, letting the owner unlock horizontal scrolling.
 *
 * The browser decides at gesture start whether an element scrolls, so the
 * unlocking gesture itself would be lost on an `overflow: hidden` node. It is
 * scrolled manually until the gesture ends; later gestures scroll natively.
 */
export function unlockOnHorizontalWheel(node: HTMLElement) {
  const state = {
    unlocked: false,
    timeout: undefined as ReturnType<typeof setTimeout> | undefined,
  };

  const handleWheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

    event.preventDefault();
    /* Snapping would pull each small step back, which reads as being stuck. */
    node.style.scrollSnapType = 'none';
    node.scrollLeft += event.deltaX;

    if (!state.unlocked) {
      state.unlocked = true;
      node.dispatchEvent(new CustomEvent('horizontalwheel'));
    }

    clearTimeout(state.timeout);
    state.timeout = setTimeout(() => {
      node.style.scrollSnapType = '';
      node.removeEventListener('wheel', handleWheel);
    }, GESTURE_END_DELAY_MS);
  };

  node.addEventListener('wheel', handleWheel, { passive: false });

  return {
    destroy() {
      clearTimeout(state.timeout);
      node.style.scrollSnapType = '';
      node.removeEventListener('wheel', handleWheel);
    },
  };
}
