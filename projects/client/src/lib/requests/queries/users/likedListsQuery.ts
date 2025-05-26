import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { ListResponse } from '@trakt/api';
import { mapToMediaListSummary } from '../../_internal/mapToMediaListSummary.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';

type PersonalListsParams = { slug: string } & ApiParams;

const likedListsRequest = (
  { fetch }: PersonalListsParams,
) =>
  api({ fetch })
    .users
    .likes
    .lists({
      query: {
        extended: 'full,images',
      },
    });

export const likedListsQuery = defineQuery({
  key: 'likedLists',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: likedListsRequest,
  mapper: (response) =>
    response.body.map((i) => mapToMediaListSummary(i.list as ListResponse)),
  schema: MediaListSummarySchema.array(),
  ttl: time.minutes(30),
});
