import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToYirDetail } from '../../_internal/mapToYirDetail.ts';
import { YirDetailSchema } from '../../models/YirDetail.ts';

export type YirDetailParams = {
  slug: string;
  year: number;
} & ApiParams;

const yirDetailRequest = async (
  { fetch, slug, year }: YirDetailParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `/users/${slug}/yir/${year}?extended=images`,
  });

  return response.ok
    ? { body: await response.json(), status: 200 }
    : { body: null, status: response.status };
};

export const yirDetailQuery = defineQuery({
  key: 'yirDetail',
  invalidations: [],
  dependencies: (params) => [params.slug, params.year],
  request: yirDetailRequest,
  mapper: (response) => response.body ? mapToYirDetail(response.body) : null,
  schema: YirDetailSchema.nullable(),
  ttl: time.hours(1),
});
