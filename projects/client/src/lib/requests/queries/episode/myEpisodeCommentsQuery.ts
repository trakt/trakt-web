import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { time } from '$lib/utils/timing/time.ts';
import { commentResponseSchema } from '@trakt/api';
import { z } from 'zod';

const MyEpisodeCommentsResponseSchema = z.array(commentResponseSchema);

type MyEpisodeCommentsParams = {
  slug: string;
  season: number;
  episode: number;
  enabled: boolean;
} & ApiParams;

const myEpisodeCommentsRequest = async ({
  fetch,
  slug,
  season,
  episode,
}: MyEpisodeCommentsParams) => {
  const response = await rawApiFetch({
    fetch,
    path: `/shows/${slug}/seasons/${season}/episodes/${episode}/comments/mine`,
  });

  return response.ok
    ? {
      body: MyEpisodeCommentsResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: [], status: response.status };
};

export const myEpisodeCommentsQuery = defineQuery({
  key: 'myEpisodeComments',
  invalidations: [
    InvalidateAction.Comment.Post('episode'),
    InvalidateAction.Comment.Reply('episode'),
  ],
  dependencies: (params) => [params.slug, params.season, params.episode],
  request: myEpisodeCommentsRequest,
  mapper: (response) => response.body.map(mapToMediaComment),
  schema: z.array(MediaCommentSchema),
  ttl: time.minutes(5),
  enabled: (params) => params.enabled,
});
