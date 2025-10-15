import { useToggler } from '$lib/components/toggles/useToggler.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { getDiscoverContext } from './_internal/getDiscoverContext.ts';

export function useDiscover() {
  const { options, set } = useToggler('discover');
  const { mode, routes } = getDiscoverContext();

  const setMode = (value: MediaType) => {
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
