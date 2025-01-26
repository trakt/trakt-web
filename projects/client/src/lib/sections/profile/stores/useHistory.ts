import { useQuery } from '$lib/features/query/useQuery';
import { movieHistoryQuery } from '$lib/requests/queries/users/movieHistoryQuery.ts';
import { showHistoryQuery } from '$lib/requests/queries/users/showHistoryQuery.ts';
import { getPastMonthRange } from '$lib/utils/date/getPastMonthRange.ts';
import { time } from '$lib/utils/timing/time.ts';
import { derived } from 'svelte/store';

// TODO: add fetchAllPages or something
const HISTORY_LIMIT = 1000;

export function useHistory() {
  const params = {
    limit: HISTORY_LIMIT,
    ...getPastMonthRange(new Date()),
  };

  const movies = useQuery({
    ...movieHistoryQuery(params),
    staleTime: time.days(1),
  });

  const shows = useQuery({
    ...showHistoryQuery(params),
    staleTime: time.days(1),
  });

  return {
    historyMovies: derived(movies, ($movies) => $movies.data),
    historyShows: derived(shows, ($shows) => $shows.data),
  };
}
