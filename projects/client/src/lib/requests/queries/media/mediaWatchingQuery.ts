import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import type { MediaSocialQueryTarget } from '$lib/requests/queries/media/mediaSocialQuery.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

type MediaWatchingParams = MediaSocialQueryTarget & ApiParams;

const mediaWatchingRequest = (params: MediaWatchingParams) => {
  const client = api({ fetch: params.fetch });
  const query = { extended: 'full' as const };

  switch (params.type) {
    case 'movie':
      return client.movies.watching({ params: { id: params.slug }, query });
    case 'show':
      return client.shows.watching({ params: { id: params.slug }, query });
    case 'episode':
      return client.shows.episode.watching({
        params: {
          id: params.slug,
          season: castNumberAsString(params.season),
          episode: params.episode,
        },
        query,
      });
  }
};

export const mediaWatchingQuery = defineQuery({
  key: 'mediaWatching',
  invalidations: [InvalidateAction.CheckIn],
  dependencies: (params) => [
    params.type,
    params.slug,
    params.type === 'episode' ? params.season : null,
    params.type === 'episode' ? params.episode : null,
  ],
  request: mediaWatchingRequest,
  mapper: (response) => response.body.map(mapToUserProfile),
  schema: z.array(UserProfileSchema),
  ttl: time.minutes(2),
});
