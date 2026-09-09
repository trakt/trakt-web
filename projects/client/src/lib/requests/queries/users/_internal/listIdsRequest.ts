import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { ListIdSchema } from '$lib/requests/models/ListId.ts';

type ListIdsRequestParams = { path: string } & ApiParams;

export const listIdsRequest = async (
  { fetch, path }: ListIdsRequestParams,
) => {
  const response = await rawApiFetch({ fetch, path });

  return {
    body: response.ok ? ListIdSchema.array().parse(await response.json()) : [],
    status: response.status,
  };
};
