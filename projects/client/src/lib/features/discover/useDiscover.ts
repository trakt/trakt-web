import { page } from '$app/state';
import { useToggler } from '$lib/components/toggles/useToggler.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { combineLatest, map } from 'rxjs';
import { AnalyticsEvent } from '../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../analytics/useTrack.ts';
import { useSeasonalTheme } from '../theme/useSeasonalTheme.ts';
import { SEASONAL_STORAGE_KEY } from './_internal/constants/index.ts';
import { getDiscoverContext } from './_internal/getDiscoverContext.ts';
import type { DiscoverMode } from './models/DiscoverMode.ts';

export function useDiscover() {
  const { options, set } = useToggler('discover');
  const { mode, useSeasonalFilters } = getDiscoverContext();
  const { track } = useTrack(AnalyticsEvent.DiscoverMode);
  const { activeTheme } = useSeasonalTheme();

  const setMode = (value: DiscoverMode) => {
    track({ mode: value, source: page.route.id ?? 'unknown' });
    mode.next(value);
    set(value);
  };

  return {
    options,
    setMode,
    mode,
    useSeasonalFilters: combineLatest(
      [useSeasonalFilters, activeTheme],
    ).pipe(
      map(([$useSeasonalFilters, $activeTheme]) => {
        if ($activeTheme === null) {
          return false;
        }

        return $useSeasonalFilters;
      }),
    ),
    setSeasonalFilters: (value: boolean) => {
      useSeasonalFilters.next(value);
      safeLocalStorage.setItem(SEASONAL_STORAGE_KEY, JSON.stringify(value));
    },
  };
}
