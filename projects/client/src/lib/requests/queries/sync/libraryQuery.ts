import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';
import { LibraryItemSchema } from '../../models/LibraryItem.ts';
import { PaginatableSchemaFactory } from '../../models/Paginatable.ts';
import type { LibraryParams } from './_internal/LibraryParams.ts';
import { mapToLibraryItem } from './_internal/mapToLibraryItem.ts';
import { episodeLibraryRequest } from './libraryEpisodesQuery.ts';
import { movieLibraryRequest } from './libraryMoviesQuery.ts';

export const libraryQuery = defineInfiniteQuery({
  key: 'libraryQuery',
  invalidations: [],
  dependencies: (params) => [params.page, params.limit, params.availableOn],
  // FIXME: replace with the 'all' endpoint when available
  request: (params: LibraryParams) =>
    Promise.all([
      movieLibraryRequest(params),
      episodeLibraryRequest(params),
    ]),
  mapper: ([movieResponse, episodeResponse]) => {
    const movies = movieResponse.body.map(mapToLibraryItem);
    const episodes = episodeResponse.body.map(mapToLibraryItem);

    return {
      entries: [...movies, ...episodes].toSorted((a, b) =>
        b.addedAt.getTime() - a.addedAt.getTime()
      ),
      page: extractPageMeta(episodeResponse.headers),
    };
  },
  schema: PaginatableSchemaFactory(LibraryItemSchema),
  ttl: time.hours(3),
  refetchOnWindowFocus: true,
});
