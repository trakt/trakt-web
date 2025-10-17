import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { LimitlessParams } from '$lib/requests/models/LimitlessParams.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { time } from '$lib/utils/timing/time.ts';

type ShowCommentsParams =
  & { slug: string; sort: CommentSortType }
  & ApiParams
  & LimitlessParams;

const showCommentsRequest = (
  { fetch, slug, limit, sort }: ShowCommentsParams,
) =>
  api({ fetch })
    .shows
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

export const showCommentsQuery = defineQuery({
  key: 'showComments',
  invalidations: [InvalidateAction.Comment.Post('show')],
  dependencies: (params) => [params.slug, params.limit, params.sort],
  request: showCommentsRequest,
  mapper: (response) => response.body.map(mapToMediaComment),
  schema: MediaCommentSchema.array(),
  ttl: time.minutes(30),
});
