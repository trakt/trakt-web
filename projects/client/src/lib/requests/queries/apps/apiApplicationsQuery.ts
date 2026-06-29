import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { ApiApplicationSchema } from '$lib/requests/models/ApiApplication.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  type ApiApplicationResponse,
  ApiApplicationResponseSchema,
} from './_internal/ApiApplicationResponse.ts';
import { mapToApiApplication } from './_internal/mapToApiApplication.ts';

type ApiApplicationsParams = ApiParams;

const apiApplicationsRequest = async (
  { fetch }: ApiApplicationsParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: '/v3/users/me/applications' },
  );

  const body = response.ok
    ? ApiApplicationResponseSchema.array().parse(await response.json())
    : [];

  return {
    body: body as ApiApplicationResponse[],
    status: response.status,
  };
};

export const apiApplicationsQuery = defineQuery({
  key: 'apiApplications',
  invalidations: [],
  dependencies: () => [],
  request: apiApplicationsRequest,
  mapper: (response) => response.body.map(mapToApiApplication),
  schema: ApiApplicationSchema.array(),
  ttl: time.minutes(15),
});
