import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useLastWatched } from '$lib/features/toast/useLastWatched.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { addRatingRequest } from '$lib/requests/sync/addRatingRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import type { RatingsSyncRequest } from '@trakt/api';
import { derived, get, writable } from 'svelte/store';

type RateableType = ExtendedMediaType;

export type WatchlistStoreProps = {
  type: RateableType;
  id: number;
};

function toRatingPayload(
  type: RateableType,
  id: number,
  rating: number,
): RatingsSyncRequest {
  const ratingPayload = {
    ids: { trakt: id },
    rating,
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

export function useRatings({ type, id }: WatchlistStoreProps) {
  const pendingRating = writable<null | number>(null);
  const { ratings, favorites } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Rate);
  const { dismiss } = useLastWatched();

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

  const isFavorited = derived(
    favorites,
    ($favorites) => {
      if (!$favorites) {
        return false;
      }

      switch (type) {
        case 'movie':
          return $favorites.movies.has(id);
        case 'show':
          return $favorites.shows.has(id);
        case 'episode':
          return false;
      }
    },
  );

  const current = derived(
    [rating, isFavorited],
    ([$rating, $isFavorited]) => {
      if (!$rating) {
        return;
      }

      return {
        rating: $rating.rating,
        isFavorited: $isFavorited,
      };
    },
  );

  const addRating = async (newRating: number) => {
    pendingRating.set(newRating);
    track({
      action: get(current) ? 'changed' : 'added',
      rating: newRating,
    });

    await addRatingRequest({
      body: toRatingPayload(type, id, newRating),
    });
    await invalidate(InvalidateAction.Rated(type));

    pendingRating.set(null);
    dismiss(id, type);
  };

  return {
    pendingRating,
    current,
    addRating,
  };
}
