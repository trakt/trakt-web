import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { WatchingResponse } from '@trakt/api';
import {
  type NowPlayingItem,
  NowPlayingItemSchema,
} from '../../models/NowPlayingItem.ts';

type UserProfileParams = { slug: string } & ApiParams;

function mapToNowPlayingItem(response: WatchingResponse): NowPlayingItem {
  const commonProps = {
    startedAt: new Date(response.started_at),
    expiresAt: new Date(response.expires_at),
  };

  if (response.type === 'episode') {
    return {
      ...commonProps,
      media: mapToShowEntry(response.show),
      episode: mapToEpisodeEntry(response.episode),
      type: 'episode',
    };
  }

  return {
    ...commonProps,
    media: mapToMovieEntry(response.movie),
    type: 'movie',
  };
}

const userWatchingRequest = (
  { fetch, slug }: UserProfileParams,
) =>
  api({ fetch })
    .users
    .watching({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,images',
      },
    });

export const userWatchingQuery = defineQuery({
  key: 'userWatching',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: userWatchingRequest,
  mapper: (response) =>
    response.status === 200 ? mapToNowPlayingItem(response.body) : undefined,
  schema: NowPlayingItemSchema.optional(),
  ttl: time.minutes(1),
});
