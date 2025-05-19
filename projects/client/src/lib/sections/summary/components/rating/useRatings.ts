import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { SimpleRating } from '$lib/models/SimpleRating.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { addRatingRequest } from '$lib/requests/sync/addRatingRequest.ts';
import { addToFavoritesRequest } from '$lib/requests/sync/addToFavoritesRequest.ts';
import { removeFromFavoritesRequest } from '$lib/requests/sync/removeFromFavoritesRequest.ts';
import { mapRatingToSimpleRating } from '$lib/sections/summary/components/rating/mapRatingToSimpleRating.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import type { RatingsSyncRequest } from '@trakt/api';
import { derived, get, writable } from 'svelte/store';
import { SIMPLE_RATINGS } from './constants.ts';

type RateableType = MediaType | 'episode';

export type WatchlistStoreProps = {
  type: RateableType;
  id: number;
};

function toRatingPayload(
  type: RateableType,
  id: number,
  simpleRating: SimpleRating,
): RatingsSyncRequest {
  const ratingPayload = {
    ids: { trakt: id },
    rating: SIMPLE_RATINGS[simpleRating],
  };

  switch (type) {
    case 'movie':
      return {
        movies: [ratingPayload],
      };
    case 'show':
      return {
        shows: [ratingPayload],
      };
    case 'episode':
      return {
        episodes: [ratingPayload],
      };
  }
}

function favoriteQueryFactory(
  simpleRating: SimpleRating,
  isFavorited: boolean,
) {
  if (!isFavorited && simpleRating === SimpleRating.Great) {
    return addToFavoritesRequest;
  }

  if (isFavorited && simpleRating !== SimpleRating.Great) {
    return removeFromFavoritesRequest;
  }
}

export function useRatings({ type, id }: WatchlistStoreProps) {
  const isRating = writable(false);
  const { ratings, favorites } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Rate);

  const isFavorited = derived(
    favorites,
    ($favorites) => {
      if (!$favorites || type === 'episode') {
        return false;
      }

      return $favorites.movies.has(id);
    },
  );

  const rating = derived(
    ratings,
    ($ratings) => {
      if (!$ratings) {
        return;
      }

      switch (type) {
        case 'movie':
          return $ratings.movies.get(id);
        case 'show':
          return $ratings.shows.get(id);
        case 'episode':
          return $ratings.episodes.get(id);
      }
    },
  );

  const currentRating = derived(
    rating,
    ($rating) => {
      if (!$rating) {
        return;
      }

      return mapRatingToSimpleRating($rating.rating);
    },
  );

  const addRating = async (simpleRating: SimpleRating, isFavorited = false) => {
    isRating.set(true);
    track({
      action: get(currentRating) ? 'changed' : 'added',
      rating: simpleRating,
    });

    await addRatingRequest({
      body: toRatingPayload(type, id, simpleRating),
    });
    await invalidate(InvalidateAction.Rated(type));

    const favoritesQuery = favoriteQueryFactory(simpleRating, isFavorited);
    if (type === 'movie' && favoritesQuery) {
      await favoritesQuery({
        body: {
          movies: [{ ids: { trakt: id } }],
        },
      });

      await invalidate(InvalidateAction.Favorited(type));
    }

    isRating.set(false);
  };

  return {
    isRating,
    isFavorited,
    currentRating,
    addRating,
  };
}
