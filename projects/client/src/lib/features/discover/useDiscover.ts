import { page } from '$app/state';
import { useToggler } from '$lib/components/toggles/useToggler.ts';
import { AnalyticsEvent } from '../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../analytics/useTrack.ts';
import { getDiscoverContext } from './_internal/getDiscoverContext.ts';
import type { DiscoverMode } from './models/DiscoverMode.ts';

export function useDiscover() {
  const { options, set } = useToggler('discover');
  const { mode, routes } = getDiscoverContext();
  const { track } = useTrack(AnalyticsEvent.DiscoverMode);

  const setMode = (value: DiscoverMode) => {
    track({ mode: value, source: page.route.id ?? 'unknown' });
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
