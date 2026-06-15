import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { EMPTY_CREW } from '$lib/requests/_internal/mapToMediaCrew.ts';
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
import { combineLatest, type Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export function useMovie(slug$: Observable<string>) {
  const { isAuthorized } = useAuth();
  const { country, favorites } = useStreamingPreferences();

  const movie = useQuery(
    slug$.pipe(map((slug) => movieSummaryQuery({ slug }))),
  );

  const studios = useQuery(
    slug$.pipe(map((slug) => movieStudiosQuery({ slug }))),
  );
  const crew = useQuery(slug$.pipe(map((slug) => moviePeopleQuery({ slug }))));

  const sentiment = combineLatest([
    isAuthorized,
    useQuery(
      combineLatest([slug$, isAuthorized]).pipe(
        map(([slug, authorized]) =>
          movieSentimentQuery({ slug, enabled: authorized })
        ),
      ),
    ),
  ]).pipe(
    map(([authorized, query]) => (authorized ? query : undefined)),
    shareReplay(1),
  );

  const videos = useQuery(
    slug$.pipe(map((slug) => movieVideosQuery({ slug }))),
  );

  const locale = languageTag();
  const isLocaleSkipped = locale === 'en';
  const { language } = getLanguageAndRegion();

  const intl = useQuery(
    slug$.pipe(
      map((slug) =>
        movieIntlQuery({ slug, language, enabled: !isLocaleSkipped })
      ),
    ),
  );

  const streamOnQuery = useQuery(
    combineLatest([slug$, country]).pipe(
      map(([slug, country]) => streamMovieQuery({ slug, country })),
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
  // Keep isLoading true until the core movie payload is present -
  // queries can flip to !fetching while `data` is still undefined
  // (errored or empty), which would otherwise let the page render
  // a half-populated summary.
  const isLoading = combineLatest([
    isQueriesLoading,
    isSentimentLoading,
    movie,
  ]).pipe(
    map(([queriesLoading, sentimentLoading, $movie]) =>
      queriesLoading || sentimentLoading || $movie.data == null
    ),
  );

  return {
    isLoading,
    movie: movie.pipe(map(($movie) => $movie.data)),
    studios: studios.pipe(map(($studios) => $studios.data ?? [])),
    crew: crew.pipe(map(($crew) => $crew.data ?? EMPTY_CREW)),
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
