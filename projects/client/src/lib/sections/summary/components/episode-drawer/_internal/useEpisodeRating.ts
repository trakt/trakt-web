import { EMPTY_RATINGS } from '$lib/components/summary/_internal/getDisplayableRatings.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { episodeRatingQuery } from '$lib/requests/queries/episode/episodeRatingQuery.ts';
import { map, type Observable } from 'rxjs';
import type { EpisodeSummaryParams } from './useEpisodeSummary.ts';

export function useEpisodeRating(params$: Observable<EpisodeSummaryParams>) {
  const query = useQuery(
    params$.pipe(map((params) => episodeRatingQuery(params))),
  );

  return {
    ratings: query.pipe(map(($query) => $query.data ?? EMPTY_RATINGS)),
    isLoading: query.pipe(map(($query) => $query.isLoading)),
  };
}
