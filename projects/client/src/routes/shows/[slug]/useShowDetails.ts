import { useQuery } from '$lib/features/query/useQuery.ts';
import { showPeopleQuery } from '$lib/requests/queries/shows/showPeopleQuery.ts';
import { showRatingQuery } from '$lib/requests/queries/shows/showRatingQuery.ts';
import { showSeasonsQuery } from '$lib/requests/queries/shows/showSeasonsQuery.ts';
import { showStatsQuery } from '$lib/requests/queries/shows/showStatsQuery.ts';
import { showStudiosQuery } from '$lib/requests/queries/shows/showStudiosQuery.ts';
import { showWatchersQuery } from '$lib/requests/queries/shows/showWatchersQuery.ts';
import { streamShowQuery } from '$lib/requests/queries/shows/streamShowQuery.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { derived, get } from 'svelte/store';

export function useShowDetails(slug: string) {
  const { country, getPreferred } = useStreamingPreferences();

  const ratings = useQuery(showRatingQuery({ slug }));
  const seasons = useQuery(showSeasonsQuery({ slug }));
  const studios = useQuery(showStudiosQuery({ slug }));
  const crew = useQuery(showPeopleQuery({ slug }));
  const stats = useQuery(showStatsQuery({ slug }));
  const watchers = useQuery(showWatchersQuery({ slug }));
  const streamOn = useQuery(streamShowQuery({ slug, country: get(country) }));

  const queries = [
    ratings,
    stats,
    watchers,
    studios,
    crew,
    seasons,
    streamOn,
  ];

  const isLoading = derived(
    queries,
    ($queries) => $queries.some((query) => query.isPending),
  );

  return {
    isLoading,
    ratings: derived(ratings, ($ratings) => $ratings.data),
    stats: derived(stats, ($stats) => $stats.data),
    watchers: derived(watchers, ($watchers) => $watchers.data),
    studios: derived(studios, ($studios) => $studios.data),
    crew: derived(crew, ($crew) => $crew.data),
    seasons: derived(seasons, ($seasons) => $seasons.data),
    streamOn: derived(
      streamOn,
      ($streamOn) => {
        if (!$streamOn.data) {
          return;
        }

        return {
          services: $streamOn.data,
          preferred: getPreferred($streamOn.data),
        };
      },
    ),
  };
}
