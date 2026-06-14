import z from 'zod';
import { api, type ApiParams } from '../../../requests/api.ts';
import { InvalidateAction } from '../../../requests/models/InvalidateAction.ts';
import { time } from '../../../utils/timing/time.ts';
import { defineQuery } from '../../query/defineQuery.ts';
import { toCollectionTraktIds } from './_internal/toCollectionTraktIds.ts';

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

export const currentUserPlexLibraryQuery = defineQuery({
  key: 'currentUserPlexLibrary',
  request: (params) =>
    Promise.all([
      currentUserPlexLibraryRequest(params, 'movies'),
      currentUserPlexLibraryRequest(params, 'shows'),
      currentUserPlexLibraryRequest(params, 'episodes'),
    ]),
  invalidations: [
    InvalidateAction.Collected('movie'),
    InvalidateAction.Collected('episode'),
  ],
  dependencies: [],
  mapper: ([moviesResponse, showsResponse, episodesResponse]) => ({
    movieIds: toCollectionTraktIds(moviesResponse.body),
    showIds: toCollectionTraktIds(showsResponse.body),
    episodeIds: toCollectionTraktIds(episodesResponse.body),
  }),
  schema: UserPlexLibrarySchema,
  ttl: time.hours(3),
});
