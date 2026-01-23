import {
  type CollectionMinimalResponse,
  type CollectionMinimalShowResponse,
} from '@trakt/api';
import z from 'zod';
import { api, type ApiParams } from '../../../requests/api.ts';
import { time } from '../../../utils/timing/time.ts';
import { defineQuery } from '../../query/defineQuery.ts';

const UserPlexLibrarySchema = z.object({
  movieIds: z.array(z.number()),
  episodeIds: z.array(z.number()),
  showIds: z.array(z.number()),
});

export type UserPlexLibrary = z.infer<typeof UserPlexLibrarySchema>;

const currentUserPlexLibraryRequest = (
  { fetch }: ApiParams,
  type: 'movies' | 'shows' | 'episodes',
) =>
  api({ fetch })
    .sync
    .collection
    .minimal[type]({
      query: {
        available_on: 'plex',
      },
    });

function toTraktIds(
  libraryResponse: CollectionMinimalResponse | CollectionMinimalShowResponse,
): number[] {
  return Object.keys(libraryResponse).map((key) => parseInt(key, 10));
}

export const currentUserPlexLibraryQuery = defineQuery({
  key: 'currentUserPlexLibrary',
  request: (params) =>
    Promise.all([
      currentUserPlexLibraryRequest(params, 'movies'),
      currentUserPlexLibraryRequest(params, 'shows'),
      currentUserPlexLibraryRequest(params, 'episodes'),
    ]),
  invalidations: [],
  dependencies: [],
  mapper: ([moviesResponse, showsResponse, episodesResponse]) => ({
    movieIds: toTraktIds(moviesResponse.body),
    showIds: toTraktIds(showsResponse.body),
    episodeIds: toTraktIds(episodesResponse.body),
  }),
  schema: UserPlexLibrarySchema,
  ttl: time.hours(3),
});
