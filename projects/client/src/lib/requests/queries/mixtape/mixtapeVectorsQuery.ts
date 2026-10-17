import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import {
  type MixtapeVectors,
  MixtapeVectorsSchema,
} from '$lib/requests/models/MixtapeVectors.ts';
import { time } from '$lib/utils/timing/time.ts';

type MixtapeVectorsParams = {
  type: MediaType;
  ids: ReadonlyArray<number>;
} & ApiParams;

const EMPTY_VECTORS: MixtapeVectors = { cutoff: 1, vectors: {} };

const mixtapeVectorsRequest = async (
  { fetch, type, ids }: MixtapeVectorsParams,
) => {
  const query = new URLSearchParams({ type, ids: ids.join(',') });
  const response = await rawApiFetch({
    fetch,
    path: `/v3/mixtape/vectors?${query}`,
    authenticated: false,
  });

  return response.ok
    ? {
      body: MixtapeVectorsSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const mixtapeVectorsQuery = defineQuery({
  key: 'mixtapeVectors',
  invalidations: [],
  dependencies: (params: MixtapeVectorsParams) => [
    params.type,
    params.ids.join(','),
  ],
  request: mixtapeVectorsRequest,
  mapper: (response): MixtapeVectors => response.body ?? EMPTY_VECTORS,
  schema: MixtapeVectorsSchema,
  ttl: time.hours(12),
  enabled: (params: MixtapeVectorsParams) => params.ids.length > 0,
});
