import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { documentaryCheckRequest } from '../../_internal/documentaryCheckRequest.ts';
import { mapToDocumentaryCheck } from '../../_internal/mapToDocumentaryCheck.ts';
import { DocumentaryCheckSchema } from '../../models/DocumentaryCheck.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';

type ShowDocumentaryCheckParams = {
  slug: string;
  locale: AvailableLocale;
  enabled: boolean;
} & ApiParams;

const showDocumentaryCheckRequest = ({
  fetch,
  slug,
  locale,
}: ShowDocumentaryCheckParams) =>
  documentaryCheckRequest({ fetch, type: 'show', slug, locale });

export const showDocumentaryCheckQuery = defineQuery({
  key: 'showDocumentaryCheck:v1',
  invalidations: [InvalidateAction.Vip.Updated],
  dependencies: (params) => [params.slug, params.locale],
  request: showDocumentaryCheckRequest,
  mapper: (response) => mapToDocumentaryCheck(response.body),
  schema: DocumentaryCheckSchema.nullish(),
  ttl: time.hours(3),
  enabled: (params) => params.enabled,
});
