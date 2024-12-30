import { getLanguageAndRegion, languageTag } from '$lib/features/i18n';
import { episodeIntlQuery } from '$lib/requests/queries/episode/episodeIntlQuery';
import { episodeRatingQuery } from '$lib/requests/queries/episode/episodeRatingQuery';
import { episodeStatsQuery } from '$lib/requests/queries/episode/episodeStatsQuery';
import { episodeSummaryQuery } from '$lib/requests/queries/episode/episodeSummaryQuery';
import {
  episodeWatchersQuery,
} from '$lib/requests/queries/episode/episodeWatchersQuery';
import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

type UseEpisodeParams = {
  slug: string;
  season: number;
  episode: number;
};

export function useEpisode(
  params: UseEpisodeParams,
) {
  const show = createQuery({
    ...showSummaryQuery(params),
    staleTime: time.days(1),
  });

  const episode = createQuery({
    ...episodeSummaryQuery(params),
    staleTime: time.days(1),
  });

  const ratings = createQuery({
    ...episodeRatingQuery(params),
    staleTime: time.days(1),
  });

  const stats = createQuery({
    ...episodeStatsQuery(params),
    staleTime: time.minutes(30),
  });

  const watchers = createQuery({
    ...episodeWatchersQuery(params),
    staleTime: time.minutes(5),
  });

  const locale = languageTag();

  const isLocaleSkipped = locale === 'en';
  const intl = isLocaleSkipped ? episode : createQuery({
    ...episodeIntlQuery({ ...params, ...getLanguageAndRegion() }),
    staleTime: time.days(7),
  });

  const queries = [show, episode, ratings, stats, watchers, intl];

  const isLoading = derived(
    queries,
    ($queries) => $queries.some((query) => query.isPending),
  );

  return {
    isLoading,
    show: derived(show, ($show) => $show.data),
    episode: derived(episode, ($movie) => $movie.data),
    ratings: derived(ratings, ($rating) => $rating.data),
    stats: derived(stats, ($stats) => $stats.data),
    watchers: derived(watchers, ($watchers) => $watchers.data ?? []),
    intl: derived(
      [episode, intl],
      ([$movie, $intl]) => {
        if (isLocaleSkipped) {
          return $intl.data;
        }

        if ($intl.isFetching) {
          return;
        }

        return {
          title: $intl?.data?.title ?? $movie?.data?.title ?? '',
          overview: $intl?.data?.overview ?? $movie?.data?.overview ?? '',
        };
      },
    ),
  };
}
