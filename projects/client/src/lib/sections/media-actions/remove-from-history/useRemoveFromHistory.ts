import { undoToastAction } from '$lib/features/action-toast/undoToastAction.ts';
import { toGatedNotify } from '$lib/features/action-toast/toGatedNotify.ts';
import { useActionToast } from '$lib/features/action-toast/useActionToast.ts';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { m } from '$lib/features/i18n/messages.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { addRatingRequest } from '$lib/requests/sync/addRatingRequest.ts';
import { markAsWatchedRequest } from '$lib/requests/sync/markAsWatchedRequest.ts';
import { removeRatingRequest } from '$lib/requests/sync/removeRatingRequest.ts';
import { toAddRatingsPayload } from '$lib/requests/sync/toAddRatingsPayload.ts';
import { removeWatchedRequest } from '$lib/requests/sync/removeWatchedRequest.ts';
import { toRemoveRatingsPayload } from '$lib/requests/sync/toRemoveRatingsPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import type { HistoryAddRequest } from '@trakt/api';
import { BehaviorSubject, filter } from 'rxjs';

type RemovedMediaType = 'movie' | 'episode';

type HistoryAddPayloadProps = {
  type: RemovedMediaType;
  traktId: number;
  watchedAt: Date;
};

function toHistoryAddPayload(
  { type, traktId, watchedAt }: HistoryAddPayloadProps,
): HistoryAddRequest {
  const entries = [{
    ids: { trakt: traktId },
    watched_at: watchedAt.toISOString(),
  }];

  return type === 'movie' ? { movies: entries } : { episodes: entries };
}

export type UseRemoveFromHistoryProps =
  & { watchedAt: Date; title?: string; isToastEnabled?: boolean }
  & (
    | { type: 'movie'; id: number; movie: { id: number } }
    | {
      type: 'episode';
      id: number;
      episode: { id: number };
      show: { id: number };
    }
  );

export function useRemoveFromHistory(props: UseRemoveFromHistoryProps) {
  const { id, type, watchedAt, title, isToastEnabled = true } = props;
  // Trakt id of the media itself; `id` above is the history entry (play) id.
  const traktId = props.type === 'movie' ? props.movie.id : props.episode.id;

  const isRemoving = new BehaviorSubject(false);
  const { history, ratings } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.RemoveFromHistory);
  const notify = toGatedNotify(useActionToast().notify, isToastEnabled);

  // Only a single remaining play counts as "last", so a rewatched item keeps
  // its rating. Read pre-removal so "Undo" has a score to restore.
  // `history` emits `null` while unsettled and resolve() only skips
  // `undefined`, so gate on a settled value or we'd read an empty history.
  const getOrphanedRating = async (): Promise<number | undefined> => {
    const [currentHistory, currentRatings] = await Promise.all([
      resolve(history.pipe(filter((value) => value !== null))),
      resolve(ratings),
    ]);

    if (!currentHistory || !currentRatings) {
      return undefined;
    }

    switch (props.type) {
      case 'movie':
        return currentHistory.movies.get(traktId)?.plays === 1
          ? currentRatings.movies.get(traktId)?.rating
          : undefined;
      case 'episode': {
        const episode = currentHistory.shows.get(props.show.id)
          ?.episodes.find((entry) => entry.episodeId === traktId);
        return episode?.plays === 1
          ? currentRatings.episodes.get(traktId)?.rating
          : undefined;
      }
    }
  };

  const restoreToHistory = async (orphanedRating: number | undefined) => {
    isRemoving.next(true);

    try {
      await markAsWatchedRequest({
        body: toHistoryAddPayload({ type, traktId, watchedAt }),
      });

      if (orphanedRating != null) {
        await addRatingRequest({
          body: toAddRatingsPayload(type, [{
            id: traktId,
            rating: orphanedRating,
          }]),
        });
        await invalidate(InvalidateAction.Rated(type));
      }

      await invalidate(InvalidateAction.MarkAsWatched(type));
    } finally {
      isRemoving.next(false);
    }
  };

  const removeFromHistory = async () => {
    isRemoving.next(true);
    track();

    const orphanedRating = await getOrphanedRating();

    await removeWatchedRequest({ body: { ids: [id] } });

    if (orphanedRating != null) {
      await removeRatingRequest({
        body: toRemoveRatingsPayload(type, [traktId]),
      });
      await invalidate(InvalidateAction.Rated(type));
    }

    await invalidate(InvalidateAction.MarkAsWatched(type));

    notify({
      message: title
        ? m.action_toast_removed_from_history({ title })
        : m.action_toast_removed_from_history_generic(),
      action: undoToastAction(() => restoreToHistory(orphanedRating)),
    });

    isRemoving.next(false);
  };

  return {
    isRemoving,
    removeFromHistory,
  };
}
