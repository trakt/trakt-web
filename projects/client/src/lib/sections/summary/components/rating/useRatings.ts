import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useLastWatched } from '$lib/features/toast/useLastWatched.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { addRatingRequest } from '$lib/requests/sync/addRatingRequest.ts';
import { removeRatingRequest } from '$lib/requests/sync/removeRatingRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { RatingsSyncRequest, RemoveRatingsParams } from '@trakt/api';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  filter,
  firstValueFrom,
  map,
  Subject,
} from 'rxjs';

const postDelay = time.seconds(0.5);

type RateableType = ExtendedMediaType;

export type WatchlistStoreProps = {
  type: RateableType;
  id: number;
};

function toAddPayload(
  type: RateableType,
  id: number,
  rating: number,
): RatingsSyncRequest {
  const payload = { ids: { trakt: id }, rating };
  const key = `${type}s` as const;
  return { [key]: [payload] };
}

function toRemovePayload(
  type: RateableType,
  id: number,
): RemoveRatingsParams {
  const payload = { ids: { trakt: id } };
  const key = `${type}s` as const;
  return { [key]: [payload] };
}

export function useRatings({ type, id }: WatchlistStoreProps) {
  const pendingRating = new BehaviorSubject<null | number>(null);
  const { ratings, favorites } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Rate);
  const { dismiss } = useLastWatched();

  const rating = ratings.pipe(
    map(($ratings) => {
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
    }),
  );

  const isFavorited = favorites.pipe(
    map(($favorites) => {
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
    }),
  );

  const current = combineLatest(
    [rating, isFavorited],
  ).pipe(
    map(([$rating, $isFavorited]) => {
      if (!$rating) {
        return;
      }

      return {
        rating: $rating.rating,
        isFavorited: $isFavorited,
      };
    }),
  );

  const isSubmitting = new BehaviorSubject<boolean>(false);
  const ratingSubject = new Subject<number | null>();

  ratingSubject.pipe(
    debounceTime(postDelay),
    filter((v): v is number => v !== null),
  ).subscribe(async (newRating) => {
    isSubmitting.next(true);

    let hasRating = false;
    const currentRatings = await firstValueFrom(ratings);
    if (currentRatings) {
      switch (type) {
        case 'movie':
          hasRating = currentRatings.movies.has(id);
          break;
        case 'show':
          hasRating = currentRatings.shows.has(id);
          break;
        case 'episode':
          hasRating = currentRatings.episodes.has(id);
          break;
      }
    }

    track({ action: hasRating ? 'changed' : 'added', rating: newRating });

    await addRatingRequest({ body: toAddPayload(type, id, newRating) });
    await invalidate(InvalidateAction.Rated(type));

    pendingRating.next(null);
    isSubmitting.next(false);
    dismiss(id, type, 'rating');
  });

  const addRating = (newRating: number) => {
    pendingRating.next(newRating);
    ratingSubject.next(newRating);
  };

  const removeRating = async () => {
    ratingSubject.next(null);
    pendingRating.next(0);

    track({ action: 'removed' });
    await removeRatingRequest({
      body: toRemovePayload(type, id),
    });
    await invalidate(InvalidateAction.Rated(type));
    pendingRating.next(null);
  };

  return {
    pendingRating,
    isSubmitting,
    current,
    addRating,
    removeRating,
  };
}
