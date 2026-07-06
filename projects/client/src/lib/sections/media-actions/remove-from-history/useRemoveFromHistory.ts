import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { removeRatingRequest } from '$lib/requests/sync/removeRatingRequest.ts';
import { removeWatchedRequest } from '$lib/requests/sync/removeWatchedRequest.ts';
import { toRemoveRatingsPayload } from '$lib/requests/sync/toRemoveRatingsPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject, filter } from 'rxjs';
import { resolve } from '$lib/utils/store/resolve.ts';

export type UseRemoveFromHistoryProps =
  | { type: 'movie'; id: number; movie: { id: number } }
  | {
    type: 'episode';
    id: number;
    episode: { id: number };
    show: { id: number };
  };

export function useRemoveFromHistory(props: UseRemoveFromHistoryProps) {
  const { id, type } = props;
  // Trakt id of the media itself; `id` above is the history entry (play) id.
  const traktId = props.type === 'movie' ? props.movie.id : props.episode.id;

  const isRemoving = new BehaviorSubject(false);
  const { history, ratings } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.RemoveFromHistory);

  // Whether this removal empties the item's watch history *and* it still
  // carries a rating - i.e. the rating is about to be orphaned. Only a single
  // remaining play counts as "last", so a rewatched item keeps its rating.
  // `history` emits `null` while unsettled and resolve() only skips
  // `undefined`, so gate on a settled value or we'd read an empty history.
  const isLastRatedPlay = async (): Promise<boolean> => {
    const [currentHistory, currentRatings] = await Promise.all([
      resolve(history.pipe(filter((value) => value !== null))),
      resolve(ratings),
    ]);

    if (!currentHistory || !currentRatings) {
      return false;
    }

    switch (props.type) {
      case 'movie':
        return currentRatings.movies.has(traktId) &&
          currentHistory.movies.get(traktId)?.plays === 1;
      case 'episode': {
        const episode = currentHistory.shows.get(props.show.id)
          ?.episodes.find((entry) => entry.episodeId === traktId);
        return currentRatings.episodes.has(traktId) &&
          episode?.plays === 1;
      }
    }
  };

  const removeFromHistory = async () => {
    isRemoving.next(true);
    track();

    const shouldRemoveRating = await isLastRatedPlay();

    await removeWatchedRequest({ body: { ids: [id] } });

    if (shouldRemoveRating) {
      await removeRatingRequest({
        body: toRemoveRatingsPayload(type, [traktId]),
      });
      await invalidate(InvalidateAction.Rated(type));
    }

    await invalidate(InvalidateAction.MarkAsWatched(type));

    isRemoving.next(false);
  };

  return {
    isRemoving,
    removeFromHistory,
  };
}
