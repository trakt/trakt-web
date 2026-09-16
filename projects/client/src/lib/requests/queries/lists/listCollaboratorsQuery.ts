import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

const CollaboratorResponseSchema = z.object({
  ids: z.object({ trakt: z.number(), slug: z.string().nullish() }),
  username: z.string(),
  name: z.string().nullish(),
  private: z.boolean(),
  vip: z.boolean().nullish(),
  vip_ep: z.boolean().nullish(),
  director: z.boolean().nullish(),
  deleted: z.boolean(),
  images: z.object({
    avatar: z.object({ full: z.string() }),
  }).nullish(),
  location: z.string().nullish(),
  about: z.string().nullish(),
  joined_at: z.string().nullish(),
  vip_cover_image: z.string().nullish(),
});

const CollaboratorsResponseSchema = z.array(CollaboratorResponseSchema);

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
