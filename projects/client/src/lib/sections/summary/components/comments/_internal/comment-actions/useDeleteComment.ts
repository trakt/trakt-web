import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import type { CommentableMediaType } from '$lib/requests/models/CommentableMediaType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { deleteCommentRequest } from '$lib/requests/queries/comments/deleteCommentRequest.ts';

type UseDeleteCommentProps = {
  comment: MediaComment;
  type: CommentableMediaType;
};

export function useDeleteComment(
  { comment, type }: UseDeleteCommentProps,
) {
  const { track } = useTrack(AnalyticsEvent.DeleteComment);

  const deletion = useMutation(defineMutation({
    key: 'comment:delete',
    request: () => deleteCommentRequest({ id: comment.id }),
    invalidations: [
      comment.parentId > 0
        ? InvalidateAction.Comment.Reply(type)
        : InvalidateAction.Comment.Post(type),
    ],
  }));

  const deleteComment = async () => {
    track();

    await deletion.mutate();
  };

  return {
    deleteComment,
    isDeleting: deletion.isPending,
  };
}
