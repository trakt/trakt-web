import { movieHistoryQuery } from '$lib/requests/queries/users/movieHistoryQuery.ts';
import { showHistoryQuery } from '$lib/requests/queries/users/showHistoryQuery.ts';
import { getPastMonthRange } from '$lib/utils/date/getPastMonthRange.ts';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

// TODO: add fetchAllPages or something
const HISTORY_LIMIT = 1000;

export function useHistory() {
  const params = {
    limit: HISTORY_LIMIT,
    ...getPastMonthRange(new Date()),
  };

  const movies = createQuery({
    ...movieHistoryQuery(params),
    staleTime: time.days(1),
  });

  const shows = createQuery({
    ...showHistoryQuery(params),
    staleTime: time.days(1),
  });

  return {
    historyMovies: derived(movies, ($movies) => $movies.data),
    historyShows: derived(shows, ($shows) => $shows.data),
  };
}
