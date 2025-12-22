import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { deleteCommentRequest } from '$lib/requests/queries/comments/deleteCommentRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';

type UseDeleteCommentProps = {
  comment: MediaComment;
  type: ExtendedMediaType;
};

export function useDeleteComment(
  { comment, type }: UseDeleteCommentProps,
) {
  const isDeleting = new BehaviorSubject(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.DeleteComment);

  const invalidateAction = comment.parentId > 0
    ? InvalidateAction.Comment.Reply(type)
    : InvalidateAction.Comment.Post(type);

  const deleteComment = async () => {
    isDeleting.next(true);

    track();
    await deleteCommentRequest({ id: comment.id });
    await invalidate(invalidateAction);

    isDeleting.next(false);
  };

  return {
    deleteComment,
    isDeleting: isDeleting.asObservable(),
  };
}
