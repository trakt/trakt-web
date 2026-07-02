import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MediaPlaysSchema } from '$lib/requests/models/MediaPlays.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { mapToWatchedPlays } from './_internal/mapToWatchedPlays.ts';
import { WatchedPlayResponseSchema } from './_internal/WatchedPlayResponseSchema.ts';

export const WatchedShowPlaysResponseSchema = z.record(
  z.string(),
  z.record(
    z.string(),
    z.record(z.string(), z.array(WatchedPlayResponseSchema)),
  ),
);

type WatchedShowPlaysResponse = z.infer<typeof WatchedShowPlaysResponseSchema>;

type CurrentUserWatchedShowPlaysParams = ApiParams;

function mapToEpisodePlays(response?: WatchedShowPlaysResponse) {
  return Object.values(response ?? {}).flatMap((seasons) =>
    Object.values(seasons).flatMap((episodes) =>
      Object.entries(episodes).map(([episodeId, plays]) => ({
        id: Number(episodeId),
        plays: mapToWatchedPlays(plays),
      }))
    )
  );
}

const currentUserWatchedShowPlaysRequest = async (
  { fetch }: CurrentUserWatchedShowPlaysParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: '/v3/users/me/watched/shows/plays?limit=all' },
  );

  return response.ok
    ? {
      body: WatchedShowPlaysResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const currentUserWatchedShowPlaysQuery = defineQuery({
  key: 'currentUserWatchedShowPlays',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
  ],
  dependencies: [],
  request: currentUserWatchedShowPlaysRequest,
  mapper: (response) => mapToEpisodePlays(response.body),
  schema: z.array(MediaPlaysSchema),
  ttl: time.minutes(30),
});
