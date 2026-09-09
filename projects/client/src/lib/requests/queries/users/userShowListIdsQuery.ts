import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { ListIdSchema } from '$lib/requests/models/ListId.ts';
import { time } from '$lib/utils/timing/time.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { listIdsRequest } from './_internal/listIdsRequest.ts';

type UserShowListIdsParams = { slug: string } & ApiParams;

const userShowListIdsRequest = (
  { fetch, slug }: UserShowListIdsParams,
) => listIdsRequest({ fetch, path: `/v3/shows/${slug}/me/lists` });

export const userShowListIdsQuery = defineQuery({
  key: 'userShowListIds',
  invalidations: [
    InvalidateAction.Listed('show'),
  ],
  dependencies: (params) => [params.slug],
  request: userShowListIdsRequest,
  mapper: (response) => response.body,
  schema: ListIdSchema.array(),
  ttl: time.hours(3),
});
