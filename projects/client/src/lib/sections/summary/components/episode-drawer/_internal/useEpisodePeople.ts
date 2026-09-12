import { useSplitCast } from '$lib/features/feature-flag/useSplitCast.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { EMPTY_CREW } from '$lib/requests/_internal/mapToMediaCrew.ts';
import { episodePeopleQuery } from '$lib/requests/queries/episode/episodePeopleQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import type { EpisodeSummaryParams } from './useEpisodeSummary.ts';

export function useEpisodePeople(params$: Observable<EpisodeSummaryParams>) {
  const query = useQuery(
    combineLatest([params$, useSplitCast()]).pipe(
      map(([params, guestStars]) =>
        episodePeopleQuery({ ...params, guestStars })
      ),
    ),
  );

  return {
    crew: query.pipe(map(($query) => $query.data ?? EMPTY_CREW)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
