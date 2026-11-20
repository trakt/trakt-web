import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToNowPlayingItem } from '$lib/requests/_internal/mapToNowPlayingItem.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { NowPlayingItemSchema } from '$lib/requests/models/NowPlayingItem.ts';
import { time } from '$lib/utils/timing/time.ts';

type UserProfileParams = { slug: string } & ApiParams;

const userWatchingRequest = ({ fetch, slug }: UserProfileParams) =>
  api({ fetch }).users.watching({
    params: {
      id: slug,
    },
    query: {
      extended: 'full',
    },
  });

export const userWatchingQuery = defineQuery({
  key: 'userWatching',
  invalidations: [InvalidateAction.CheckIn],
  dependencies: (params) => [params.slug],
  request: userWatchingRequest,
  mapper: (response) =>
    response.status === 200 ? mapToNowPlayingItem(response.body) : undefined,
  schema: NowPlayingItemSchema.optional(),
  ttl: time.minutes(1),
});
