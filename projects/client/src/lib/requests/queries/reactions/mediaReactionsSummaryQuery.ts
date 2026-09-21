import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ReactionTarget } from '$lib/requests/models/ReactionTarget.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { toReactionsPath } from './_internal/toReactionsPath.ts';

// Local schema on purpose: the SDK's summary schema keys the distribution by
// the seven comment reactions and rejects the media names.
const MediaReactionsSummaryResponseSchema = z.object({
  reaction_count: z.number().int(),
  user_count: z.number().int(),
  distribution: z.record(z.string(), z.number().int()),
});

const MediaReactionsSummarySchema = z.object({
  count: z.number(),
  distribution: z.record(z.string(), z.number()),
});

type MediaReactionsSummaryParams = {
  target: ReactionTarget;
  /**
   * The read is public-cached for a minute. A write bumps this so the refetch
   * carries a fresh cache key instead of the count it just changed.
   */
  version?: number;
} & ApiParams;

const EMPTY = { reaction_count: 0, user_count: 0, distribution: {} };

const mediaReactionsSummaryRequest = async (
  { fetch, target, version = 0 }: MediaReactionsSummaryParams,
) => {
  const bust = version > 0 ? `?_cb=${version}` : '';
  const response = await rawApiFetch({
    fetch,
    path: `${toReactionsPath(target)}/summary${bust}`,
    authenticated: false,
  });

  return {
    body: response.ok
      ? MediaReactionsSummaryResponseSchema.parse(await response.json())
      : EMPTY,
    status: 200,
  };
};

export const mediaReactionsSummaryQuery = defineQuery({
  key: 'mediaReactionsSummary',
  invalidations: [InvalidateAction.ReactMedia],
  dependencies: (params) => [
    params.target.type,
    params.target.id,
    params.version,
  ],
  request: mediaReactionsSummaryRequest,
  mapper: (response) => ({
    count: response.body.reaction_count,
    distribution: response.body.distribution,
  }),
  schema: MediaReactionsSummarySchema,
  // A public counter: short enough that a reaction placed on another device
  // shows up without a hard refresh.
  ttl: time.minutes(5),
});
