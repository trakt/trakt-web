import { time } from '$lib/utils/timing/time.ts';
import { assertDefined } from '../../../utils/assert/assertDefined.ts';
import { getNavigationScope } from './getNavigationScope.ts';

const MAX_WAIT_TIME = time.seconds(5);
const CHECK_INTERVAL = time.fps(30);

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

      const hasLoadedElements = dynamicElements.every((element) => {
        const selector = assertDefined(
          element.getAttribute('data-dynamic-selector'),
          'Expected data-dynamic-selector attribute to be defined',
        );
        return element.querySelector(selector) !== null;
      });

      if (hasLoadedElements || elapsed >= MAX_WAIT_TIME) {
        clearInterval(intervalId);
        resolve(null);
      }
    }, CHECK_INTERVAL);
  });
}
