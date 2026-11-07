import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import {
  type MatchResponse,
  MatchResponseSchema,
} from '../../models/MatchResponse.ts';
import { MatchSchema } from '../../models/Match.ts';
import type { MediaType } from '../../models/MediaType.ts';

type MatchParams = {
  type: MediaType;
  id: number;
  enabled: boolean;
} & ApiParams;

const NO_MATCH: MatchResponse = { match: null, taste: [] };

const matchRequest = async ({ fetch, type, id }: MatchParams) => {
  const response = await rawApiFetch({
    fetch,
    path: `/${type}s/${id}/match`,
  });

  return response.ok
    ? {
        body: MatchResponseSchema.parse(await response.json()),
        status: 200,
      }
    : { body: NO_MATCH, status: 200 };
};

export const matchQuery = defineQuery({
  key: 'match',
  invalidations: [
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Rated('movie'),
    InvalidateAction.Rated('show'),
    InvalidateAction.Favorited('movie'),
    InvalidateAction.Favorited('show'),
    InvalidateAction.Vip.Updated,
  ],
  dependencies: (params) => [params.type, params.id],
  request: matchRequest,
  mapper: (response) => ({
    kind: response.body.kind ?? 'match',
    basis: response.body.basis ?? 'series',
    score: response.body.match,
    taste: response.body.taste,
  }),
  schema: MatchSchema,
  ttl: time.hours(1),
  enabled: (params) => params.enabled,
});
