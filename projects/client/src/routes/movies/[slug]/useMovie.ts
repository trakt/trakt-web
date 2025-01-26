import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery';
import { movieIntlQuery } from '$lib/requests/queries/movies/movieIntlQuery.ts';
import { moviePeopleQuery } from '$lib/requests/queries/movies/moviePeopleQuery.ts';
import { movieRatingQuery } from '$lib/requests/queries/movies/movieRatingQuery.ts';
import { movieStatsQuery } from '$lib/requests/queries/movies/movieStatsQuery.ts';
import { movieStudiosQuery } from '$lib/requests/queries/movies/movieStudiosQuery.ts';
import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import { movieWatchersQuery } from '$lib/requests/queries/movies/movieWatchersQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import { derived } from 'svelte/store';

export function useMovie(slug: string) {
  const movie = useQuery({
    ...movieSummaryQuery({
      slug,
    }),
    staleTime: time.days(1),
  });

  const ratings = useQuery({
    ...movieRatingQuery({
      slug,
    }),
    staleTime: time.days(1),
  });

  const stats = useQuery({
    ...movieStatsQuery({
      slug,
    }),
    staleTime: time.minutes(30),
  });

  const watchers = useQuery({
    ...movieWatchersQuery({
      slug,
    }),
    staleTime: time.minutes(5),
  });

  const studios = useQuery({
    ...movieStudiosQuery({ slug }),
    staleTime: time.days(1),
  });

  const crew = useQuery({
    ...moviePeopleQuery({ slug }),
    staleTime: time.days(1),
  });

  const locale = languageTag();

  const isLocaleSkipped = locale === 'en';
  const intl = isLocaleSkipped ? movie : useQuery({
    ...movieIntlQuery({ slug, ...getLanguageAndRegion() }),
    staleTime: time.days(7),
  });

  const queries = [movie, ratings, stats, watchers, studios, crew, intl];

  const isLoading = derived(
    queries,
    ($queries) => $queries.some((query) => query.isPending),
  );

  return {
    isLoading,
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
