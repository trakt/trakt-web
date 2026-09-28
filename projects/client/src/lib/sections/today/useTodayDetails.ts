import { getLocale } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { movieRatingQuery } from '$lib/requests/queries/movies/movieRatingQuery.ts';
import { movieSentimentQuery } from '$lib/requests/queries/movies/movieSentimentQuery.ts';
import { showRatingQuery } from '$lib/requests/queries/shows/showRatingQuery.ts';
import { showSentimentQuery } from '$lib/requests/queries/shows/showSentimentQuery.ts';
import { map, type Observable } from 'rxjs';
import type { TodayMedia } from './models/TodayMedia.ts';

export function useTodayDetails(media$: Observable<TodayMedia>) {
  const locale = getLocale();

  const ratings = useQuery(
    media$.pipe(
      map(({ type, slug }) =>
        type === 'movie'
          ? movieRatingQuery({ slug })
          : showRatingQuery({ slug })
      ),
    ),
  );

  const sentiment = useQuery(
    media$.pipe(
      map(({ type, slug }) =>
        type === 'movie'
          ? movieSentimentQuery({ slug, locale, enabled: true })
          : showSentimentQuery({ slug, locale, enabled: true })
      ),
    ),
  );

  return {
    ratings: ratings.pipe(map((query) => query.data ?? null)),
    isRatingsLoading: ratings.pipe(map((query) => query.isLoading)),
    sentiment: sentiment.pipe(map((query) => query.data ?? null)),
  };
}
