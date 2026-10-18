import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { ListIdSchema } from '$lib/requests/models/ListId.ts';
import { time } from '$lib/utils/timing/time.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { listIdsRequest } from './_internal/listIdsRequest.ts';

type UserMovieListIdsParams = { slug: string } & ApiParams;

const userMovieListIdsRequest = ({ fetch, slug }: UserMovieListIdsParams) =>
  listIdsRequest({ fetch, path: `/v3/movies/${slug}/me/lists` });

export const userMovieListIdsQuery = defineQuery({
  key: 'userMovieListIds',
  invalidations: [InvalidateAction.Listed('movie')],
  dependencies: (params) => [params.slug],
  request: userMovieListIdsRequest,
  mapper: (response) => response.body,
  schema: ListIdSchema.array(),
  ttl: time.hours(3),
});
