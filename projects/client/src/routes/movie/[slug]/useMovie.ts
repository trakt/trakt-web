import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { movieIntlQuery } from '$lib/requests/queries/movies/movieIntlQuery.ts';
import { movieRatingQuery } from '$lib/requests/queries/movies/movieRatingQuery.ts';
import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
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

  const locale = languageTag();

  const intl = locale === 'en'
    ? movie
    : createQuery(movieIntlQuery({ slug, ...getLanguageAndRegion() }));

  return {
    movie: derived(movie, ($movie) => $movie.data),
    ratings: derived(ratings, ($rating) => $rating.data),
    intl: derived(
      [movie, intl],
      ([$movie, $intl]) => {
        if ($intl.isFetching) {
          return undefined;
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
