import z from 'zod';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { toCollectionProviders } from './_internal/toCollectionProviders.ts';

const ProvidersByIdSchema = z.record(
  z.string(),
  z.array(z.string()).readonly(),
);

const UserDigitalLibrarySchema = z.object({
  movies: ProvidersByIdSchema,
  shows: ProvidersByIdSchema,
  episodes: ProvidersByIdSchema,
});

export type UserDigitalLibrary = z.infer<typeof UserDigitalLibrarySchema>;

const currentUserDigitalLibraryRequest = (
  { fetch }: ApiParams,
  type: 'movies' | 'shows' | 'episodes',
) =>
  api({ fetch })
    .sync
    .collection
    .minimal[type]({
      query: {
        available_on: 'digital',
      },
    });

export const currentUserDigitalLibraryQuery = defineQuery({
  key: 'currentUserDigitalLibrary',
  request: (params) =>
    Promise.all([
      currentUserDigitalLibraryRequest(params, 'movies'),
      currentUserDigitalLibraryRequest(params, 'shows'),
      currentUserDigitalLibraryRequest(params, 'episodes'),
    ]),
  invalidations: [
    InvalidateAction.Collected('movie'),
    InvalidateAction.Collected('episode'),
  ],
  dependencies: [],
  mapper: ([moviesResponse, showsResponse, episodesResponse]) => ({
    movies: toCollectionProviders(moviesResponse.body),
    shows: toCollectionProviders(showsResponse.body),
    episodes: toCollectionProviders(episodesResponse.body),
  }),
  schema: UserDigitalLibrarySchema,
  ttl: time.hours(3),
});
