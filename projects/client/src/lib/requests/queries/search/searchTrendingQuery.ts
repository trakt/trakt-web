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
import type { MediaType } from '../../models/MediaType.ts';

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

const TRENDING_TYPES = {
  movie: ['movies'],
  show: ['shows'],
} as const satisfies Record<MediaType, ReadonlyArray<'movies' | 'shows'>>;

function toTrendingTypes(
  type: MediaType | undefined,
): ReadonlyArray<'movies' | 'shows'> {
  return type == null ? ['movies', 'shows'] : TRENDING_TYPES[type];
}

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
  request: (params: SearchTrendingParams) =>
    Promise.all(
      toTrendingTypes(params.type)
        .map((type) => searchTrendingRequest(params, type)),
    ),
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
