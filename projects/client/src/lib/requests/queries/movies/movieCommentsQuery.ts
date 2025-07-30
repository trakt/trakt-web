import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { LimitlessParams } from '$lib/requests/models/LimitlessParams.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { time } from '$lib/utils/timing/time.ts';

const DEFAULT_COMMENT_SORT = 'likes' as const;

type MovieCommentsParams = { slug: string } & ApiParams & LimitlessParams;

const movieCommentsRequest = (
  { fetch, slug, limit }: MovieCommentsParams,
) =>
  api({ fetch })
    .movies
    .comments({
      params: {
        id: slug,
        sort: DEFAULT_COMMENT_SORT,
      },
      query: {
        extended: 'images',
        limit,
      },
    });

export const movieCommentsQuery = defineQuery({
  key: 'movieComments',
  invalidations: [InvalidateAction.Commented('movie')],
  dependencies: (params) => [params.slug, params.limit],
  request: movieCommentsRequest,
  mapper: (response) => response.body.map(mapToMediaComment),
  schema: MediaCommentSchema.array(),
  ttl: time.minutes(30),
});
