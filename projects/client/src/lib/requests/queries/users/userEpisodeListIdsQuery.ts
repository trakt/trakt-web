import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { ListIdSchema } from '$lib/requests/models/ListId.ts';
import { time } from '$lib/utils/timing/time.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { listIdsRequest } from './_internal/listIdsRequest.ts';

type UserEpisodeListIdsParams = { id: number } & ApiParams;

const userEpisodeListIdsRequest = (
  { fetch, id }: UserEpisodeListIdsParams,
) => listIdsRequest({ fetch, path: `/v3/episodes/${id}/me/lists` });

export const userEpisodeListIdsQuery = defineQuery({
  key: 'userEpisodeListIds',
  invalidations: [
    InvalidateAction.Listed('episode'),
  ],
  dependencies: (params) => [params.id],
  request: userEpisodeListIdsRequest,
  mapper: (response) => response.body,
  schema: ListIdSchema.array(),
  ttl: time.hours(3),
});
