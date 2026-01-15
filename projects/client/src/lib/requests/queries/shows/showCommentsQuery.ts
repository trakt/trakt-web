import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { time } from '$lib/utils/timing/time.ts';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';
import { PaginatableSchemaFactory } from '../../models/Paginatable.ts';
import type { PaginationParams } from '../../models/PaginationParams.ts';

type ShowCommentsParams =
  & { slug: string; sort: CommentSortType }
  & ApiParams
  & PaginationParams;

const showCommentsRequest = (
  { fetch, slug, limit, page, sort }: ShowCommentsParams,
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
        page,
        limit,
      },
    });

export const showCommentsQuery = defineInfiniteQuery({
  key: 'showComments:v2',
  invalidations: [
    InvalidateAction.Comment.Post('show'),
    InvalidateAction.Comment.Reply('show'),
  ],
  dependencies: (
    params,
  ) => [params.slug, params.page, params.limit, params.sort],
  request: showCommentsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToMediaComment),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MediaCommentSchema),
  ttl: time.minutes(30),
});
