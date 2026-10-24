import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToRealityCheck } from '../../_internal/mapToRealityCheck.ts';
import { realityCheckRequest } from '../../_internal/realityCheckRequest.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { RealityCheckSchema } from '../../models/RealityCheck.ts';

type ShowRealityCheckParams = {
  slug: string;
  locale: AvailableLocale;
  enabled: boolean;
} & ApiParams;

const showRealityCheckRequest = ({
  fetch,
  slug,
  locale,
}: ShowRealityCheckParams) =>
  realityCheckRequest({ fetch, type: 'show', slug, locale });

export const showRealityCheckQuery = defineQuery({
  key: 'showRealityCheck:v1',
  invalidations: [InvalidateAction.Vip.Updated],
  dependencies: (params) => [params.slug, params.locale],
  request: showRealityCheckRequest,
  mapper: (response) => mapToRealityCheck(response.body),
  schema: RealityCheckSchema.nullish(),
  ttl: time.hours(3),
  enabled: (params) => params.enabled,
});
