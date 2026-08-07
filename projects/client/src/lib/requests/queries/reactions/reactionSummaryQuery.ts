import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { ReactionSentimentSchema } from '$lib/requests/models/ReactionSentiment.ts';
import type { ReactionSummary } from '$lib/requests/models/ReactionSummary.ts';
import { ReactionSummarySchema } from '$lib/requests/models/ReactionSummary.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

// Raw v3 payload — kept separate from the domain model so the mapper owns the
// translation. This query is the clean plug-in point for the V0 mock hooks.
const ReactionSummaryResponseSchema = z.object({
  total: z.number(),
  metrics: z.array(
    z.object({
      sentiment: ReactionSentimentSchema,
      count: z.number(),
      reacted: z.boolean().nullish(),
    }),
  ),
});

type ReactionSummaryResponse = z.infer<typeof ReactionSummaryResponseSchema>;

type ReactionSummaryParams =
  & {
    type: MediaType;
    slug: string;
  }
  & ApiParams;

const reactionSummaryRequest = async (
  { fetch, type, slug }: ReactionSummaryParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/reactions/${type}/${slug}`,
  });

  return response.ok
    ? {
      body: ReactionSummaryResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

function mapToReactionSummary(
  response: ReactionSummaryResponse | undefined,
): ReactionSummary {
  if (response == null) {
    return { totalCount: 0, metrics: [] };
  }

  return {
    totalCount: response.total,
    metrics: response.metrics.map((metric) => ({
      sentiment: metric.sentiment,
      count: metric.count,
      hasReacted: metric.reacted ?? false,
    })),
  };
}

export const reactionSummaryQuery = defineQuery({
  key: 'reactionSummary',
  invalidations: [],
  dependencies: (params) => [params.type, params.slug],
  request: reactionSummaryRequest,
  mapper: (response) => mapToReactionSummary(response.body),
  schema: ReactionSummarySchema,
  enabled: (params) => Boolean(params.slug),
  ttl: time.minutes(15),
});
