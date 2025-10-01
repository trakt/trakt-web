import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { type ApiParams } from '$lib/requests/api.ts';
import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SearchResultResponse } from '@trakt/api';
import z from 'zod';
import type { MediaEntry } from '../../models/MediaEntry.ts';
import type { MediaType } from '../../models/MediaType.ts';
import { getMedia } from './getMedia.ts';

type SearchParams = {
  query: string;
  config: TypesenseConfig;
  type?: MediaType;
} & ApiParams;

const MediaResultSchema = z.object({
  score: z.number(),
}).merge(MediaEntrySchema);

const MediaSearchResultSchema = z.object({
  type: z.literal('media'),
  items: MediaResultSchema.array(),
});

export type MediaResult = z.infer<typeof MediaResultSchema>;
export type MediaSearchResult = z.infer<typeof MediaSearchResultSchema>;

function isGarbage(value: MediaEntry): boolean {
  const isReleased = value?.status === 'released';
  const isInvalidRelease = isReleased && value?.year == null;
  const hasNoGenres = !value?.genres.length;

  return isInvalidRelease ||
    hasNoGenres;
}

function mapToSearchResultEntry(
  item: SearchResultResponse,
): MediaResult {
  const { type } = item;
  switch (type) {
    case 'show':
      return {
        score: item.score,
        ...mapToShowEntry(assertDefined(item.show)),
      };
    case 'movie':
      return {
        score: item.score,
        ...mapToMovieEntry(assertDefined(item.movie)),
      };
    default:
      throw new Error(`Unsupported type for media search: ${type}`);
  }
}

const searchRequest = async (
  { query, type, config }: SearchParams,
) => {
  const response = await getMedia({
    query,
    config,
    types: type ? [type] : ['movie', 'show'],
  });

  return response.map((item) => ({
    ...item,
    status: 200,
  }));
};

export const searchMediaQuery = defineQuery({
  key: 'searchMedia',
  invalidations: [],
  dependencies: (params) => [params.query.toLowerCase().trim(), params.type],
  request: searchRequest,
  mapper: (response) => {
    return {
      type: 'media' as const,
      items: response
        .map(mapToSearchResultEntry)
        .filter((value) => !isGarbage(value)),
    };
  },
  schema: MediaSearchResultSchema,
  ttl: time.minutes(30),
  retry: 0,
});
