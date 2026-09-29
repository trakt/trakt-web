import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { time } from '$lib/utils/timing/time.ts';
import { commentResponseSchema } from '@trakt/api';
import { z } from 'zod';

const MyShowSeasonCommentsResponseSchema = z.array(commentResponseSchema);

type MyShowSeasonCommentsParams = {
  slug: string;
  season: number;
  enabled: boolean;
} & ApiParams;

const myShowSeasonCommentsRequest = async ({
  fetch,
  slug,
  season,
}: MyShowSeasonCommentsParams) => {
  const response = await rawApiFetch({
    fetch,
    path: `/shows/${slug}/seasons/${season}/comments/mine`,
  });

  return response.ok
    ? {
      body: MyShowSeasonCommentsResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: [], status: response.status };
};

export const myShowSeasonCommentsQuery = defineQuery({
  key: 'myShowSeasonComments',
  invalidations: [
    InvalidateAction.Comment.Post('season'),
    InvalidateAction.Comment.Reply('season'),
  ],
  dependencies: (params) => [params.slug, params.season],
  request: myShowSeasonCommentsRequest,
  mapper: (response) => response.body.map(mapToMediaComment),
  schema: z.array(MediaCommentSchema),
  ttl: time.minutes(5),
  enabled: (params) => params.enabled,
});
