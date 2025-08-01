import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { type CollectionMinimalResponse } from '@trakt/api';
import z from 'zod';

const UserPlexCollectionSchema = z.object({
  movieIds: z.array(z.number()),
  episodeIds: z.array(z.number()),
});

export type UserPlexCollection = z.infer<typeof UserPlexCollectionSchema>;

const currentUserPlexCollectionRequest = (
  { fetch }: ApiParams,
  type: 'movies' | 'episodes',
) =>
  api({ fetch })
    .sync
    .collection
    .minimal
    [type]({
      query: {
        extended: 'min',
        available_on: 'plex',
      },
    });

function toTraktIds(
  entry: CollectionMinimalResponse,
): number[] {
  return Object.keys(entry).map((key) => parseInt(key, 10));
}

export const currentUserPlexCollectionQuery = defineQuery({
  key: 'currentUserPlexCollection',
  request: () =>
    Promise.all([
      // TODO also shows?
      currentUserPlexCollectionRequest({ fetch }, 'movies'),
      currentUserPlexCollectionRequest({ fetch }, 'episodes'),
    ]),
  invalidations: [],
  dependencies: [],
  mapper: ([moviesResponse, episodesResponse]) => ({
    movieIds: toTraktIds(moviesResponse.body),
    episodeIds: toTraktIds(episodesResponse.body),
  }),
  schema: UserPlexCollectionSchema,
  ttl: time.hours(3),
});
