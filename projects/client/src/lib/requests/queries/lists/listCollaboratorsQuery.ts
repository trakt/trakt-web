import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { time } from '$lib/utils/timing/time.ts';
import { profileResponseSchema } from '@trakt/api';
import { z } from 'zod';

const CollaboratorsResponseSchema = z.array(profileResponseSchema);

type ListCollaboratorsParams = { listId: number } & ApiParams;

const listCollaboratorsRequest = async (
  { fetch, listId }: ListCollaboratorsParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `/lists/${listId}/collaborators`,
  });

  return response.ok
    ? {
      body: CollaboratorsResponseSchema.parse(await response.json()),
      status: 200 as const,
    }
    : { body: [], status: 200 as const };
};

export const listCollaboratorsQuery = defineQuery({
  key: 'listCollaborators',
  invalidations: [InvalidateAction.List.Collaborators],
  dependencies: (params: ListCollaboratorsParams) => [params.listId],
  request: listCollaboratorsRequest,
  mapper: (response) => response.body.map((user) => mapToUserProfile(user)),
  schema: z.array(UserProfileSchema),
  ttl: time.minutes(15),
});
