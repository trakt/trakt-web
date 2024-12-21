import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { movieIntlQuery } from '$lib/requests/queries/movies/movieIntlQuery.ts';
import { movieRatingQuery } from '$lib/requests/queries/movies/movieRatingQuery.ts';
import { movieStatsQuery } from '$lib/requests/queries/movies/movieStatsQuery.ts';
import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import { movieWatchersQuery } from '$lib/requests/queries/movies/movieWatchersQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export function useMovie(slug: string) {
  const movie = createQuery(
    movieSummaryQuery({
      slug,
    }),
  );

  const ratings = createQuery(
    movieRatingQuery({
      slug,
    }),
  );

  const stats = createQuery(
    movieStatsQuery({
      slug,
    }),
  );

  const watchers = createQuery(
    movieWatchersQuery({
      slug,
    }),
  );

  const locale = languageTag();

  const isLocaleSkipped = locale === 'en';
  const intl = isLocaleSkipped
    ? movie
    : createQuery(movieIntlQuery({ slug, ...getLanguageAndRegion() }));

  return {
    movie: derived(movie, ($movie) => $movie.data),
    ratings: derived(ratings, ($rating) => $rating.data),
    stats: derived(stats, ($stats) => $stats.data),
    watchers: derived(watchers, ($watchers) => $watchers.data ?? []),
    intl: derived(
      [movie, intl],
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
          tagline: $intl?.data?.tagline ?? $movie?.data?.tagline ?? '',
        };
      },
    ),
  };
}
