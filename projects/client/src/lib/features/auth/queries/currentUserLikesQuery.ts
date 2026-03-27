import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { z } from 'zod';
import { time } from '../../../utils/timing/time.ts';

const UserLikesSchema = z.object({
  lists: z.map(
    z.number(),
    z.object({
      id: z.number(),
    }),
  ),
});

export type UserLikes = z.infer<typeof UserLikesSchema>;

const currentUserListLikesRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .likes
    .lists({
      query: {
        limit: 'all',
        extended: 'min',
      },
    });

export const currentUserLikesQuery = defineQuery({
  key: 'currentUserLikes',
  request: currentUserListLikesRequest,
  invalidations: [InvalidateAction.List.Like],
  dependencies: [],
  mapper: (response) => ({
    lists: toMap(
      response.body,
      (entry) => ({
        id: assertDefined(
          'id' in entry.list ? entry.list.id : undefined,
          'List id is missing in likes response.',
        ),
      }),
      (mapped) => mapped.id,
    ),
  }),
  schema: UserLikesSchema,
  ttl: time.hours(12),
});
