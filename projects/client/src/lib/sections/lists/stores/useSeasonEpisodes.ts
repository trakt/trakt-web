import { showSeasonEpisodesQuery } from '$lib/requests/queries/shows/showSeasonEpisodesQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export const useSeasonEpisodes = (slug: string, season: number) => {
  const query = createQuery({
    ...showSeasonEpisodesQuery({
      slug,
      season,
    }),
    staleTime: time.hours(1),
  });

  return {
    list: derived(query, ($query) => $query.data ?? []),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
};
