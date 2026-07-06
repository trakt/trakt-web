import { defineQuery } from '$lib/features/query/defineQuery.ts';
import {
  mapToYirDetail,
  type RawYirResponse,
} from '$lib/requests/_internal/mapToYirDetail.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { fetchReviewResource } from '../../_internal/fetchReviewResource.ts';
import { YirDetailSchema } from '../../models/YirDetail.ts';

export type MirDetailParams = {
  slug: string;
  year: number;
  month: number;
  slurm?: string;
} & ApiParams;

// MIR shares the YIR data shape. It uses rawApiFetch (not the typed SDK) so the
// optional WebView `slurm` token can ride the query string; the endpoint
// returns the same rich payload the YIR mapper consumes.
const mirDetailRequest = async (
  { fetch, slug, year, month, slurm }: MirDetailParams,
) => {
  const response = await fetchReviewResource({
    fetch,
    path: `/users/${slug}/mir/${year}/${month}`,
    slurm,
  });

  return response.ok
    ? { body: await response.json() as RawYirResponse, status: 200 }
    : { body: null, status: response.status };
};

export const mirDetailQuery = defineQuery({
  key: 'mirDetail',
  invalidations: [],
  dependencies: (
    params,
  ) => [params.slug, params.year, params.month, params.slurm],
  request: mirDetailRequest,
  mapper: (response) => response.body ? mapToYirDetail(response.body) : null,
  schema: YirDetailSchema.nullable(),
  ttl: time.hours(1),
});
