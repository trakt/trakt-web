import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { likeListRequest } from '$lib/requests/queries/lists/likeListRequest.ts';
import { unlikeListRequest } from '$lib/requests/queries/lists/unlikeListRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject, map } from 'rxjs';

export function useLikeList(list: MediaListSummary) {
  const isUpdating = new BehaviorSubject<boolean>(false);
  const { track } = useTrack(AnalyticsEvent.ListLike);
  const { invalidate } = useInvalidator();
  const { likes } = useUser();

  const isLiked = likes.pipe(
    map(($likes) => {
      if (!$likes) {
        return false;
      }

      return $likes.lists.has(list.id);
    }),
  );

  const likeList = async () => {
    isUpdating.next(true);

    track({ action: 'like' });
    await likeListRequest({
      listId: list.id,
    });
    await invalidate(InvalidateAction.List.Like);

    isUpdating.next(false);
  };

  const unlikeList = async () => {
    isUpdating.next(true);

    track({ action: 'unlike' });
    await unlikeListRequest({
      listId: list.id,
    });
    await invalidate(InvalidateAction.List.Like);

    isUpdating.next(false);
  };

  return {
    likeList,
    unlikeList,
    isUpdating,
    isLiked,
  };
}
