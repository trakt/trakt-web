import { useActionToast } from '$lib/features/action-toast/useActionToast.ts';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import type { RatedEntry } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import { m } from '$lib/features/i18n/messages.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { executeOrEnqueue } from '$lib/features/offline/executeOrEnqueue.ts';
import { findPendingOverride } from '$lib/features/offline/findPendingOverride.ts';
import { isAddEndpoint } from '$lib/features/offline/isAddEndpoint.ts';
import type { OfflineAction } from '$lib/features/offline/models/OfflineAction.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import { useIsQueued } from '$lib/features/offline/useIsQueued.ts';
import { useOfflineActions } from '$lib/features/offline/useOfflineActions.ts';
import { useLastWatched } from '$lib/features/toast/useLastWatched.ts';
import {
  InvalidateAction,
  type RatedMediaType,
} from '$lib/requests/models/InvalidateAction.ts';
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

type RateableType = RatedMediaType;

export type WatchlistStoreProps = {
  type: RateableType;
  id: number;
  /** Names the item in the confirmation toast; omitted for a generic message. */
  title?: string;
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

function toPendingRatedEntry(
  pending: OfflineAction,
  type: RateableType,
  id: number,
): RatedEntry | undefined {
  if (!isAddEndpoint(pending.endpoint)) {
    return undefined;
  }

  const body = pending.body as RatingsSyncRequest;
  const rating = body[`${type}s`]?.at(0)?.rating;

  if (rating == null) {
    return undefined;
  }

  return { id, rating, ratedAt: new Date(pending.queuedAt) };
}

export function useRatings({ type, id, title }: WatchlistStoreProps) {
  const pendingRating = new BehaviorSubject<null | number>(null);
  const { ratings, favorites } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Rate);
  const { dismiss } = useLastWatched();
  const { notify } = useActionToast();

  const { actions } = useOfflineActions();
  const { isQueued } = useIsQueued({
    domain: 'rating',
    keys: [toMediaKey(type, id)],
  });

  const rating = combineLatest([ratings, actions]).pipe(
    map(([$ratings, $actions]) => {
      const pending = findPendingOverride({
        actions: $actions,
        domain: 'rating',
        keys: [toMediaKey(type, id)],
      });

      if (pending) {
        return toPendingRatedEntry(pending, type, id);
      }

      if (!$ratings) {
        return;
      }

      switch (type) {
        case 'movie':
          return $ratings.movies.get(id);
        case 'show':
          return $ratings.shows.get(id);
        case 'season':
          return $ratings.seasons.get(id);
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
        case 'season':
          return false;
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
        case 'season':
          hasRating = currentRatings.seasons.has(id);
          break;
        case 'episode':
          hasRating = currentRatings.episodes.has(id);
          break;
      }
    }

    track({ action: hasRating ? 'changed' : 'added', rating: newRating });

    const addResult = await executeOrEnqueue({
      endpoint: 'rating:add',
      keys: [toMediaKey(type, id)],
      body: toAddPayload(type, id, newRating),
      invalidations: [InvalidateAction.Rated(type)],
    });
    if (addResult === 'executed') {
      await invalidate(InvalidateAction.Rated(type));
      if (type !== 'season') {
        dismiss(id, type, 'rating');
      }
    }

    notify({
      message: title
        ? m.action_toast_rated({ title, rating: newRating })
        : m.action_toast_rated_generic({ rating: newRating }),
      action: {
        text: m.button_text_undo(),
        label: m.action_toast_label_undo(),
        style: 'outline',
        onAction: removeRating,
      },
    });

    // Always clear: a queued rating stays flagged via isQueued, and leaving
    // these pinned would re-disable the stars once it syncs and dequeues.
    pendingRating.next(null);
    isSubmitting.next(false);
  });

  const addRating = (newRating: number) => {
    pendingRating.next(newRating);
    ratingSubject.next(newRating);
  };

  const removeRating = async () => {
    // Snapshot the current rating before clearing it so "Undo" can restore
    // the exact value.
    const previous = await firstValueFrom(rating);

    ratingSubject.next(null);
    pendingRating.next(0);

    track({ action: 'removed' });
    const removeResult = await executeOrEnqueue({
      endpoint: 'rating:remove',
      keys: [toMediaKey(type, id)],
      body: toRemovePayload(type, id),
      invalidations: [InvalidateAction.Rated(type)],
    });
    if (removeResult === 'executed') {
      await invalidate(InvalidateAction.Rated(type));
      pendingRating.next(null);
    }

    notify({
      message: m.action_toast_rating_removed(),
      action: previous
        ? {
          text: m.button_text_undo(),
          label: m.action_toast_label_undo(),
          style: 'outline',
          onAction: () => addRating(previous.rating),
        }
        : undefined,
    });
  };

  return {
    pendingRating,
    isSubmitting,
    isQueued,
    current,
    addRating,
    removeRating,
  };
}
