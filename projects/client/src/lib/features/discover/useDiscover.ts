import { page } from '$app/state';
import { useToggler } from '$lib/components/toggles/useToggler.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { derived } from 'svelte/store';
import { AnalyticsEvent } from '../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../analytics/useTrack.ts';
import { SEASONAL_STORAGE_KEY } from './_internal/constants/index.ts';
import { getDiscoverContext } from './_internal/getDiscoverContext.ts';
import type { DiscoverMode } from './models/DiscoverMode.ts';

export function useDiscover() {
  const { options, set } = useToggler('discover');
  const { mode, useSeasonalFilters } = getDiscoverContext();
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
    useSeasonalFilters: derived(
      useSeasonalFilters,
      ($useSeasonalFilters) => $useSeasonalFilters,
    ),
    setSeasonalFilters: (value: boolean) => {
      useSeasonalFilters.set(value);
      safeLocalStorage.setItem(SEASONAL_STORAGE_KEY, JSON.stringify(value));
    },
  };
}
