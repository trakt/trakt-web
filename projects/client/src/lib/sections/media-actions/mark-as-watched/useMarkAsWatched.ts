import { undoToastAction } from '$lib/features/action-toast/undoToastAction.ts';
import { toGatedNotify } from '$lib/features/action-toast/toGatedNotify.ts';
import { useActionToast } from '$lib/features/action-toast/useActionToast.ts';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import type {
  RatedEntry,
  UserRatings,
} from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { m } from '$lib/features/i18n/messages.ts';
import { executeOrEnqueue } from '$lib/features/offline/executeOrEnqueue.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import { useIsQueued } from '$lib/features/offline/useIsQueued.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import {
  type RatedTarget,
  toAddRatingsPayload,
} from '$lib/requests/sync/toAddRatingsPayload.ts';
import { toRemoveRatingsPayload } from '$lib/requests/sync/toRemoveRatingsPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { hasAired } from '$lib/utils/media/hasAired.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { BehaviorSubject, filter } from 'rxjs';
import type { MarkAsWatchedAt } from '../../../models/MarkAsWatchedAt.ts';
import { toMarkAsWatchedPayload } from './toMarkAsWatchedPayload.ts';
import { useIsWatched } from './useIsWatched.ts';

export type MarkAsWatchedStoreProps =
  & MediaStoreProps<
    { id: number; effectiveReleaseDate: Date; status?: MediaStatus }
  >
  & { isToastEnabled?: boolean };

// History mutations may run on a minimal `{ id }` shape.
function toOptionalTitle(item: { id: number }): string | undefined {
  if (!('title' in item)) {
    return undefined;
  }

  return typeof item.title === 'string' ? item.title : undefined;
}

type RemovalSnapshot = {
  watchedAt: ReadonlyMap<number, Date>;
  ratings: ReadonlyArray<RatedTarget>;
};

function ratedBucket(
  ratings: UserRatings,
  type: MarkAsWatchedStoreProps['type'],
): ReadonlyMap<number, RatedEntry> {
  switch (type) {
    case 'movie':
      return ratings.movies;
    case 'show':
      return ratings.shows;
    case 'episode':
      return ratings.episodes;
  }
}

