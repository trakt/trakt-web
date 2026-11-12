import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { time } from '$lib/utils/timing/time.ts';
import { documentaryCheckRequest } from '../../_internal/documentaryCheckRequest.ts';
import { mapToDocumentaryCheck } from '../../_internal/mapToDocumentaryCheck.ts';
import { DocumentaryCheckSchema } from '../../models/DocumentaryCheck.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';

type MediaDocumentaryCheckParams = {
  type: MediaType;
  slug: string;
  locale: AvailableLocale;
  enabled: boolean;
} & ApiParams;

export const mediaDocumentaryCheckQuery = defineQuery({
  key: 'mediaDocumentaryCheck:v1',
  invalidations: [InvalidateAction.Vip.Updated],
  dependencies: (params) => [params.type, params.slug, params.locale],
  request: ({ fetch, type, slug, locale }: MediaDocumentaryCheckParams) =>
    documentaryCheckRequest({ fetch, type, slug, locale }),
  mapper: (response) => mapToDocumentaryCheck(response.body),
  schema: DocumentaryCheckSchema.nullish(),
  ttl: time.hours(3),
  enabled: (params) => params.enabled,
});
