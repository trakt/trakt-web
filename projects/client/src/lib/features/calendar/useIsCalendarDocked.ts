import { useMedia } from '$lib/stores/css/useMedia.ts';
import { breakpointTabletLgMin } from '$style/scss/variables/index.ts';

export function useIsCalendarDocked() {
  return useMedia(`(min-width: ${breakpointTabletLgMin})`);
}
