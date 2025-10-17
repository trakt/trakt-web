import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { LimitlessParams } from '$lib/requests/models/LimitlessParams.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { time } from '$lib/utils/timing/time.ts';

type MovieCommentsParams =
  & { slug: string; sort: CommentSortType }
  & ApiParams
  & LimitlessParams;

const movieCommentsRequest = (
  { fetch, slug, limit, sort }: MovieCommentsParams,
) =>
  api({ fetch })
    .movies
    .comments({
      params: {
        id: slug,
        sort,
      },
      query: {
        extended: 'images',
        limit,
      },
    });

export const movieCommentsQuery = defineQuery({
  key: 'movieComments',
  invalidations: [InvalidateAction.Comment.Post('movie')],
  dependencies: (params) => [params.slug, params.limit, params.sort],
  request: movieCommentsRequest,
  mapper: (response) => response.body.map(mapToMediaComment),
  schema: MediaCommentSchema.array(),
  ttl: time.minutes(30),
});
