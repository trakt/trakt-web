import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { SimpleRating } from '$lib/models/SimpleRating.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { addRatingRequest } from '$lib/requests/sync/addRatingRequest.ts';
import { mapRatingToSimpleRating } from '$lib/sections/summary/components/rating/mapRatingToSimpleRating.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import type { RatingsRequest } from '@trakt/api';
import { derived, writable } from 'svelte/store';
import { SIMPLE_RATINGS } from './constants.ts';

type RateableType = 'movie' | 'episode';

export type WatchlistStoreProps = {
  type: RateableType;
  id: number;
};

function toRatingPayload(
  type: RateableType,
  id: number,
  simpleRating: SimpleRating,
): RatingsRequest {
  const ratingPayload = {
    ids: { trakt: id },
    rating: SIMPLE_RATINGS[simpleRating],
  };

  switch (type) {
    case 'movie':
      return {
        movies: [ratingPayload],
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

  const rating = derived(
    ratings,
    ($ratings) => {
      if (!$ratings) {
        return;
      }

      switch (type) {
        case 'movie':
          return $ratings.movies.get(id);
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
    await addRatingRequest({
      body: toRatingPayload(type, id, simpleRating),
    });
    await invalidate(InvalidateAction.Rated(type));

    isRating.set(false);
  };

  return {
    isRating,
    currentRating,
    addRating,
  };
}
