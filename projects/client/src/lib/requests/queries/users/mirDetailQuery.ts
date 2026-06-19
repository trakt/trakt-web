import { defineQuery } from '$lib/features/query/defineQuery.ts';
import {
  mapToYirDetail,
  type RawYirResponse,
} from '$lib/requests/_internal/mapToYirDetail.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { YirDetailSchema } from '../../models/YirDetail.ts';

export type MirDetailParams = {
  slug: string;
  year: number;
  month: number;
} & ApiParams;

const mirDetailRequest = (
  { fetch, slug, year, month }: MirDetailParams,
) =>
  api({ fetch })
    .users
    .month_in_review({
      params: { id: slug, year, month },
      query: { extended: 'images' },
    });

export const mirDetailQuery = defineQuery({
  key: 'mirDetail',
  invalidations: [],
  dependencies: (params) => [params.slug, params.year, params.month],
  request: mirDetailRequest,
  // The @trakt/api contract types month_in_review's body to a narrow subset,
  // but the ts-rest client does not strip response fields - the full rich
  // payload (most_watched, genres, distributions, ...) is present at runtime,
  // so we reuse the YIR mapper by casting to its raw input shape.
  mapper: (response) =>
    response.body
      ? mapToYirDetail(response.body as unknown as RawYirResponse)
      : null,
  schema: YirDetailSchema.nullable(),
  ttl: time.hours(1),
});