export function useMarkAsWatched(
  props: MarkAsWatchedStoreProps,
) {
  const { type, isToastEnabled = true } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const mediaKeys = media.map((item) => toMediaKey(type, item.id));
  const isMarkingAsWatched = new BehaviorSubject(false);
  const { user, history, ratings } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.MarkAsWatched);
  const notify = toGatedNotify(useActionToast().notify, isToastEnabled);

  const soleItem = media.length === 1 ? media.at(0) : undefined;
  const toastTitle = soleItem ? toOptionalTitle(soleItem) : undefined;

  const { isWatched } = useIsWatched(props);
  const { isQueued } = useIsQueued({ domain: 'history', keys: mediaKeys });

  const markAsWatched = async (
    watchedAt?: MarkAsWatchedAt | ReadonlyMap<number, Date>,
  ) => {
    const current = await resolve(user);

    if (!current) {
      return;
    }

    const watchedAtDate = watchedAt ?? 'now';

    isMarkingAsWatched.next(true);
    track({ action: 'add' });

    const result = await executeOrEnqueue({
      endpoint: 'history:add',
      keys: mediaKeys,
      body: toMarkAsWatchedPayload(props, watchedAtDate),
      invalidations: [InvalidateAction.MarkAsWatched(type)],
    });

    if (result === 'executed') {
      await invalidate(InvalidateAction.MarkAsWatched(type));
    }

    // Always clear: a queued action stays flagged via isQueued, and leaving
    // this pinned would re-disable the button once it syncs and dequeues.
    isMarkingAsWatched.next(false);
  };

  // A removal wipes every play of the target, so a rated item that is
  // currently watched always loses its rating too. Both the play dates and the
  // orphaned ratings have to be read before the request, or "Undo" has nothing
  // to restore.
  const getRemovalSnapshot = async (): Promise<RemovalSnapshot> => {
    // `history` emits `null` while unsettled; resolve() only skips `undefined`,
    // so gate on a settled (non-null) value or we'd read an empty history and
    // never orphan the rating.
    const [currentHistory, currentRatings] = await Promise.all([
      resolve(history.pipe(filter((value) => value !== null))),
      resolve(ratings),
    ]);

    if (!currentHistory || !currentRatings) {
      return { watchedAt: new Map(), ratings: [] };
    }

    const toWatchedAt = (item: { id: number }): Date | undefined => {
      switch (props.type) {
        case 'movie':
          return currentHistory.movies.get(item.id)?.watchedAt;
        case 'show':
          // Show-wide history holds no episode numbers, so the seasons payload
          // an undo would need cannot be rebuilt from it.
          return undefined;
        case 'episode':
          return currentHistory.shows.get(props.show.id)
            ?.episodes.find((entry) => entry.episodeId === item.id)?.watchedAt;
      }
    };

    const toOrphanedRating = (
      item: { id: number },
    ): RatedTarget | undefined => {
      const isWatched = toWatchedAt(item) != null ||
        (props.type === 'show' && currentHistory.shows.has(item.id));

      if (!isWatched) {
        return undefined;
      }

      const rated = ratedBucket(currentRatings, props.type).get(item.id);
      return rated ? { id: item.id, rating: rated.rating } : undefined;
    };

    return {
      watchedAt: new Map(
        media
          .map((item) => [item.id, toWatchedAt(item)] as const)
          .filter((entry): entry is [number, Date] => entry.at(1) != null),
      ),
      ratings: media.map(toOrphanedRating).filter((entry) =>
        entry !== undefined
      ),
    };
  };

  const restoreWatched = async (snapshot: RemovalSnapshot) => {
    await markAsWatched(snapshot.watchedAt);

    if (snapshot.ratings.length === 0) {
      return;
    }

    const result = await executeOrEnqueue({
      endpoint: 'rating:add',
      keys: snapshot.ratings.map(({ id }) => toMediaKey(type, id)),
      body: toAddRatingsPayload(type, snapshot.ratings),
      invalidations: [InvalidateAction.Rated(type)],
    });

    if (result === 'executed') {
      await invalidate(InvalidateAction.Rated(type));
    }
  };

  const removeWatched = async () => {
    isMarkingAsWatched.next(true);
    track({ action: 'remove' });

    const snapshot = await getRemovalSnapshot();

    const removeResult = await executeOrEnqueue({
      endpoint: 'history:remove',
      keys: mediaKeys,
      body: toMarkAsWatchedPayload(props),
      invalidations: [InvalidateAction.MarkAsWatched(type)],
    });

    if (snapshot.ratings.length > 0) {
      const ratingResult = await executeOrEnqueue({
        endpoint: 'rating:remove',
        keys: snapshot.ratings.map(({ id }) => toMediaKey(type, id)),
        body: toRemoveRatingsPayload(
          type,
          snapshot.ratings.map(({ id }) => id),
        ),
        invalidations: [InvalidateAction.Rated(type)],
      });
      if (ratingResult === 'executed') {
        await invalidate(InvalidateAction.Rated(type));
      }
    }

    if (removeResult === 'executed') {
      await invalidate(InvalidateAction.MarkAsWatched(type));
    }

    // A show-wide removal captures no dates, so it gets no undo.
    const isRestorable = media.every((item) => snapshot.watchedAt.has(item.id));

    notify({
      message: toastTitle
        ? m.action_toast_removed_from_history({ title: toastTitle })
        : m.action_toast_removed_from_history_generic(),
      action: isRestorable
        ? undoToastAction(() => restoreWatched(snapshot))
        : undefined,
    });

    isMarkingAsWatched.next(false);
  };

  const isWatchable = media.every((item) => {
    return hasAired({
      ...item,
      type,
    });
  });

  return {
    markAsWatched,
    removeWatched,
    isWatched,
    isMarkingAsWatched,
    isQueued,
    isWatchable,
  };
}
