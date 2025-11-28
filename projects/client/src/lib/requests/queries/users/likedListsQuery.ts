import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { ListResponse } from '@trakt/api';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';
import { mapToMediaListSummary } from '../../_internal/mapToMediaListSummary.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';
import { PaginatableSchemaFactory } from '../../models/Paginatable.ts';
import type { PaginationParams } from '../../models/PaginationParams.ts';

type PersonalListsParams = ApiParams & PaginationParams;

// FIXME: add support for non 'me' users
const likedListsRequest = (
  { fetch, page, limit }: PersonalListsParams,
) =>
  api({ fetch })
    .users
    .likes
    .lists({
      query: {
        extended: 'full,images',
        page,
        limit,
      },
    });

export const likedListsQuery = defineQuery({
  key: 'likedLists',
  invalidations: [],
  dependencies: (params) => [params.page, params.limit],
  request: likedListsRequest,
  mapper: (response) => ({
    entries: response.body.map((i) =>
      mapToMediaListSummary(i.list as ListResponse)
    ),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MediaListSummarySchema),
  ttl: time.minutes(30),
});
