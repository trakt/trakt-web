import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { mapToRecommendationPeopleReason } from '../../_internal/mapToRecommendationPeopleReason.ts';
import { mapToRecommendationSource } from '../../_internal/mapToRecommendationSource.ts';
import { RecommendationPeopleReasonSchema } from '../../models/RecommendationPeopleReason.ts';
import { RecommendationSourceSchema } from '../../models/RecommendationSource.ts';
import {
  PeopleReasonSchema,
  SourceSchema,
} from '../../models/RecommendationsResponse.ts';

type RecommendationReasonsParams = {
  type: 'movie' | 'show';
  id: number;
} & ApiParams;

const RecommendationReasonsResponseSchema = z.object({
  sources: z.array(SourceSchema),
  people: z.array(PeopleReasonSchema),
});

const RecommendationReasonsSchema = z.object({
  sources: z.array(RecommendationSourceSchema),
  people: z.array(RecommendationPeopleReasonSchema),
});

const recommendationReasonsRequest = async ({
  fetch,
  type,
  id,
}: RecommendationReasonsParams) => {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/recommendations/${type}/${id}/reasons`,
  });

  return response.ok
    ? {
        body: RecommendationReasonsResponseSchema.parse(await response.json()),
        status: 200,
      }
    : { body: { sources: [], people: [] }, status: 200 };
};

export const recommendationReasonsQuery = defineQuery({
  key: 'recommendationReasons',
  invalidations: [
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Rated('movie'),
    InvalidateAction.Rated('show'),
    InvalidateAction.Favorited('movie'),
    InvalidateAction.Favorited('show'),
  ],
  dependencies: (params) => [params.type, params.id],
  request: recommendationReasonsRequest,
  mapper: (response) => ({
    sources: response.body.sources.map(mapToRecommendationSource),
    people: response.body.people.map(mapToRecommendationPeopleReason),
  }),
  schema: RecommendationReasonsSchema,
  ttl: time.hours(1),
});
