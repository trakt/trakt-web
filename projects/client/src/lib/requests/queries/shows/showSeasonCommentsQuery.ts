import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';
import { PaginatableSchemaFactory } from '../../models/Paginatable.ts';
import type { PaginationParams } from '../../models/PaginationParams.ts';

type ShowSeasonCommentsParams =
  & {
    slug: string;
    season: number;
    sort: CommentSortType;
    language?: string;
  }
  & ApiParams
  & PaginationParams;

const showSeasonCommentsRequest = (
  { fetch, slug, season, limit, page, sort, language }:
    ShowSeasonCommentsParams,
) =>
  api({ fetch })
    .shows
    .season
    .comments({
      params: {
        id: slug,
        season: castNumberAsString(season),
        sort,
      },
      query: {
        extended: 'images',
        limit,
        page,
        language,
      },
    });

export const showSeasonCommentsQuery = defineInfiniteQuery({
  key: 'showSeasonComments',
  invalidations: [
    InvalidateAction.Comment.Post('season'),
    InvalidateAction.Comment.Reply('season'),
  ],
  dependencies: (params) => [
    params.slug,
    params.season,
    params.page,
    params.limit,
    params.sort,
    params.language,
  ],
  request: showSeasonCommentsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToMediaComment),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MediaCommentSchema),
  ttl: time.minutes(30),
});
