import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapListResponseToMediaListSummary } from '../../_internal/mapListResponseToMediaListSummary.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';

type MovieListsParams = { slug: string; limit: number } & ApiParams;

const movieListsRequest = (
  { fetch, slug, limit }: MovieListsParams,
) =>
  api({ fetch })
    .movies
    .lists({
      params: {
        id: slug,
        type: 'all',
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
  dependencies: (params) => [params.slug, params.limit],
  request: movieListsRequest,
  mapper: (data) => data.map(mapListResponseToMediaListSummary),
  schema: MediaListSummarySchema.array(),
  ttl: time.minutes(30),
});
