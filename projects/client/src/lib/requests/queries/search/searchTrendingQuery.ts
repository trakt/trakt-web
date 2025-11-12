import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { time } from '$lib/utils/timing/time.ts';
import type {
  TrendingSearchMovieResultResponse,
  TrendingSearchShowResultResponse,
} from '@trakt/api';
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
export type TrendingSearchesResult = z.infer<typeof TrendingSearchesSchema>;

type SearchTrendingParams = { limit: number } & ApiParams;

function mapToTrendingSearchedMovie({
  count,
  movie,
}: TrendingSearchMovieResultResponse): TrendingSearchEntry {
  return {
    score: count,
    ...mapToMovieEntry(assertDefined(movie)),
  };
}

function mapToTrendingSearchedShow({
  count,
  show,
}: TrendingSearchShowResultResponse): TrendingSearchEntry {
  return {
    score: count,
    ...mapToShowEntry(assertDefined(show)),
  };
}

const searchTrendingRequest = (
  { fetch, limit }: SearchTrendingParams,
  type: 'movies' | 'shows',
) =>
  api({ fetch })
    .search
    .trending({
      params: {
        type,
      },
      query: {
        extended: 'full,images',
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
    const allItems = data.map((item) => {
      if (item.type === 'person') {
        throw new Error('Unsupported type for trending media search');
      }

      return item.type === 'show'
        ? mapToTrendingSearchedShow(item)
        : mapToTrendingSearchedMovie(item);
    });

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
