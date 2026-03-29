import { page } from '$app/state';
import { useToggler } from '$lib/components/toggles/useToggler.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { combineLatest, map } from 'rxjs';
import { AnalyticsEvent } from '../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../analytics/useTrack.ts';
import { useParameters } from '../parameters/useParameters.ts';
import { useSeasonalTheme } from '../theme/useSeasonalTheme.ts';
import {
  DISCOVER_MODE_PARAM,
  SEASONAL_STORAGE_KEY,
} from './_internal/constants/index.ts';
import { getDiscoverContext } from './_internal/getDiscoverContext.ts';
import type { DiscoverMode } from './models/DiscoverMode.ts';

export function useDiscover() {
  const { options, set, current } = useToggler('discover');
  const { useSeasonalFilters } = getDiscoverContext();
  const { track } = useTrack(AnalyticsEvent.DiscoverMode);
  const { activeTheme } = useSeasonalTheme();
  const { search } = useParameters();

  const mode = combineLatest([search, current]).pipe(
    map(([$search, $current]) => {
      const raw = $search.get(DISCOVER_MODE_PARAM);
      const isValid = options.some((o) => o.value === raw);

      if (!isValid) return $current.value;

      return raw as DiscoverMode;
    }),
  );

  const setMode = (value: DiscoverMode) => {
    track({ mode: value, source: page.route.id ?? 'unknown' });
    set(value);
  };

  return {
    options,
    current,
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
