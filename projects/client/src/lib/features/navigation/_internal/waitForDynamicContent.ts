import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { time } from '$lib/utils/timing/time.ts';
import { getNavigationScope } from './getNavigationScope.ts';

export const MAX_WAIT_TIME = time.seconds(5);
export const CHECK_INTERVAL = time.fps(30);

export function waitForDynamicContent() {
  const scope = getNavigationScope();

  const dynamicElements = Array.from(scope.querySelectorAll(
    '[data-dynamic-selector]',
  ));

  if (dynamicElements.length === 0) return Promise.resolve(null);

  return new Promise((resolve) => {
    let elapsed = 0;

    const intervalId = setInterval(() => {
      elapsed += CHECK_INTERVAL;

      if (dynamicElements.some((element) => !element.isConnected)) {
        clearInterval(intervalId);
        resolve(null);
        return;
      }

      const hasLoadedElements = dynamicElements.every((element) => {
        const selector = assertDefined(
          element.getAttribute('data-dynamic-selector'),
          'Expected data-dynamic-selector attribute to be defined',
        );

        const dynamicContent = element.querySelector(selector);
        if (!dynamicContent) {
          return false;
        }

        return dynamicContent.querySelector('.loading-indicator') === null;
      });

      if (hasLoadedElements || elapsed >= MAX_WAIT_TIME) {
        clearInterval(intervalId);
        resolve(null);
      }
    }, CHECK_INTERVAL);
  });
}
