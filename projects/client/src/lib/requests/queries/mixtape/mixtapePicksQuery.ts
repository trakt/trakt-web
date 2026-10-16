import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { MovieResponse, ShowResponse } from '@trakt/api';
import { z } from 'zod';

type MixtapePicksParams = {
  type: MediaType;
  ids: ReadonlyArray<number>;
} & ApiParams;

type MixtapePicksBody = {
  movies: MovieResponse[];
  shows: ShowResponse[];
};

const SUMMARY_QUERY = { extended: 'full,images' } as const;

const mixtapePicksRequest = async (
  { fetch, type, ids }: MixtapePicksParams,
): Promise<{ body: MixtapePicksBody; status: number }> => {
  const client = api({ fetch });

  if (type === 'movie') {
    const responses = await Promise.all(
      ids.map((id) =>
        client.movies.summary({
          params: { id: String(id) },
          query: SUMMARY_QUERY,
        })
      ),
    );
    const movies = responses.flatMap((response) =>
      response.status === 200 ? [response.body] : []
    );
    return { body: { movies, shows: [] }, status: 200 };
  }

  const responses = await Promise.all(
    ids.map((id) =>
      client.shows.summary({ params: { id: String(id) }, query: SUMMARY_QUERY })
    ),
  );
  const shows = responses.flatMap((response) =>
    response.status === 200 ? [response.body] : []
  );
  return { body: { movies: [], shows }, status: 200 };
};

export const mixtapePicksQuery = defineQuery({
  key: 'mixtapePicks',
  invalidations: [],
  dependencies: (params: MixtapePicksParams) => [
    params.type,
    params.ids.join(','),
  ],
  request: mixtapePicksRequest,
  mapper: (response) => [
    ...response.body.movies.map(mapToMovieEntry),
    ...response.body.shows.map(mapToShowEntry),
  ],
  schema: z.array(z.union([MovieEntrySchema, ShowEntrySchema])),
  ttl: time.hours(3),
  enabled: (params: MixtapePicksParams) => params.ids.length > 0,
});
