import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import {
  type UserMatch,
  UserMatchSchema,
} from '$lib/requests/models/UserMatch.ts';
import { time } from '$lib/utils/timing/time.ts';

type UserMatchParams = {
  slug: string;
  mode: DiscoverMode;
} & ApiParams;

const emptyMatch: UserMatch = {
  score: 0,
  breakdown: { subgenres: 0, favorites: 0 },
  shared: { subgenres: [], favorites: { movies: [], shows: [] } },
};

const userMatchRequest = async ({ fetch, slug, mode }: UserMatchParams) => {
  // mode='media' means no axis filter — omit the query param so the server
  // returns both movie and show signals. Otherwise pass the specific type
  // so the server skips the unused axis (cheaper) and the score reflects
  // only the active media type.
  const search = mode === 'media' ? '' : `?type=${mode}`;
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/${encodeURIComponent(slug)}/match${search}`,
  });

  if (!response.ok) {
    return { body: emptyMatch, status: response.status };
  }

  return {
    body: (await response.json()) as UserMatch,
    status: response.status,
  };
};

export const userMatchQuery = defineQuery({
  key: 'userMatch',
  invalidations: [
    InvalidateAction.Favorited('movie'),
    InvalidateAction.Favorited('show'),
  ],
  dependencies: (params) => [params.slug, params.mode],
  request: userMatchRequest,
  mapper: (response) => response.body,
  schema: UserMatchSchema,
  ttl: time.minutes(30),
});
