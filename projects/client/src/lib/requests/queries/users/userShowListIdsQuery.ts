import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import {
  type ListIdResponse,
  ListIdSchema,
  mapToListId,
} from './userMovieListIdsQuery.ts';

type UserShowListIdsParams = { slug: string } & ApiParams;

const userShowListIdsRequest = async (
  { fetch, slug }: UserShowListIdsParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: `/v3/shows/${slug}/me/lists` },
  );

  const body = response.ok ? await response.json() : [];

  return {
    body: body as ListIdResponse[],
    status: response.status,
  };
};

export const userShowListIdsQuery = defineQuery({
  key: 'userShowListIds',
  invalidations: [
    InvalidateAction.Listed('show'),
  ],
  dependencies: () => [],
  request: userShowListIdsRequest,
  mapper: (response) => response.body.map(mapToListId),
  schema: ListIdSchema.array(),
  ttl: time.days(1),
});
