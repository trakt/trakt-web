import { page } from '$app/state';
import { dpadController } from '$lib/features/navigation/_internal/dpadController.ts';
import type { NavigationType } from '$lib/features/navigation/models/NavigationType.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { getContext, setContext } from 'svelte';
import { get, type Readable, readable } from 'svelte/store';

const NAVIGATION_CONTEXT_KEY = Symbol('navigation');
const PARAM_NAME = 'navigation';
const DPAD_REF = 'd-pad';

type Controller = (node: HTMLElement) => void;
type NavigationContextData = Readable<NavigationType>;

const navigationControllers: Record<NavigationType, Controller | undefined> = {
  'default': undefined,
  'dpad': dpadController,
};

export function initializeNavigation() {
  const ref = page.url.searchParams.get(PARAM_NAME);
  const hasDpadNavigation = ref === DPAD_REF;
  const navigationType = hasDpadNavigation ? 'dpad' : 'default';

  const navigation =
    getContext<NavigationContextData>(NAVIGATION_CONTEXT_KEY) ??
      setContext<NavigationContextData>(
        NAVIGATION_CONTEXT_KEY,
        readable(navigationType),
      );

  return {
    controller: navigationControllers[get(navigation)],
  };
}

export function useNavigation() {
  return {
    navigation: assertDefined<Readable<NavigationType>>(
      getContext<NavigationContextData>(NAVIGATION_CONTEXT_KEY),
      'Navigation can only be used within the NavigationProvider context.',
    ),
  };
}
