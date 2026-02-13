import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { movieIntlQuery } from '$lib/requests/queries/movies/movieIntlQuery.ts';
import { moviePeopleQuery } from '$lib/requests/queries/movies/moviePeopleQuery.ts';
import { movieSentimentQuery } from '$lib/requests/queries/movies/movieSentimentQuery.ts';
import { movieStudiosQuery } from '$lib/requests/queries/movies/movieStudiosQuery.ts';
import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import { movieVideosQuery } from '$lib/requests/queries/movies/movieVideosQuery.ts';
import { streamMovieQuery } from '$lib/requests/queries/movies/streamMovieQuery.ts';
import { findPreferredStreamingService } from '$lib/stores/_internal/findPreferredStreamingService.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { findRegionalIntl } from '$lib/utils/media/findRegionalIntl.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

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
      isLoading: of(true),
      movie: of(undefined),
      studios: of(undefined),
      crew: of(undefined),
      videos: of([]),
      intl: of(undefined),
      streamOn: of(undefined),
      sentiment: of(undefined),
    };
  }

  const { isAuthorized } = useAuth();
  const { country, favorites } = useStreamingPreferences();

  const movie = useQuery(movieSummaryQuery({
    slug,
  }));

  const studios = useQuery(movieStudiosQuery({ slug }));
  const crew = useQuery(moviePeopleQuery({ slug }));

  const sentiment = isAuthorized.pipe(
    switchMap((authorized) => {
      if (!authorized) return of(undefined);
      return useQuery(movieSentimentQuery({ slug }));
    }),
    shareReplay(1),
  );

  const videos = useQuery(movieVideosQuery({
    slug,
  }));

  const locale = languageTag();
  const isLocaleSkipped = locale === 'en';
  const { language } = getLanguageAndRegion();

  const intl = useQuery(
    movieIntlQuery({ slug, language, enabled: !isLocaleSkipped }),
  );

  const streamOnQuery = useQuery(
    country.pipe(
      map((country) => streamMovieQuery({ slug, country })),
    ),
  );

  const queries = [
    movie,
    studios,
    crew,
    intl,
    videos,
  ];

  const isQueriesLoading = combineLatest(queries).pipe(
    map(($queries) => $queries.some(toLoadingState)),
  );
  const isSentimentLoading = sentiment.pipe(
    map((query) => query ? toLoadingState(query) : false),
  );
  const isLoading = combineLatest([isQueriesLoading, isSentimentLoading]).pipe(
    map((states) => states.some(Boolean)),
  );

  return {
    isLoading,
    movie: movie.pipe(map(($movie) => $movie.data)),
    studios: studios.pipe(map(($studios) => $studios.data)),
    crew: crew.pipe(map(($crew) => $crew.data)),
    videos: videos.pipe(map(($videos) => $videos.data ?? [])),
    sentiment: sentiment.pipe(map(($sentiment) => $sentiment?.data)),
    intl: combineLatest([intl, movie]).pipe(
      map(([$intl, $movie]) =>
        findRegionalIntl({
          type: 'movie',
          translations: $intl.data,
          fallback: $movie.data,
        })
      ),
    ),
    streamOn: combineLatest([streamOnQuery, favorites, country]).pipe(
      map(([$streamOn, $favorites, $country]) => {
        if (!$streamOn.data) {
          return;
        }

        return {
          services: $streamOn.data,
          preferred: findPreferredStreamingService({
            services: $streamOn.data,
            favorites: $favorites,
            countryCode: $country,
          }),
        };
      }),
    ),
  };
}
