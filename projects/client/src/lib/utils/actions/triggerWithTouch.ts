const MOVE_THRESHOLD_PIXELS = 15;

/**
 * This function is needed to handle touch events on iOS devices.
 * On iOS, touch events do not trigger click events by immediately in certain scenarios.
 * This utility ensures that a click event is triggered when a touch event ends,
 * providing a consistent user experience across different devices.
 */
export function triggerWithTouch(node: HTMLElement) {
  const state = {
    position: { x: 0, y: 0 },
  };

  const getPosition = ([touch]: TouchList) => ({
    x: touch?.clientX ?? 0,
    y: touch?.clientY ?? 0,
  });

  const getDelta = (touches: TouchList) => {
    const { x, y } = getPosition(touches);

    return {
      x: x - state.position.x,
      y: y - state.position.y,
    };
  };

  const handleTouchStart = (event: TouchEvent) => {
    state.position = getPosition(event.touches);
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const { x, y } = getDelta(event.changedTouches);

    if (
      y > MOVE_THRESHOLD_PIXELS ||
      x > MOVE_THRESHOLD_PIXELS
    ) {
      return;
    }

    const isElement = event.target instanceof HTMLElement;
    if (!isElement) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.target.click();
  };

  node.addEventListener('touchstart', handleTouchStart);
  node.addEventListener('touchend', handleTouchEnd);

  return {
    destroy() {
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchend', handleTouchEnd);
    },
  };
}
