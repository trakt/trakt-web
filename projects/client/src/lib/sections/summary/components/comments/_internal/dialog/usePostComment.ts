import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { postCommentRequest } from '$lib/requests/queries/comments/postCommentRequest.ts';
import { replyCommentRequest } from '$lib/requests/queries/comments/replyCommentRequest.ts';
import { CommentError } from '$lib/sections/summary/components/comments/_internal/models/CommentError.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { isHttpError } from '@sveltejs/kit';
import type { CommentPostParams } from '@trakt/api';
import { get, writable } from 'svelte/store';
import type { CommentsProps } from '../../CommentsProps.ts';
import { mapToCommentError } from './mapToCommentError.ts';

type ReplyProps = {
  id: number;
  commentType: 'reply';
};

type PostProps = {
  commentType: 'post';
} & CommentsProps;

export type UseAddCommentProps = ReplyProps | PostProps;

function toPostCommentPayload(type: ExtendedMediaType, id: number) {
  const ids = { ids: { trakt: id } };

  switch (type) {
    case 'movie':
      return { movie: ids };
    case 'show':
      return { show: ids };
    case 'episode':
      return { episode: ids };
  }
}

function addCommentRequest(
  comment: string,
  isSpoiler: boolean,
  props: UseAddCommentProps,
) {
  if (props.commentType === 'reply') {
    return replyCommentRequest({
      id: props.id,
      body: {
        comment,
        spoiler: isSpoiler,
      },
    });
  }

  const traktId = props.type === 'episode' ? props.id : props.media.id;
  // FIXME: remove cast after updating @trakt/api
  const body = {
    comment,
    spoiler: isSpoiler,
    ...toPostCommentPayload(props.type, traktId),
  } as CommentPostParams;

  return postCommentRequest({ body });
}

export function usePostComment(
  props: UseAddCommentProps,
) {
  const { user } = useUser();
  const isCommenting = writable(false);
  const isSpoiler = writable(false);
  const error = writable<CommentError | null>(null);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.AddComment);

  const invalidateAction = props.commentType === 'reply'
    ? InvalidateAction.ReplyToComment
    : InvalidateAction.Commented(props.type);

  const postComment = async (comment: string) => {
    const current = await resolve(user);

    if (!current) {
      return null;
    }

    isCommenting.set(true);

    /*
      FIXME: standardize errors we display in components.
      - We should not rely on status only.
      - From the server, we should get a status + well know error type back.
        For example: 422 + content_too_short
    */
    try {
      error.set(null);

      track({ action: props.commentType });
      const result = await addCommentRequest(comment, get(isSpoiler), props);
      await invalidate(invalidateAction);

      isCommenting.set(false);
      return result;
    } catch (commentError) {
      isCommenting.set(false);

      if (!isHttpError(commentError)) {
        throw error;
      }

      error.set(mapToCommentError(commentError.status));
      return null;
    }
  };

  return {
    postComment,
    isCommenting,
    isSpoiler,
    error,
  };
}
