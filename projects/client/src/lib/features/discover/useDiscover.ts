import { useToggler } from '$lib/components/toggles/useToggler.ts';
import { getDiscoverContext } from './_internal/getDiscoverContext.ts';
import type { DiscoverMode } from './models/DiscoverMode.ts';

export function useDiscover() {
  const { options, set } = useToggler('discover');
  const { mode, routes } = getDiscoverContext();

  const setMode = (value: DiscoverMode) => {
    mode.set(value);
    set(value);
  };

  return {
    options,
    setMode,
    mode,
    routes,
  };
}
