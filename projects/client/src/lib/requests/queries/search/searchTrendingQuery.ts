import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
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
export const TrendingSearchesSchema = z.object({
  type: z.literal('media'),
  items: TrendingSearchEntrySchema.array(),
});
type TrendingSearchEntry = z.infer<typeof TrendingSearchEntrySchema>;
export type TrendingSearchesResult = z.infer<typeof TrendingSearchesSchema>;

type SearchTrendingParams = {
  limit?: number;
  query?: string;
  type?: MediaType;
} & ApiParams;

const TYPE_TO_ENDPOINT: Record<MediaType, 'movies' | 'shows'> = {
  movie: 'movies',
  show: 'shows',
};

export function mapToTrendingSearchedMovie({
  count,
  movie,
}: TrendingSearchMovieResultResponse): TrendingSearchEntry {
  return {
    score: count,
    ...mapToMovieEntry(assertDefined(movie)),
  };
}

export function mapToTrendingSearchedShow({
  count,
  show,
}: TrendingSearchShowResultResponse): TrendingSearchEntry {
  return {
    score: count,
    ...mapToShowEntry(assertDefined(show)),
  };
}

const searchTrendingRequest = (
  { fetch, limit, query }: SearchTrendingParams,
  type: 'movies' | 'shows',
) => {
  const queryString = query ? { query } : {};

  return api({ fetch })
    .search
    .trending({
      params: {
        type,
      },
      query: {
        extended: 'full,images',
        page: 1,
        limit,
        ...queryString,
      },
    });
};

export const searchTrendingQuery = defineQuery({
  key: 'searchTrending',
  invalidations: [],
  dependencies: (params) => [params.limit, params.query, params.type],
  request: (params: SearchTrendingParams) => {
    const endpoints = params.type
      ? [TYPE_TO_ENDPOINT[params.type]]
      : [TYPE_TO_ENDPOINT.movie, TYPE_TO_ENDPOINT.show];

    return Promise.all(
      endpoints.map((endpoint) => searchTrendingRequest(params, endpoint)),
    );
  },
  mapper: (responses) => {
    const data = responses.flatMap((response) => response.body);
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
      .toSorted((a, b) => b.score - a.score);

    return {
      type: 'media' as const,
      items,
    };
  },
  schema: TrendingSearchesSchema,
  ttl: time.hours(3),
});
