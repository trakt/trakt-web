import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapCommentResponseToMediaComment } from '$lib/requests/_internal/mapCommentResponseToMediaComment.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { time } from '$lib/utils/timing/time.ts';

const DEFAULT_COMMENT_SORT = 'likes' as const;

type ShowCommentsParams = { slug: string } & ApiParams;

const showCommentsRequest = (
  { fetch, slug }: ShowCommentsParams,
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
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch show comments');
      }

      return response.body;
    });

export const showCommentsQuery = defineQuery({
  key: 'showComments',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showCommentsRequest,
  mapper: (data) => data.map(mapCommentResponseToMediaComment),
  schema: MediaCommentSchema.array(),
  ttl: time.minutes(30),
});
