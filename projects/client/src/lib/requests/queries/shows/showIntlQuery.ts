import type { AvailableLanguage } from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { mapToMediaIntl } from '../../_internal/mapToMediaIntl.ts';
import { MediaIntlSchema } from '../../models/MediaIntl.ts';

type ShowIntlParams = {
  slug: string;
  language: AvailableLanguage;
  enabled: boolean;
} & ApiParams;

const showIntlRequest = (
  { fetch, slug, language }: ShowIntlParams,
) =>
  api({ fetch })
    .shows
    .translations({
      params: {
        id: slug,
        language,
      },
    });

export const showIntlQuery = defineQuery({
  key: 'showIntl',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
    params.language,
  ],
  request: showIntlRequest,
  mapper: (response) => response.body.map(mapToMediaIntl),
  schema: z.array(MediaIntlSchema),
  ttl: time.days(7),
  enabled: (params) => params.enabled,
});
