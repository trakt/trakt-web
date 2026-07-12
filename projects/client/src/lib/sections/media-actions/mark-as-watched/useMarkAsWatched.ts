import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { executeOrEnqueue } from '$lib/features/offline/executeOrEnqueue.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import { toRemoveRatingsPayload } from '$lib/requests/sync/toRemoveRatingsPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { hasAired } from '$lib/utils/media/hasAired.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { BehaviorSubject, filter } from 'rxjs';
import type { MarkAsWatchedAt } from '../../../models/MarkAsWatchedAt.ts';
import { toMarkAsWatchedPayload } from './toMarkAsWatchedPayload.ts';
import { useIsWatched } from './useIsWatched.ts';

export type MarkAsWatchedStoreProps = MediaStoreProps<
  { id: number; effectiveReleaseDate: Date; status?: MediaStatus }
>;

export function useMarkAsWatched(
  props: MarkAsWatchedStoreProps,
) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const mediaKeys = media.map((item) => toMediaKey(type, item.id));
  const isMarkingAsWatched = new BehaviorSubject(false);
  const { user, history, ratings } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.MarkAsWatched);

  const { isWatched } = useIsWatched(props);

  const markAsWatched = async (watchedAt?: MarkAsWatchedAt) => {
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
      isMarkingAsWatched.next(false);
    }
  };

  // Ids whose rating this removal orphans. The main action removes *every*
  // play of the target, so history goes empty regardless of play count - a
  // rated item that's currently watched always qualifies (a rewatch does not
  // preserve the rating here). Gating on "currently watched" keeps us from
  // touching ratings on items that weren't in the history to begin with. Read
  // pre-removal, hence before the request below.
  const getOrphanedRatingIds = async (): Promise<number[]> => {
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

    const isOrphanedRating = (item: { id: number }): boolean => {
      switch (props.type) {
        case 'movie':
          return currentRatings.movies.has(item.id) &&
            currentHistory.movies.has(item.id);
        case 'show':
          return currentRatings.shows.has(item.id) &&
            currentHistory.shows.has(item.id);
        case 'episode': {
          const isWatched = currentHistory.shows.get(props.show.id)
            ?.episodes.some((entry) => entry.episodeId === item.id);
          return currentRatings.episodes.has(item.id) && Boolean(isWatched);
        }
      }
    };

    return media.filter(isOrphanedRating).map((item) => item.id);
  };

  const removeWatched = async () => {
    isMarkingAsWatched.next(true);
    track({ action: 'remove' });

    const orphanedRatingIds = await getOrphanedRatingIds();

    const removeResult = await executeOrEnqueue({
      endpoint: 'history:remove',
      keys: mediaKeys,
      body: toMarkAsWatchedPayload(props),
      invalidations: [InvalidateAction.MarkAsWatched(type)],
    });

    if (orphanedRatingIds.length > 0) {
      const ratingResult = await executeOrEnqueue({
        endpoint: 'rating:remove',
        keys: orphanedRatingIds.map((id) => toMediaKey(type, id)),
        body: toRemoveRatingsPayload(type, orphanedRatingIds),
        invalidations: [InvalidateAction.Rated(type)],
      });
      if (ratingResult === 'executed') {
        await invalidate(InvalidateAction.Rated(type));
      }
    }

    if (removeResult === 'executed') {
      await invalidate(InvalidateAction.MarkAsWatched(type));
      isMarkingAsWatched.next(false);
    }
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
    isWatchable,
  };
}
