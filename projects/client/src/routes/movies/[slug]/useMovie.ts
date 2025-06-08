import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { movieIntlQuery } from '$lib/requests/queries/movies/movieIntlQuery.ts';
import { moviePeopleQuery } from '$lib/requests/queries/movies/moviePeopleQuery.ts';
import { movieStudiosQuery } from '$lib/requests/queries/movies/movieStudiosQuery.ts';
import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import { movieVideosQuery } from '$lib/requests/queries/movies/movieVideosQuery.ts';
import { streamMovieQuery } from '$lib/requests/queries/movies/streamMovieQuery.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { toMediaIntl } from '$lib/utils/media/toMediaIntl.ts';
import { derived, get } from 'svelte/store';

export function useMovie(slug: string) {
  const { country, getPreferred } = useStreamingPreferences();

  const movie = useQuery(movieSummaryQuery({
    slug,
  }));

  const studios = useQuery(movieStudiosQuery({ slug }));
  const crew = useQuery(moviePeopleQuery({ slug }));

  const videos = useQuery(movieVideosQuery({
    slug,
  }));

  const locale = languageTag();

  const isLocaleSkipped = locale === 'en';
  const intl = isLocaleSkipped
    ? movie
    : useQuery(movieIntlQuery({ slug, ...getLanguageAndRegion() }));

  const streamOn = useQuery(streamMovieQuery({ slug, country: get(country) }));

  const queries = [
    movie,
    studios,
    crew,
    intl,
    streamOn,
    videos,
  ];

  const isLoading = derived(
    queries,
    ($queries) => $queries.some((query) => query.isPending),
  );

  return {
    isLoading,
    movie: derived(movie, ($movie) => $movie.data),
    studios: derived(studios, ($studios) => $studios.data),
    crew: derived(crew, ($crew) => $crew.data),
    videos: derived(videos, ($videos) => $videos.data ?? []),
    intl: derived([intl, movie], ([$intl, $movie]) => {
      if ($intl.isFetching || $movie.isFetching) {
        return;
      }

      return toMediaIntl($intl?.data, $movie?.data);
    }),
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
