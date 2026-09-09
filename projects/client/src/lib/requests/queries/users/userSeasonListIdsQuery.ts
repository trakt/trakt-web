import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { ListIdSchema } from '$lib/requests/models/ListId.ts';
import { time } from '$lib/utils/timing/time.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { listIdsRequest } from './_internal/listIdsRequest.ts';

type UserSeasonListIdsParams = { id: number } & ApiParams;

const userSeasonListIdsRequest = (
  { fetch, id }: UserSeasonListIdsParams,
) => listIdsRequest({ fetch, path: `/v3/seasons/${id}/me/lists` });

export const userSeasonListIdsQuery = defineQuery({
  key: 'userSeasonListIds',
  invalidations: [
    InvalidateAction.Listed('season'),
  ],
  dependencies: (params) => [params.id],
  request: userSeasonListIdsRequest,
  mapper: (response) => response.body,
  schema: ListIdSchema.array(),
  ttl: time.hours(3),
});
