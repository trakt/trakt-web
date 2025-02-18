import { useQuery } from '$lib/features/query/useQuery.ts';
import { getPastMonthRange } from '$lib/utils/date/getPastMonthRange.ts';
import { derived } from 'svelte/store';
import { movieActivityHistoryQuery } from '../../../requests/queries/users/movieActivityHistoryQuery.ts';
import { showActivityHistoryQuery } from '../../../requests/queries/users/showActivityHistoryQuery.ts';

// TODO: add fetchAllPages or something
const HISTORY_LIMIT = 1000;

export function useHistory() {
  const params = {
    limit: HISTORY_LIMIT,
    ...getPastMonthRange(new Date()),
  };

  const movies = useQuery(movieActivityHistoryQuery(params));
  const shows = useQuery(showActivityHistoryQuery(params));

  return {
    historyMovies: derived(movies, ($movies) => $movies.data?.entries),
    historyShows: derived(shows, ($shows) => $shows.data?.entries),
  };
}
