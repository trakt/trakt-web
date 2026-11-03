import { pauseScrollSnap } from '$lib/utils/scroll/pauseScrollSnap.ts';

const GESTURE_END_DELAY_MS = 150;

/**
 * Media queries cannot tell a trackpad from a mouse, so a horizontal wheel
 * gesture (only produced by trackpads and similar) dispatches a
 * `horizontalwheel` event once per lock, letting the owner unlock horizontal
 * scrolling. Passing `isUnlocked: false` again re-arms it.
 *
 * The browser decides at gesture start whether an element scrolls, so the
 * unlocking gesture itself would be lost on an `overflow: hidden` node. It is
 * scrolled manually until the gesture ends; later gestures scroll natively.
 */
export function unlockOnHorizontalWheel(node: HTMLElement, isUnlocked = false) {
  const state = {
    unlocked: isUnlocked,
    timeout: undefined as ReturnType<typeof setTimeout> | undefined,
    release: undefined as (() => void) | undefined,
  };

  const resumeSnapping = () => {
    state.release?.();
    state.release = undefined;
  };

  const handleWheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

    event.preventDefault();
    /* Snapping would pull each small step back, which reads as being stuck. */
    state.release ??= pauseScrollSnap(node);
    node.scrollLeft += event.deltaX;

    if (!state.unlocked) {
      state.unlocked = true;
      node.dispatchEvent(new CustomEvent('horizontalwheel'));
    }

    clearTimeout(state.timeout);
    state.timeout = setTimeout(() => {
      resumeSnapping();
      node.removeEventListener('wheel', handleWheel);
    }, GESTURE_END_DELAY_MS);
  };

  const arm = () => {
    clearTimeout(state.timeout);
    resumeSnapping();
    state.unlocked = false;
    node.addEventListener('wheel', handleWheel, { passive: false });
  };

  if (!isUnlocked) arm();

  return {
    update(next = false) {
      if (next || !state.unlocked) return;
      arm();
    },
    destroy() {
      clearTimeout(state.timeout);
      resumeSnapping();
      node.removeEventListener('wheel', handleWheel);
    },
  };
}
