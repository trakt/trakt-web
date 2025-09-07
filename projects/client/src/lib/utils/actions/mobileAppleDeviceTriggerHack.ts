import { NOOP_FN } from '../constants.ts';
import { isMobileAppleDevice } from '../devices/isMobileAppleDevice.ts';

/**
 * This function is needed to handle touch events on mobile Apple devices.
 * On iOS & iPadOS, touch events do not trigger click events by immediately in certain scenarios.
 * This utility ensures that a click event is triggered when a touch event ends,
 * providing a consistent user experience across different devices.
 */
export function mobileAppleDeviceTriggerHack(node: HTMLAnchorElement) {
  if (!isMobileAppleDevice()) {
    return {
      destroy: NOOP_FN,
    };
  }

  const handleTouchEnd = (event: PointerEvent) => {
    const isMouse = event.pointerType === 'mouse';

    if (isMouse) {
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

  node.addEventListener('pointerup', handleTouchEnd);

  return {
    destroy() {
      node.removeEventListener('pointerup', handleTouchEnd);
    },
  };
}
