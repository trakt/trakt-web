import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { likeCommentRequest } from '$lib/requests/queries/comments/likeCommentRequest.ts';
import { unlikeCommentRequest } from '$lib/requests/queries/comments/unlikeCommentRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { writable } from 'svelte/store';

type UseCommentLikesProps = {
  id: number;
};

export function useCommentLikes({ id }: UseCommentLikesProps) {
  const isLiking = writable(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.LikeComment);

  const like = async () => {
    isLiking.set(true);
    track({ action: 'add' });

    await likeCommentRequest({ id });
    await invalidate(InvalidateAction.Like);

    isLiking.set(false);
  };

  const unlike = async () => {
    isLiking.set(true);
    track({ action: 'remove' });

    await unlikeCommentRequest({ id });
    await invalidate(InvalidateAction.Like);

    isLiking.set(false);
  };

  return {
    isLiking,
    like,
    unlike,
  };
}
