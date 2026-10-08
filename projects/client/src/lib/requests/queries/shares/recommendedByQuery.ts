import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import {
  type RecommendedBy,
  RecommendedBySchema,
} from '$lib/requests/models/RecommendedBy.ts';
import { SocialUserResponseSchema } from '$lib/requests/models/SocialUserResponse.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { ProfileResponse } from '@trakt/api';
import { z } from 'zod';

type RecommendedByParams = { url: string } & ApiParams;

const RecommendedByResponseSchema = z.object({
  users: z.array(SocialUserResponseSchema),
  other_count: z.number(),
});

type RecommendedByResponse = z.infer<typeof RecommendedByResponseSchema>;
export type RecommendedByResponseInput = z.input<
  typeof RecommendedByResponseSchema
>;

function mapToRecommendedBy(response: RecommendedByResponse): RecommendedBy {
  return {
    users: response.users.map((user) =>
      mapToUserProfile(user as ProfileResponse)
    ),
    otherCount: response.other_count,
  };
}

const recommendedByRequest = async (
  { fetch, url }: RecommendedByParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/shares/recommended?${new URLSearchParams({ url })}`,
  });

  return response.ok
    ? {
      body: RecommendedByResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const recommendedByQuery = defineQuery({
  key: 'recommendedBy',
  invalidations: [InvalidateAction.Share.Click, InvalidateAction.Share.Mute],
  dependencies: (params: RecommendedByParams) => [params.url],
  request: recommendedByRequest,
  mapper: (response) =>
    response.body ? mapToRecommendedBy(response.body) : null,
  schema: RecommendedBySchema.nullish(),
  ttl: time.minutes(5),
});
