import { useQuery } from '$lib/features/query/useQuery';
import { upcomingEpisodesQuery } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState';
import { time } from '$lib/utils/timing/time.ts';
import { derived } from 'svelte/store';

const ONE_DAY = 1000 * 60 * 60 * 24;

function daysAgo(days: number) {
  return new Date(Date.now() - ONE_DAY * days);
}

export function useCalendarEpisodes() {
  const [YYYY_MM_DD] = daysAgo(0).toISOString().split('T');

  const query = useQuery({
    ...upcomingEpisodesQuery({
      startDate: assertDefined(YYYY_MM_DD, 'Could not extract current date.'),
      days: 14,
    }),
    staleTime: time.hours(1),
    refetchOnWindowFocus: true,
  });

  const calendar = derived(
    query,
    ($query) =>
      ($query.data ?? []).filter((d) => {
        const distanceFromNow = d.airDate.getTime() - Date.now();
        return distanceFromNow > 0;
      }),
  );

  const isLoading = derived(
    query,
    toLoadingState,
  );

  return { calendar, isLoading };
}
