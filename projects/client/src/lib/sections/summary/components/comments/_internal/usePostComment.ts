import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import type { CommentableMediaType } from '$lib/requests/models/CommentableMediaType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { editCommentRequest } from '$lib/requests/queries/comments/editCommentRequest.ts';
import { postCommentRequest } from '$lib/requests/queries/comments/postCommentRequest.ts';
import { replyCommentRequest } from '$lib/requests/queries/comments/replyCommentRequest.ts';
import { CommentError } from '$lib/sections/summary/components/comments/_internal/models/CommentError.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { isHttpError } from '@sveltejs/kit';
import { BehaviorSubject } from 'rxjs';
import type { CommentsProps } from '../CommentsProps.ts';
import { mapToCommentError } from './mapToCommentError.ts';

type ReplyProps = {
  id: number;
  commentType: 'reply';
  type: CommentableMediaType;
};

type PostProps = {
  commentType: 'post';
} & CommentsProps;

type EditProps = {
  id: number;
  commentType: 'edit';
  type: CommentableMediaType;
};

export type UseAddCommentProps = ReplyProps | PostProps | EditProps;

type PostCommentProps = {
  comment: string;
  gif: { url: string; width?: number; height?: number } | null;
  isSpoiler: boolean;
} & UseAddCommentProps;

function toPostCommentPayload(type: CommentableMediaType, id: number) {
  const ids = { ids: { trakt: id } };

  switch (type) {
    case 'movie':
      return { movie: ids };
    case 'show':
      return { show: ids };
    case 'season':
      return { season: ids };
    case 'episode':
      return { episode: ids };
  }
}

function addCommentRequest(props: PostCommentProps) {
  const commonProps = {
    comment: props.comment,
    gif: props.gif,
    spoiler: props.isSpoiler,
  };

  if (props.commentType === 'edit') {
    return editCommentRequest({
      id: props.id,
      body: commonProps,
    });
  }

  if (props.commentType === 'reply') {
    return replyCommentRequest({
      id: props.id,
      body: commonProps,
    });
  }

  const traktId = props.type === 'episode' || props.type === 'season'
    ? props.id
    : props.media.id;
  return postCommentRequest({
    body: {
      ...commonProps,
      ...toPostCommentPayload(props.type, traktId),
    },
  });
}

function toContentType({ comment, gif }: PostCommentProps) {
  if (!gif) return 'text';
  if (!comment.trim()) return 'gif';

  return 'text-and-gif';
}

function toInvalidations(props: PostCommentProps) {
  switch (props.commentType) {
    case 'post':
      return [InvalidateAction.Comment.Post(props.type)];
    case 'reply':
      return [InvalidateAction.Comment.Reply(props.type)];
    case 'edit':
      return [
        InvalidateAction.Comment.Post(props.type),
        InvalidateAction.Comment.Reply(props.type),
      ];
  }
}

export function usePostComment() {
  const { user } = useUser();
  const error = new BehaviorSubject<CommentError | null>(null);
  const { track } = useTrack(AnalyticsEvent.AddComment);

  const comment = useMutation(defineMutation({
    key: 'comment:post',
    request: (props: PostCommentProps) => addCommentRequest(props),
    invalidations: ({ variables }) => toInvalidations(variables),
  }));

  const postComment = async (props: PostCommentProps) => {
    const current = await resolve(user);

    if (!current) {
      return null;
    }

    /*
      FIXME: standardize errors we display in components.
      - We should not rely on status only.
      - From the server, we should get a status + well know error type back.
        For example: 422 + content_too_short
    */
    try {
      error.next(null);

      track({ action: props.commentType, type: toContentType(props) });

      return await comment.mutate(props);
    } catch (commentError) {
      if (!isHttpError(commentError)) {
        throw error;
      }

      error.next(mapToCommentError(commentError.status));
      return null;
    }
  };

  return {
    postComment,
    isCommenting: comment.isPending,
    error,
  };
}
