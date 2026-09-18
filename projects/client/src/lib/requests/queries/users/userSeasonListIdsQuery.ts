import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import {
  type ListIdResponse,
  ListIdSchema,
  mapToListId,
} from './userMovieListIdsQuery.ts';

type UserSeasonListIdsParams = { id: number } & ApiParams;

const userSeasonListIdsRequest = async (
  { fetch, id }: UserSeasonListIdsParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: `/v3/seasons/${id}/me/lists` },
  );

  const body = response.ok ? await response.json() : [];

  return {
    body: body as ListIdResponse[],
    status: response.status,
  };
};

export const userSeasonListIdsQuery = defineQuery({
  key: 'userSeasonListIds',
  invalidations: [
    InvalidateAction.Listed('season'),
  ],
  dependencies: (params) => [params.id],
  request: userSeasonListIdsRequest,
  mapper: (response) => response.body.map(mapToListId),
  schema: ListIdSchema.array(),
  ttl: time.hours(3),
});
