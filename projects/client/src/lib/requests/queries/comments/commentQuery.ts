import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { time } from '$lib/utils/timing/time.ts';
import { type CommentResponse, commentResponseSchema } from '@trakt/api';

type CommentParams =
  & {
    id: number;
  }
  & ApiParams;

const commentRequest = async ({ fetch, id }: CommentParams) => {
  const response = await rawApiFetch({
    fetch,
    path: `/comments/${id}?extended=images`,
  });

  if (!response.ok) {
    return {
      body: null,
      status: response.status,
    };
  }

  return {
    body: commentResponseSchema.parse(await response.json()),
    status: response.status,
  };
};

function mapToComment(response: CommentResponse | null) {
  if (response == null) {
    throw new Error('Comment response body is missing');
  }

  return mapToMediaComment(response);
}

export const commentQuery = defineQuery({
  key: 'comment',
  invalidations: [
    InvalidateAction.React,
    InvalidateAction.Comment.Post('movie'),
    InvalidateAction.Comment.Post('show'),
    InvalidateAction.Comment.Post('episode'),
    InvalidateAction.Comment.Reply('movie'),
    InvalidateAction.Comment.Reply('show'),
    InvalidateAction.Comment.Reply('episode'),
  ],
  dependencies: (params) => [params.id],
  request: commentRequest,
  mapper: (response) => mapToComment(response.body),
  schema: MediaCommentSchema,
  ttl: time.minutes(30),
});
