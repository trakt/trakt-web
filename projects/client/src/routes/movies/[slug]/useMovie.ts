import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { movieIntlQuery } from '$lib/requests/queries/movies/movieIntlQuery.ts';
import { moviePeopleQuery } from '$lib/requests/queries/movies/moviePeopleQuery.ts';
import { movieRatingQuery } from '$lib/requests/queries/movies/movieRatingQuery.ts';
import { movieStatsQuery } from '$lib/requests/queries/movies/movieStatsQuery.ts';
import { movieStudiosQuery } from '$lib/requests/queries/movies/movieStudiosQuery.ts';
import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import { movieWatchersQuery } from '$lib/requests/queries/movies/movieWatchersQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery } from '@tanstack/svelte-query';
import { onMount } from 'svelte';
import { derived } from 'svelte/store';

export function useMovie(slug: string) {
  const movie = createQuery({
    ...movieSummaryQuery({
      slug,
    }),
    staleTime: time.days(1),
  });

  const ratings = createQuery({
    ...movieRatingQuery({
      slug,
    }),
    staleTime: time.days(1),
  });

  const stats = createQuery({
    ...movieStatsQuery({
      slug,
    }),
    staleTime: time.minutes(30),
  });

  const watchers = createQuery({
    ...movieWatchersQuery({
      slug,
    }),
    staleTime: time.minutes(5),
  });

  const studios = createQuery({
    ...movieStudiosQuery({ slug }),
    staleTime: time.days(1),
  });

  const crew = createQuery({
    ...moviePeopleQuery({ slug }),
    staleTime: time.days(1),
  });

  const locale = languageTag();

  const isLocaleSkipped = locale === 'en';
  const intl = isLocaleSkipped ? movie : createQuery({
    ...movieIntlQuery({ slug, ...getLanguageAndRegion() }),
    staleTime: time.days(7),
  });

  // TODO: remove this when we have empty state, make sure requests fire in parallel
  const queries = [movie, ratings, stats, watchers, studios, crew, intl];

  onMount(() => {
    queries.forEach((query) => query.subscribe(() => {}));
  });

  return {
    movie: derived(movie, ($movie) => $movie.data),
    ratings: derived(ratings, ($rating) => $rating.data),
    stats: derived(stats, ($stats) => $stats.data),
    watchers: derived(watchers, ($watchers) => $watchers.data),
    studios: derived(studios, ($studios) => $studios.data),
    crew: derived(crew, ($crew) => $crew.data),
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
