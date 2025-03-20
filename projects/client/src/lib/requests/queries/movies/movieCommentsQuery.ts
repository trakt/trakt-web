import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { time } from '$lib/utils/timing/time.ts';

const DEFAULT_COMMENT_SORT = 'likes' as const;

type MovieCommentsParams = { slug: string } & ApiParams;

const movieCommentsRequest = (
  { fetch, slug }: MovieCommentsParams,
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
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch movie comments');
      }

      return response.body;
    });

export const movieCommentsQuery = defineQuery({
  key: 'movieComments',
  invalidations: [InvalidateAction.Like],
  dependencies: (params) => [params.slug],
  request: movieCommentsRequest,
  mapper: (data) => data.map(mapToMediaComment),
  schema: MediaCommentSchema.array(),
  ttl: time.minutes(30),
});
