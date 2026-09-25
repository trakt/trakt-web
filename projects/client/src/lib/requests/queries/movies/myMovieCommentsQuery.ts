import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { time } from '$lib/utils/timing/time.ts';
import { commentResponseSchema } from '@trakt/api';
import { z } from 'zod';

const MyMovieCommentsResponseSchema = z.array(commentResponseSchema);

type MyMovieCommentsParams = {
  slug: string;
  enabled: boolean;
} & ApiParams;

const myMovieCommentsRequest = async ({
  fetch,
  slug,
}: MyMovieCommentsParams) => {
  const response = await rawApiFetch({
    fetch,
    path: `/movies/${slug}/comments/mine`,
  });

  return response.ok
    ? {
      body: MyMovieCommentsResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: [], status: response.status };
};

export const myMovieCommentsQuery = defineQuery({
  key: 'myMovieComments',
  invalidations: [
    InvalidateAction.Comment.Post('movie'),
    InvalidateAction.Comment.Reply('movie'),
  ],
  dependencies: (params) => [params.slug],
  request: myMovieCommentsRequest,
  mapper: (response) => response.body.map(mapToMediaComment),
  schema: z.array(MediaCommentSchema),
  ttl: time.minutes(5),
  enabled: (params) => params.enabled,
});
