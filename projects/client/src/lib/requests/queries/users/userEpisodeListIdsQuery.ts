import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import {
  type ListIdResponse,
  ListIdSchema,
  mapToListId,
} from './userMovieListIdsQuery.ts';

type UserEpisodeListIdsParams = { id: number } & ApiParams;

const userEpisodeListIdsRequest = async (
  { fetch, id }: UserEpisodeListIdsParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: `/v3/episodes/${id}/me/lists` },
  );

  const body = response.ok ? await response.json() : [];

  return {
    body: body as ListIdResponse[],
    status: response.status,
  };
};

export const userEpisodeListIdsQuery = defineQuery({
  key: 'userEpisodeListIds',
  invalidations: [
    InvalidateAction.Listed('episode'),
  ],
  dependencies: (params) => [params.id],
  request: userEpisodeListIdsRequest,
  mapper: (response) => response.body.map(mapToListId),
  schema: ListIdSchema.array(),
  ttl: time.hours(3),
});
