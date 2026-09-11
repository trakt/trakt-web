import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { likeListRequest } from '$lib/requests/queries/lists/likeListRequest.ts';
import { unlikeListRequest } from '$lib/requests/queries/lists/unlikeListRequest.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';
import { map } from 'rxjs';

export function useLikeList(list: MediaListSummary) {
  const { track } = useTrack(AnalyticsEvent.ListLike);
  const { likes } = useUser();

  const like = useMutation(defineMutation({
    key: 'list:like',
    request: likeListRequest,
    invalidations: [InvalidateAction.List.Like],
  }));

  const unlike = useMutation(defineMutation({
    key: 'list:unlike',
    request: unlikeListRequest,
    invalidations: [InvalidateAction.List.Like],
  }));

  const isLiked = likes.pipe(
    map(($likes) => {
      if (!$likes) {
        return false;
      }

      return $likes.lists.has(list.id);
    }),
  );

  const isUpdating = anyTrue([like.isPending, unlike.isPending]);

  const likeList = async () => {
    track({ action: 'like' });
    await like.mutate({ listId: list.id });
  };

  const unlikeList = async () => {
    track({ action: 'unlike' });
    await unlike.mutate({ listId: list.id });
  };

  return {
    likeList,
    unlikeList,
    isUpdating,
    isLiked,
  };
}
