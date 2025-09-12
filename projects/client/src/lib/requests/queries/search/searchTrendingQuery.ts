import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { MovieTrendingResponse, ShowTrendingResponse } from '@trakt/api';
import z from 'zod';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';

const TrendingSearchEntrySchema = MediaEntrySchema.extend({
  score: z.number(),
});
const TrendingSearchesSchema = z.object({
  type: z.literal('media'),
  items: TrendingSearchEntrySchema.array(),
});
type TrendingSearchEntry = z.infer<typeof TrendingSearchEntrySchema>;

type SearchTrendingParams = { limit: number } & ApiParams;

function mapToTrendingSearchedMovie({
  watchers,
  movie,
}: MovieTrendingResponse): TrendingSearchEntry {
  return {
    score: watchers,
    ...mapToMovieEntry(movie),
  };
}

function mapToTrendingSearchedShow({
  watchers,
  show,
}: ShowTrendingResponse): TrendingSearchEntry {
  return {
    score: watchers,
    ...mapToShowEntry(show),
  };
}

// FIXME: replace with search data endpoint when available
const searchTrendingRequest = (
  { fetch, limit }: SearchTrendingParams,
  type: 'movies' | 'shows',
) =>
  api({ fetch })[type]
    .trending({
      query: {
        extended: 'full,images,colors',
        page: 1,
        limit,
      },
    });

export const searchTrendingQuery = defineQuery({
  key: 'searchTrending',
  invalidations: [],
  dependencies: (params) => [params.limit],
  request: (params: SearchTrendingParams) =>
    Promise.all([
      searchTrendingRequest(params, 'movies'),
      searchTrendingRequest(params, 'shows'),
    ]),
  mapper: ([moviesResponse, showsResponse]) => {
    const data = [...moviesResponse.body, ...showsResponse.body];
    const allItems = data.map((item) =>
      'show' in item
        ? mapToTrendingSearchedShow(item)
        : mapToTrendingSearchedMovie(item)
    );

    const items = allItems
      .filter((item) => item.id !== 0 && item.slug !== null)
      .sort((a, b) => b.score - a.score);

    return {
      type: 'media' as const,
      items,
    };
  },
  schema: TrendingSearchesSchema,
  ttl: time.hours(3),
});
