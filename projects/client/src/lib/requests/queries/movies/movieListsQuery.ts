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
        extended: 'images,colors',
        limit,
      },
    });

export const movieListsQuery = defineQuery({
  key: 'movieLists',
  invalidations: [],
  dependencies: (params) => [params.slug, params.limit, params.type],
  request: movieListsRequest,
  mapper: (response) => response.body.map(mapToMediaListSummary),
  schema: MediaListSummarySchema.array(),
  ttl: time.minutes(30),
});
