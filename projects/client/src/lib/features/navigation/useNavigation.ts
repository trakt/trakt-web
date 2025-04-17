import { goto } from '$app/navigation';
import { page } from '$app/state';
import { dpadController } from '$lib/features/navigation/_internal/dpadController.ts';
import type { DeviceType } from '$lib/models/DeviceType.ts';

const PARAM_NAME = 'navigation';
const DPAD_REF = 'd-pad';

type NavigationType = 'default' | 'dpad';
type Controller = (node: HTMLElement) => void;

const navigationControllers: Record<NavigationType, Controller | undefined> = {
  'default': undefined,
  'dpad': dpadController,
};

export function useNavigation(device: DeviceType) {
  const ref = page.url.searchParams.get(PARAM_NAME);
  const hasDpadNavigation = device === 'tv' || ref === DPAD_REF;
  const navigationType: NavigationType = hasDpadNavigation ? 'dpad' : 'default';

  const redirect = () => {
    if (!page.url.searchParams.get(PARAM_NAME)) {
      return;
    }

    const url = new URL(page.url);
    url.searchParams.delete(PARAM_NAME);

    goto(url, {
      replaceState: true,
      keepFocus: true,
    });
  };

  return {
    controller: navigationControllers[navigationType],
    redirect,
  };
}
