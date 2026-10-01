/**
 * Media queries cannot tell a trackpad from a mouse, so a horizontal wheel
 * gesture (only produced by trackpads and similar) dispatches a
 * `horizontalwheel` event once, letting the owner unlock horizontal scrolling.
 */
export function unlockOnHorizontalWheel(node: HTMLElement) {
  const handleWheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

    node.dispatchEvent(new CustomEvent('horizontalwheel'));
    node.removeEventListener('wheel', handleWheel);
  };

  node.addEventListener('wheel', handleWheel, { passive: true });

  return {
    destroy() {
      node.removeEventListener('wheel', handleWheel);
    },
  };
}
