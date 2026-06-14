import z from 'zod';
import { api, type ApiParams } from '../../../requests/api.ts';
import { InvalidateAction } from '../../../requests/models/InvalidateAction.ts';
import { time } from '../../../utils/timing/time.ts';
import { defineQuery } from '../../query/defineQuery.ts';
import { toCollectionTraktIds } from './_internal/toCollectionTraktIds.ts';

const UserCollectionSchema = z.object({
  movies: z.set(z.number()),
  episodes: z.set(z.number()),
});

export type UserCollection = z.infer<typeof UserCollectionSchema>;

const currentUserCollectionRequest = (
  { fetch }: ApiParams,
  type: 'movies' | 'episodes',
) =>
  api({ fetch })
    .sync
    .collection
    .minimal[type]({
      query: {},
    });

export const currentUserCollectionQuery = defineQuery({
  key: 'currentUserCollection',
  request: (params) =>
    Promise.all([
      currentUserCollectionRequest(params, 'movies'),
      currentUserCollectionRequest(params, 'episodes'),
    ]),
  invalidations: [
    InvalidateAction.Collected('movie'),
    InvalidateAction.Collected('episode'),
  ],
  dependencies: [],
  mapper: ([moviesResponse, episodesResponse]) => ({
    movies: new Set(toCollectionTraktIds(moviesResponse.body)),
    episodes: new Set(toCollectionTraktIds(episodesResponse.body)),
  }),
  schema: UserCollectionSchema,
  ttl: time.hours(3),
});
