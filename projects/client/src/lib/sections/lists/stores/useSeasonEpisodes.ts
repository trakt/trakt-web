import { useQuery } from '$lib/features/query/useQuery.ts';
import { showSeasonEpisodesQuery } from '$lib/requests/queries/shows/showSeasonEpisodesQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

export const useSeasonEpisodes = (slug: string, season: number) => {
  const query = useQuery(showSeasonEpisodesQuery({
    slug,
    season,
  }));

  return {
    list: derived(query, ($query) => $query.data ?? []),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
};
