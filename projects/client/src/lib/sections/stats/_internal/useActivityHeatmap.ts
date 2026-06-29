import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { getLocale } from '$lib/features/i18n/index.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import { map } from 'rxjs';
import { computeActivityHeatmap } from './computeActivityHeatmap.ts';
import { filterWatchedDates } from './filterWatchedDates.ts';

type UseActivityHeatmapProps = {
  mode: DiscoverMode;
  period?: 'month' | 'week';
};

export function useActivityHeatmap({
  mode,
  period = 'month',
}: UseActivityHeatmapProps) {
  const { history } = useUser();

  const now = new Date();
  const locale = getLocale();

  const heatmap = history.pipe(
    map(($history) => {
      if (!$history) return null;

      const watchedDates = filterWatchedDates($history, mode);

      return computeActivityHeatmap(watchedDates, now, locale, period);
    }),
    multicast(),
  );

  return {
    heatmap: heatmap.pipe(map(($h) => $h ?? null)),
    isLoading: heatmap.pipe(map(($h) => $h === null)),
  };
}
