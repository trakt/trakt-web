import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { documentaryCheckRequest } from '../../_internal/documentaryCheckRequest.ts';
import { mapToDocumentaryCheck } from '../../_internal/mapToDocumentaryCheck.ts';
import { DocumentaryCheckSchema } from '../../models/DocumentaryCheck.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';

type MovieDocumentaryCheckParams = {
  slug: string;
  locale: AvailableLocale;
  enabled: boolean;
} & ApiParams;

const movieDocumentaryCheckRequest = ({
  fetch,
  slug,
  locale,
}: MovieDocumentaryCheckParams) =>
  documentaryCheckRequest({ fetch, type: 'movie', slug, locale });

export const movieDocumentaryCheckQuery = defineQuery({
  key: 'movieDocumentaryCheck:v1',
  invalidations: [InvalidateAction.Vip.Updated],
  dependencies: (params) => [params.slug, params.locale],
  request: movieDocumentaryCheckRequest,
  mapper: (response) => mapToDocumentaryCheck(response.body),
  schema: DocumentaryCheckSchema.nullish(),
  ttl: time.hours(3),
  enabled: (params) => params.enabled,
});
