import { useQuery } from '$lib/features/query/useQuery.ts';
import { showSeasonEpisodesQuery } from '$lib/requests/queries/shows/showSeasonEpisodesQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map } from 'rxjs';

export const useSeasonEpisodes = (slug: string, season: number) => {
  const query = useQuery(showSeasonEpisodesQuery({
    slug,
    season,
  }));
  const query$ = toObservable(query);

  return {
    list: query$.pipe(map((q) => q.data ?? [])),
    isLoading: query$.pipe(map(toLoadingState)),
  };
};
