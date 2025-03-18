import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';

type CommentRepliesParams =
  & {
    id: number;
  }
  & PaginationParams
  & ApiParams;

const userCommentRepliesRequest = (
  {
    fetch,
    id,
    limit,
    page,
  }: CommentRepliesParams,
) =>
  api({ fetch })
    .comments
    .replies({
      params: {
        id: `${id}`,
      },
      query: {
        page,
        limit,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch comment replies');
      }

      return response;
    });

export const commentRepliesQuery = defineQuery({
  key: 'commentReplies',
  invalidations: [],
  dependencies: (
    params,
  ) => [
    params.id,
    params.limit,
    params.page,
  ],
  request: userCommentRepliesRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToMediaComment),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MediaCommentSchema),
  ttl: time.minutes(30),
});
