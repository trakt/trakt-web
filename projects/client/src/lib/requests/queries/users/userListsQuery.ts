import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { InvalidateAction } from '../../models/InvalidateAction.ts';

type UserListsParams = ApiParams;

const UserListSchema = z.object({
  id: z.number(),
  name: z.string(),
  count: z.number(),
  ownerId: z.number(),
});

export type UserList = z.infer<typeof UserListSchema>;

const UserListsResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  count: z.number(),
  type: z.string(),
  display_order: z.number(),
  owner_id: z.number(),
});

type UserListsResponse = z.infer<typeof UserListsResponseSchema>;

const mapToUserList = (
  response: UserListsResponse,
): UserList => {
  return {
    id: response.id,
    name: response.name,
    count: response.count,
    ownerId: response.owner_id,
  };
};

const userListsRequest = async (
  { fetch }: UserListsParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: '/v3/users/me/lists' },
  );

  const body = response.ok ? await response.json() : [];

  return {
    body: body as UserListsResponse[],
    status: response.status,
  };
};

export const userListsQuery = defineQuery({
  key: 'userLists',
  invalidations: [
    InvalidateAction.List.Edited,
    InvalidateAction.List.Deleted,
    InvalidateAction.List.Created,
    InvalidateAction.Listed('movie'),
    InvalidateAction.Listed('show'),
  ],
  dependencies: () => [],
  request: userListsRequest,
  mapper: (response) => response.body.map(mapToUserList),
  schema: UserListSchema.array(),
  ttl: time.days(1),
});
