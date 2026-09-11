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
import { whenExecuted } from '$lib/features/offline/whenExecuted.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import {
  type RatedTarget,
  toAddRatingsPayload,
} from '$lib/requests/sync/toAddRatingsPayload.ts';
import { toRemoveRatingsPayload } from '$lib/requests/sync/toRemoveRatingsPayload.ts';
import { hasAired } from '$lib/utils/media/hasAired.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { filter } from 'rxjs';
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
  const { user, history, ratings } = useUser();
  const { track } = useTrack(AnalyticsEvent.MarkAsWatched);
  const notify = toGatedNotify(useActionToast().notify, isToastEnabled);

  const soleItem = media.length === 1 ? media.at(0) : undefined;
  const toastTitle = soleItem ? toOptionalTitle(soleItem) : undefined;

  const { isWatched } = useIsWatched(props);
  const { isQueued } = useIsQueued({ domain: 'history', keys: mediaKeys });

  const watchedInvalidations = [InvalidateAction.MarkAsWatched(type)];
  const ratedInvalidations = [InvalidateAction.Rated(type)];

  const watchedAdd = useMutation(defineMutation({
    key: 'history:add',
    request: (watchedAt: MarkAsWatchedAt | ReadonlyMap<number, Date>) =>
      executeOrEnqueue({
        endpoint: 'history:add',
        keys: mediaKeys,
        body: toMarkAsWatchedPayload(props, watchedAt),
        invalidations: watchedInvalidations,
      }),
    invalidations: whenExecuted(watchedInvalidations),
  }));

  // The snapshot has to be read before the request, and the submitted state
  // has to cover that read, so it happens inside the write.
  const watchedRemove = useMutation(defineMutation({
    key: 'history:remove',
    request: async () => {
      const snapshot = await getRemovalSnapshot();

      const outcome = await executeOrEnqueue({
        endpoint: 'history:remove',
        keys: mediaKeys,
        body: toMarkAsWatchedPayload(props),
        invalidations: watchedInvalidations,
      });

      return { snapshot, outcome };
    },
    invalidations: ({ data }) =>
      whenExecuted(watchedInvalidations)({ data: data.outcome }),
  }));

  const ratingAdd = useMutation(defineMutation({
    key: 'rating:add',
    request: (targets: ReadonlyArray<RatedTarget>) =>
      executeOrEnqueue({
        endpoint: 'rating:add',
        keys: targets.map(({ id }) => toMediaKey(type, id)),
        body: toAddRatingsPayload(type, targets),
        invalidations: ratedInvalidations,
      }),
    invalidations: whenExecuted(ratedInvalidations),
  }));

  const ratingRemove = useMutation(defineMutation({
    key: 'rating:remove',
    request: (targets: ReadonlyArray<RatedTarget>) =>
      executeOrEnqueue({
        endpoint: 'rating:remove',
        keys: targets.map(({ id }) => toMediaKey(type, id)),
        body: toRemoveRatingsPayload(type, targets.map(({ id }) => id)),
        invalidations: ratedInvalidations,
      }),
    invalidations: whenExecuted(ratedInvalidations),
  }));

  const isMarkingAsWatched = anyTrue([
    watchedAdd.isPending,
    watchedRemove.isPending,
    ratingAdd.isPending,
    ratingRemove.isPending,
  ]);

  const markAsWatched = async (
    watchedAt?: MarkAsWatchedAt | ReadonlyMap<number, Date>,
  ) => {
    const current = await resolve(user);

    if (!current) {
      return;
    }

    track({ action: 'add' });

    await watchedAdd.mutate(watchedAt ?? 'now');
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

    await ratingAdd.mutate(snapshot.ratings);
  };

  const removeWatched = async () => {
    track({ action: 'remove' });

    const { snapshot } = await watchedRemove.mutate();

    if (snapshot.ratings.length > 0) {
      await ratingRemove.mutate(snapshot.ratings);
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
