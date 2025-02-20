import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaListSummary } from '../../_internal/mapToMediaListSummary.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';

type MovieListsParams = {
  slug: string;
  limit: number;
  type?: 'official' | 'personal';
} & ApiParams;

const movieListsRequest = (
  { fetch, slug, limit, type }: MovieListsParams,
) =>
  api({ fetch })
    .movies
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
        throw new Error('Failed to fetch movie lists');
      }

      return response.body;
    });

export const movieListsQuery = defineQuery({
  key: 'movieLists',
  invalidations: [],
  dependencies: (params) => [params.slug, params.limit, params.type],
  request: movieListsRequest,
  mapper: (data) => data.map(mapToMediaListSummary),
  schema: MediaListSummarySchema.array(),
  ttl: time.minutes(30),
});
