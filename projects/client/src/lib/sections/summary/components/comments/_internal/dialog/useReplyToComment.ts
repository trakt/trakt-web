import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { replyCommentRequest } from '$lib/requests/queries/comments/replyCommentRequest.ts';
import { CommentError } from '$lib/sections/summary/components/comments/_internal/models/CommentError.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { isHttpError } from '@sveltejs/kit';
import { get, writable } from 'svelte/store';

type UseReplyToCommentProps = {
  id: number;
};

function mapToCommentError(statusCode: number): CommentError {
  switch (statusCode) {
    case 422:
      return CommentError.InvalidContent;
    default:
      return CommentError.Unknown;
  }
}

export function useReplyToComment(
  { id }: UseReplyToCommentProps,
) {
  const { user } = useUser();
  const isPostingReply = writable(false);
  const isSpoiler = writable(false);
  const error = writable<CommentError | null>(null);
  const { invalidate } = useInvalidator();

  const replyToComment = async (comment: string) => {
    const current = await resolve(user);

    if (!current) {
      return { success: false };
    }

    isPostingReply.set(true);

    /*
      FIXME: standardize errors we display in components.
      - We should not rely on status only.
      - From the server, we should get a status + well know error type back.
        For example: 422 + content_too_short
    */
    try {
      error.set(null);

      await replyCommentRequest({
        id,
        body: {
          comment,
          spoiler: get(isSpoiler),
        },
      });
      await invalidate(InvalidateAction.ReplyToComment);

      isPostingReply.set(false);
      return { success: true };
    } catch (commentError) {
      isPostingReply.set(false);

      if (!isHttpError(commentError)) {
        throw error;
      }

      error.set(mapToCommentError(commentError.status));
      return { success: false };
    }
  };

  return {
    replyToComment,
    isPostingReply,
    isSpoiler,
    error,
  };
}
