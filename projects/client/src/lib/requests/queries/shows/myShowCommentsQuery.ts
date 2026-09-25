import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { time } from '$lib/utils/timing/time.ts';
import { commentResponseSchema } from '@trakt/api';
import { z } from 'zod';

const MyShowCommentsResponseSchema = z.array(commentResponseSchema);

type MyShowCommentsParams = {
  slug: string;
  enabled: boolean;
} & ApiParams;

const myShowCommentsRequest = async ({ fetch, slug }: MyShowCommentsParams) => {
  const response = await rawApiFetch({
    fetch,
    path: `/shows/${slug}/comments/mine`,
  });

  return response.ok
    ? {
      body: MyShowCommentsResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: [], status: response.status };
};

export const myShowCommentsQuery = defineQuery({
  key: 'myShowComments',
  invalidations: [
    InvalidateAction.Comment.Post('show'),
    InvalidateAction.Comment.Reply('show'),
  ],
  dependencies: (params) => [params.slug],
  request: myShowCommentsRequest,
  mapper: (response) => response.body.map(mapToMediaComment),
  schema: z.array(MediaCommentSchema),
  ttl: time.minutes(5),
  enabled: (params) => params.enabled,
});
