import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useLastWatched } from '$lib/features/toast/useLastWatched.ts';
import { SimpleRating } from '$lib/models/SimpleRating.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { addRatingRequest } from '$lib/requests/sync/addRatingRequest.ts';
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

export function useRatings({ type, id }: WatchlistStoreProps) {
  const isRating = writable(false);
  const { ratings } = useUser();
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

  const currentRating = derived(
    rating,
    ($rating) => {
      if (!$rating) {
        return;
      }

      return mapRatingToSimpleRating($rating.rating);
    },
  );

  const addRating = async (simpleRating: SimpleRating) => {
    isRating.set(true);
    track({
      action: get(currentRating) ? 'changed' : 'added',
      rating: simpleRating,
    });

    await addRatingRequest({
      body: toRatingPayload(type, id, simpleRating),
    });
    await invalidate(InvalidateAction.Rated(type));

    isRating.set(false);
    dismiss(id, type);
  };

  return {
    isRating,
    currentRating,
    addRating,
  };
}
