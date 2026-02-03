import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import type { AvailableLanguage } from '../../../features/i18n/index.ts';
import { mapToMediaIntl } from '../../_internal/mapToMediaIntl.ts';
import { MediaIntlSchema } from '../../models/MediaIntl.ts';

type MovieIntlParams = {
  slug: string;
  language: AvailableLanguage;
  enabled: boolean;
} & ApiParams;

const movieIntlRequest = (
  { fetch, slug, language }: MovieIntlParams,
) =>
  api({ fetch })
    .movies
    .translations({
      params: {
        id: slug,
        language,
      },
    });

export const movieIntlQuery = defineQuery({
  key: 'movieIntl',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
    params.language,
  ],
  request: movieIntlRequest,
  mapper: (response) => response.body.map(mapToMediaIntl),
  schema: z.array(MediaIntlSchema),
  ttl: time.days(1),
  enabled: (params) => params.enabled,
});
