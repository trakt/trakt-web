import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import type {
  RatedEntry,
  UserRatings,
} from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { executeOrEnqueue } from '$lib/features/offline/executeOrEnqueue.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import { useIsQueued } from '$lib/features/offline/useIsQueued.ts';
import { whenExecuted } from '$lib/features/offline/whenExecuted.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import { toRemoveRatingsPayload } from '$lib/requests/sync/toRemoveRatingsPayload.ts';
import { hasAired } from '$lib/utils/media/hasAired.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { filter } from 'rxjs';
import type { MarkAsWatchedAt } from '../../../models/MarkAsWatchedAt.ts';
import { toMarkAsWatchedPayload } from './toMarkAsWatchedPayload.ts';
import { useIsWatched } from './useIsWatched.ts';

export type MarkAsWatchedStoreProps = MediaStoreProps<
  { id: number; effectiveReleaseDate: Date; status?: MediaStatus }
>;

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
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const mediaKeys = media.map((item) => toMediaKey(type, item.id));
  const { user, history, ratings } = useUser();
  const { track } = useTrack(AnalyticsEvent.MarkAsWatched);

  const { isWatched } = useIsWatched(props);
  const { isQueued } = useIsQueued({ domain: 'history', keys: mediaKeys });

  const watchedInvalidations = [InvalidateAction.MarkAsWatched(type)];
  const ratedInvalidations = [InvalidateAction.Rated(type)];

  const watchedAdd = useMutation(defineMutation({
    key: 'history:add',
    request: (watchedAt: MarkAsWatchedAt) =>
      executeOrEnqueue({
        endpoint: 'history:add',
        keys: mediaKeys,
        body: toMarkAsWatchedPayload(props, watchedAt),
        invalidations: watchedInvalidations,
      }),
    invalidations: whenExecuted(watchedInvalidations),
  }));

  // A removal wipes every play of the target, so a rated item that is
  // currently watched always loses its rating too. Read pre-removal, hence
  // before the request below.
  const getOrphanedRatingIds = async (): Promise<ReadonlyArray<number>> => {
    // `history` emits `null` while unsettled; resolve() only skips `undefined`,
    // so gate on a settled (non-null) value or we'd read an empty history and
    // never orphan the rating.
    const [currentHistory, currentRatings] = await Promise.all([
      resolve(history.pipe(filter((value) => value !== null))),
      resolve(ratings),
    ]);

    if (!currentHistory || !currentRatings) {
      return [];
    }

    const isWatched = (item: { id: number }): boolean => {
      switch (props.type) {
        case 'movie':
          return currentHistory.movies.has(item.id);
        case 'show':
          return currentHistory.shows.has(item.id);
        case 'episode':
          return Boolean(
            currentHistory.shows.get(props.show.id)
              ?.episodes.some((entry) => entry.episodeId === item.id),
          );
      }
    };

    const rated = ratedBucket(currentRatings, props.type);

    return media
      .filter((item) => isWatched(item) && rated.has(item.id))
      .map((item) => item.id);
  };

  // The orphaned ratings have to be read before the request, and the
  // submitted state has to cover that read, so it happens inside the write.
  const watchedRemove = useMutation(defineMutation({
    key: 'history:remove',
    request: async () => {
      const orphanedRatingIds = await getOrphanedRatingIds();

      const outcome = await executeOrEnqueue({
        endpoint: 'history:remove',
        keys: mediaKeys,
        body: toMarkAsWatchedPayload(props),
        invalidations: watchedInvalidations,
      });

      return { orphanedRatingIds, outcome };
    },
    invalidations: ({ data }) =>
      whenExecuted(watchedInvalidations)({ data: data.outcome }),
  }));

  const ratingRemove = useMutation(defineMutation({
    key: 'rating:remove',
    request: (ids: ReadonlyArray<number>) =>
      executeOrEnqueue({
        endpoint: 'rating:remove',
        keys: ids.map((id) => toMediaKey(type, id)),
        body: toRemoveRatingsPayload(type, ids),
        invalidations: ratedInvalidations,
      }),
    invalidations: whenExecuted(ratedInvalidations),
  }));

  const isMarkingAsWatched = anyTrue([
    watchedAdd.isPending,
    watchedRemove.isPending,
    ratingRemove.isPending,
  ]);

  const markAsWatched = async (watchedAt?: MarkAsWatchedAt) => {
    const current = await resolve(user);

    if (!current) {
      return;
    }

    track({ action: 'add' });

    await watchedAdd.mutate(watchedAt ?? 'now');
  };

  const removeWatched = async () => {
    track({ action: 'remove' });

    const { orphanedRatingIds } = await watchedRemove.mutate();

    if (orphanedRatingIds.length === 0) {
      return;
    }

    await ratingRemove.mutate(orphanedRatingIds);
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
