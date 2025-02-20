import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaListSummary } from '../../_internal/mapToMediaListSummary.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';

type ShowListsParams = {
  slug: string;
  limit: number;
  type?: 'official' | 'personal';
} & ApiParams;

const showListsRequest = (
  { fetch, slug, limit, type }: ShowListsParams,
) =>
  api({ fetch })
    .shows
    .lists({
      params: {
        id: slug,
        type: type ?? 'personal',
        sort: 'popular',
      },
      query: {
        extended: 'images',
        limit,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch show lists');
      }

      return response.body;
    });

export const showListsQuery = defineQuery({
  key: 'showLists',
  invalidations: [],
  dependencies: (params) => [params.slug, params.limit, params.type],
  request: showListsRequest,
  mapper: (data) => data.map(mapToMediaListSummary),
  schema: MediaListSummarySchema.array(),
  ttl: time.minutes(30),
});
