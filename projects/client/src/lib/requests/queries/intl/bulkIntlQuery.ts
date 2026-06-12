import type {
  AvailableLanguage,
  AvailableRegion,
} from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { mapToBulkIntl } from '$lib/requests/_internal/mapToBulkIntl.ts';
import {
  BulkIntlResponseSchema,
  BulkIntlSchema,
} from '$lib/requests/models/BulkIntl.ts';
import { time } from '$lib/utils/timing/time.ts';

export const BULK_INTL_ID_CAP = 100;

type BulkIntlParams = {
  language: AvailableLanguage;
  region: AvailableRegion;
  movieIds: ReadonlyArray<number>;
  showIds: ReadonlyArray<number>;
  episodeIds: ReadonlyArray<number>;
  enabled: boolean;
} & ApiParams;

function toCsv(ids: ReadonlyArray<number>): string {
  return ids.join(',');
}

const bulkIntlRequest = async (
  { fetch, language, region, movieIds, showIds, episodeIds }: BulkIntlParams,
) => {
  const params = new URLSearchParams({ language, country: region });

  if (movieIds.length > 0) params.set('m', toCsv(movieIds));
  if (showIds.length > 0) params.set('s', toCsv(showIds));
  if (episodeIds.length > 0) params.set('e', toCsv(episodeIds));

  const response = await rawApiFetch({
    fetch,
    path: `/v3/intl/bulk?${params.toString()}`,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch bulk intl: ${response.status} ${response.statusText}`,
    );
  }

  return {
    body: BulkIntlResponseSchema.parse(await response.json()),
    status: 200,
  };
};

export const bulkIntlQuery = defineQuery({
  key: 'bulkIntl',
  invalidations: [],
  dependencies: (params) => [
    params.language,
    params.region,
    params.movieIds.join(','),
    params.showIds.join(','),
    params.episodeIds.join(','),
  ],
  request: bulkIntlRequest,
  mapper: (response) => mapToBulkIntl(response.body),
  schema: BulkIntlSchema,
  ttl: time.hours(12),
  enabled: (params) =>
    params.enabled &&
    (params.movieIds.length > 0 ||
      params.showIds.length > 0 ||
      params.episodeIds.length > 0),
});
