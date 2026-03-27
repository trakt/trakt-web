import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaListSummary } from '../../_internal/mapToMediaListSummary.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';

type MovieListsParams =
  & { slug: string; type?: 'official' | 'personal' }
  & PaginationParams
  & ApiParams;

const movieListsRequest = (
  { fetch, slug, limit, page, type }: MovieListsParams,
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
        page,
      },
    });

export const movieListsQuery = defineInfiniteQuery({
  key: 'movieLists',
  invalidations: [InvalidateAction.List.Like],
  dependencies: (
    params,
  ) => [params.slug, params.limit, params.page, params.type],
  request: movieListsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToMediaListSummary),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MediaListSummarySchema),
  ttl: time.minutes(30),
});
