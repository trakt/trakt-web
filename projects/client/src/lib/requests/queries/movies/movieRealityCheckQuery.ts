import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToRealityCheck } from '../../_internal/mapToRealityCheck.ts';
import { realityCheckRequest } from '../../_internal/realityCheckRequest.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { RealityCheckSchema } from '../../models/RealityCheck.ts';

type MovieRealityCheckParams = {
  slug: string;
  locale: AvailableLocale;
  enabled: boolean;
} & ApiParams;

const movieRealityCheckRequest = ({
  fetch,
  slug,
  locale,
}: MovieRealityCheckParams) =>
  realityCheckRequest({ fetch, type: 'movie', slug, locale });

export const movieRealityCheckQuery = defineQuery({
  key: 'movieRealityCheck:v1',
  invalidations: [InvalidateAction.Vip.Updated],
  dependencies: (params) => [params.slug, params.locale],
  request: movieRealityCheckRequest,
  mapper: (response) => mapToRealityCheck(response.body),
  schema: RealityCheckSchema.nullish(),
  ttl: time.hours(3),
  enabled: (params) => params.enabled,
});
