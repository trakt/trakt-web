import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { LimitlessParams } from '$lib/requests/models/LimitlessParams.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { time } from '$lib/utils/timing/time.ts';

const DEFAULT_COMMENT_SORT = 'likes' as const;

type ShowCommentsParams = { slug: string } & ApiParams & LimitlessParams;

const showCommentsRequest = (
  { fetch, slug, limit }: ShowCommentsParams,
) =>
  api({ fetch })
    .shows
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

export const showCommentsQuery = defineQuery({
  key: 'showComments',
  invalidations: [InvalidateAction.Commented('show')],
  dependencies: (params) => [params.slug, params.limit],
  request: showCommentsRequest,
  mapper: (response) => response.body.map(mapToMediaComment),
  schema: MediaCommentSchema.array(),
  ttl: time.minutes(30),
});
