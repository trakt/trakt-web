import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { episodeIntlQuery } from '$lib/requests/queries/episode/episodeIntlQuery.ts';
import { episodePeopleQuery } from '$lib/requests/queries/episode/episodePeopleQuery.ts';
import { episodeRatingQuery } from '$lib/requests/queries/episode/episodeRatingQuery.ts';
import { episodeStatsQuery } from '$lib/requests/queries/episode/episodeStatsQuery.ts';
import { episodeSummaryQuery } from '$lib/requests/queries/episode/episodeSummaryQuery.ts';
import {
  episodeWatchersQuery,
} from '$lib/requests/queries/episode/episodeWatchersQuery.ts';
import { streamEpisodeQuery } from '$lib/requests/queries/episode/streamEpisodeQuery.ts';
import { showSeasonsQuery } from '$lib/requests/queries/shows/showSeasonsQuery.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { derived, get } from 'svelte/store';

type UseEpisodeParams = {
  slug: string;
  season: number;
  episode: number;
};

export function useEpisode(
  params: UseEpisodeParams,
) {
  const { country, getPreferred } = useStreamingPreferences();

  const episode = useQuery(episodeSummaryQuery(params));
  const seasons = useQuery(showSeasonsQuery(params));
  const ratings = useQuery(episodeRatingQuery(params));
  const stats = useQuery(episodeStatsQuery(params));
  const watchers = useQuery(episodeWatchersQuery(params));
  const crew = useQuery(episodePeopleQuery(params));

  const locale = languageTag();

  const isLocaleSkipped = locale === 'en';
  const intl = isLocaleSkipped
    ? episode
    : useQuery(episodeIntlQuery({ ...params, ...getLanguageAndRegion() }));

  const streamOn = useQuery(streamEpisodeQuery({
    ...params,
    country: get(country),
  }));

  const queries = [
    episode,
    seasons,
    ratings,
    stats,
    watchers,
    intl,
    crew,
    streamOn,
  ];

  const isLoading = derived(
    queries,
    ($queries) => $queries.some((query) => query.isPending),
  );

  return {
    isLoading,
    episode: derived(episode, ($episode) => $episode.data),
    seasons: derived(
      [
        seasons,
        episode,
      ],
      ([$seasons, $episode]) =>
        $seasons.data?.filter((season) =>
          season.number === $episode.data?.season
        ),
    ),
    ratings: derived(ratings, ($rating) => $rating.data),
    stats: derived(stats, ($stats) => $stats.data),
    watchers: derived(watchers, ($watchers) => $watchers.data ?? []),
    crew: derived(crew, ($crew) => $crew.data),
    intl: derived(
      [episode, intl],
      ([$episode, $intl]) => {
        if (isLocaleSkipped) {
          return $intl.data;
        }

        if ($intl.isFetching) {
          return;
        }

        return {
          title: $intl?.data?.title ?? $episode?.data?.title ?? '',
          overview: $intl?.data?.overview ?? $episode?.data?.overview ?? '',
        };
      },
    ),
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
