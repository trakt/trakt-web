import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { InvalidateAction } from '../../models/InvalidateAction.ts';

type UserMovieListIdsParams = { slug: string } & ApiParams;

export const ListIdSchema = z.number();
export type ListId = z.infer<typeof ListIdSchema>;

const ListIdResponseSchema = z.number();
export type ListIdResponse = z.infer<typeof ListIdResponseSchema>;

export const mapToListId = (response: ListIdResponse): ListId => response;

const userMovieListIdsRequest = async (
  { fetch, slug }: UserMovieListIdsParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: `/v3/movies/${slug}/me/lists` },
  );

  const body = response.ok ? await response.json() : [];

  return {
    body: body as ListIdResponse[],
    status: response.status,
  };
};

export const userMovieListIdsQuery = defineQuery({
  key: 'userMovieListIds',
  invalidations: [
    InvalidateAction.Listed('movie'),
  ],
  dependencies: () => [],
  request: userMovieListIdsRequest,
  mapper: (response) => response.body.map(mapToListId),
  schema: ListIdSchema.array(),
  ttl: time.hours(3),
});
