import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaListSummary } from '../../_internal/mapToMediaListSummary.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
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
    });

export const movieListsQuery = defineQuery({
  key: 'movieLists',
  invalidations: [InvalidateAction.List.Like],
  dependencies: (params) => [params.slug, params.limit, params.type],
  request: movieListsRequest,
  mapper: (response) => response.body.map(mapToMediaListSummary),
  schema: MediaListSummarySchema.array(),
  ttl: time.minutes(30),
});
