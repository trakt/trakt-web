import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { UserListsSortBy } from '$lib/requests/models/UserListsSortBy.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import { time } from '$lib/utils/timing/time.ts';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';
import { mapToMediaListSummary } from '../../_internal/mapToMediaListSummary.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';
import { PaginatableSchemaFactory } from '../../models/Paginatable.ts';
import type { PaginationParams } from '../../models/PaginationParams.ts';

type PersonalListsParams = {
  slug: string;
  collaborative?: boolean;
  sortBy?: UserListsSortBy | Nil;
  sortHow?: SortDirection | Nil;
} & ApiParams &
  PaginationParams;

const personalListsRequest = ({
  fetch,
  slug,
  collaborative,
  page,
  limit,
  sortBy,
  sortHow,
}: PersonalListsParams) => {
  const query = {
    extended: 'images' as const,
    page,
    limit,
    sort_by: sortBy,
    sort_how: sortHow,
    collaborative,
  };

  return api({ fetch }).users.lists.personal({
    params: {
      id: slug,
    },
    query,
  });
};

export const personalListsQuery = defineInfiniteQuery({
  key: 'personalLists',
  invalidations: [
    InvalidateAction.List.Edited,
    InvalidateAction.List.Deleted,
    InvalidateAction.List.Created,
    InvalidateAction.List.Like,
    InvalidateAction.List.Collaborators,
    InvalidateAction.Listed('movie'),
    InvalidateAction.Listed('show'),
  ],
  dependencies: (params) => [
    params.slug,
    params.collaborative,
    params.page,
    params.limit,
    params.sortBy,
    params.sortHow,
  ],
  request: personalListsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToMediaListSummary),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MediaListSummarySchema),
  ttl: time.minutes(30),
});
