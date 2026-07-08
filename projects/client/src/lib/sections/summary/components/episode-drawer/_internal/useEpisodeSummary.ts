import { useQuery } from '$lib/features/query/useQuery.ts';
import { episodeSummaryQuery } from '$lib/requests/queries/episode/episodeSummaryQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, type Observable } from 'rxjs';

export type EpisodeSummaryParams = {
  slug: string;
  season: number;
  episode: number;
};

export function useEpisodeSummary(params$: Observable<EpisodeSummaryParams>) {
  const query = useQuery(
    params$.pipe(map((params) => episodeSummaryQuery(params))),
  );

  return {
    episode: query.pipe(map(($query) => $query.data)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
