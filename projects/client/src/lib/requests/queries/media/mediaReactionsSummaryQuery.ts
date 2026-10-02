import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MediaReactionSchema } from '$lib/requests/models/MediaReaction.ts';
import {
  type MediaReactionSummary,
  MediaReactionSummarySchema,
} from '$lib/requests/models/MediaReactionSummary.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { toMediaReactionDistribution } from '$lib/utils/reactions/toMediaReactionDistribution.ts';
import { toTopReactions } from '$lib/utils/reactions/toTopReactions.ts';
import {
  type MediaReactionsSummaryResponse,
  MediaReactionsSummaryResponseSchema,
} from '$lib/requests/models/MediaReactionsSummaryResponse.ts';
import { time } from '$lib/utils/timing/time.ts';
import { toMediaReactionsPath } from '$lib/requests/_internal/toMediaReactionsPath.ts';

type MediaReactionsSummaryParams = {
  type: MediaType;
  slug: string;
} & ApiParams;

const EMPTY_RESPONSE: MediaReactionsSummaryResponse = {
  reaction_count: 0,
  user_count: 0,
  distribution: {},
};

function mapToMediaReactionSummary(
  response: MediaReactionsSummaryResponse,
): MediaReactionSummary {
  const distribution = toMediaReactionDistribution(response.distribution);

  return {
    totalCount: response.reaction_count,
    distribution,
    top: toTopReactions({
      distribution,
      reactions: MediaReactionSchema.options,
    }),
  };
}

const mediaReactionsSummaryRequest = async (
  { fetch, type, slug }: MediaReactionsSummaryParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `${toMediaReactionsPath(type, slug)}/summary`,
  });

  if (!response.ok) {
    return { body: EMPTY_RESPONSE, status: 200 };
  }

  return {
    body: MediaReactionsSummaryResponseSchema.parse(await response.json()),
    status: 200,
  };
};

export const mediaReactionsSummaryQuery = defineQuery({
  key: 'mediaReactionsSummary',
  invalidations: [
    InvalidateAction.MediaReact('movie'),
    InvalidateAction.MediaReact('show'),
  ],
  dependencies: (params) => [params.type, params.slug],
  request: mediaReactionsSummaryRequest,
  mapper: (response) => mapToMediaReactionSummary(response.body),
  schema: MediaReactionSummarySchema,
  ttl: time.minutes(5),
});
