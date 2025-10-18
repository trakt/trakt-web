import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { movieIntlQuery } from '$lib/requests/queries/movies/movieIntlQuery.ts';
import { moviePeopleQuery } from '$lib/requests/queries/movies/moviePeopleQuery.ts';
import { movieStudiosQuery } from '$lib/requests/queries/movies/movieStudiosQuery.ts';
import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import { movieVideosQuery } from '$lib/requests/queries/movies/movieVideosQuery.ts';
import { streamMovieQuery } from '$lib/requests/queries/movies/streamMovieQuery.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { findRegionalIntl } from '$lib/utils/media/findRegionalIntl.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived, get, readable } from 'svelte/store';

/*
  FIXME: Fix the root cause.
  Dealing with undefined slug is a temporary solution.
  The root cause is that one of the components can still handle
  a subscription/query which makes the page still reactive
  even when navigating away. Same for useShow.ts & MediaSummary.svelte
*/
export function useMovie(slug: string | undefined) {
  if (!slug) {
    return {
      isLoading: readable(true),
      movie: readable(undefined),
      studios: readable(undefined),
      crew: readable(undefined),
      videos: readable([]),
      intl: readable(undefined),
      streamOn: readable(undefined),
    };
  }

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
  const { language } = getLanguageAndRegion();

  const intl = useQuery(
    movieIntlQuery({ slug, language, enabled: !isLocaleSkipped }),
  );

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
    ($queries) => $queries.some(toLoadingState),
  );

  return {
    isLoading,
    movie: derived(movie, ($movie) => $movie.data),
    studios: derived(studios, ($studios) => $studios.data),
    crew: derived(crew, ($crew) => $crew.data),
    videos: derived(videos, ($videos) => $videos.data ?? []),
    intl: derived([intl, movie], ([$intl, $movie]) =>
      findRegionalIntl({
        type: 'movie',
        translations: $intl.data,
        fallback: $movie.data,
      })),
    streamOn: derived(streamOn, ($streamOn) => {
      if (!$streamOn.data) {
        return;
      }

      return {
        services: $streamOn.data,
        preferred: getPreferred($streamOn.data),
      };
    }),
  };
}
