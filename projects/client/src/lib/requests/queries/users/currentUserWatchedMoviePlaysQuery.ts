import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MediaPlaysSchema } from '$lib/requests/models/MediaPlays.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { mapToWatchedPlays } from './_internal/mapToWatchedPlays.ts';
import { WatchedPlayResponseSchema } from './_internal/WatchedPlayResponseSchema.ts';

export const WatchedMoviePlaysResponseSchema = z.record(
  z.string(),
  z.array(WatchedPlayResponseSchema),
);

type WatchedMoviePlaysResponse = z.infer<
  typeof WatchedMoviePlaysResponseSchema
>;

type CurrentUserWatchedMoviePlaysParams = ApiParams;

function mapToMoviePlays(response?: WatchedMoviePlaysResponse) {
  return Object.entries(response ?? {}).map(([movieId, plays]) => ({
    id: Number(movieId),
    plays: mapToWatchedPlays(plays),
  }));
}

const currentUserWatchedMoviePlaysRequest = async (
  { fetch }: CurrentUserWatchedMoviePlaysParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: '/v3/users/me/watched/movies/plays?limit=all' },
  );

  return response.ok
    ? {
      body: WatchedMoviePlaysResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const currentUserWatchedMoviePlaysQuery = defineQuery({
  key: 'currentUserWatchedMoviePlays',
  invalidations: [
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: [],
  request: currentUserWatchedMoviePlaysRequest,
  mapper: (response) => mapToMoviePlays(response.body),
  schema: z.array(MediaPlaysSchema),
  ttl: time.minutes(30),
});
