const UNLOCKED_ATTRIBUTE = 'data-horizontal-scroll';

/**
 * Media queries cannot tell a trackpad from a mouse, so a horizontal wheel
 * gesture (only produced by trackpads and similar) marks the node as
 * horizontally scrollable.
 */
export function unlockOnHorizontalWheel(node: HTMLElement) {
  const handleWheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

    node.setAttribute(UNLOCKED_ATTRIBUTE, 'true');
    node.removeEventListener('wheel', handleWheel);
  };

  node.addEventListener('wheel', handleWheel, { passive: true });

  return {
    destroy() {
      node.removeEventListener('wheel', handleWheel);
    },
  };
}
