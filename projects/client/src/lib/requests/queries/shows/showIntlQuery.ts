import type {
  AvailableLanguage,
  AvailableRegion,
} from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { ShowTranslationResponse } from '@trakt/api';
import { type MediaIntl, MediaIntlSchema } from '../../models/MediaIntl.ts';

type ShowIntlParams = {
  slug: string;
  language: AvailableLanguage;
  region: AvailableRegion;
} & ApiParams;

function mapShowIntlResponse(
  translation?: ShowTranslationResponse[0],
): MediaIntl | undefined {
  if (!translation) {
    return undefined;
  }

  return {
    ...translation,
  };
}

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
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch show intl');
      }

      return response.body;
    });

export const showIntlQuery = defineQuery({
  key: 'showIntl',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
    params.language,
    params.region,
  ],
  request: showIntlRequest,
  mapper: (body, { language, region }) =>
    body
      .filter((translation) =>
        translation.language === language &&
        translation.country === region
      )
      .map(mapShowIntlResponse)
      .at(0),
  schema: MediaIntlSchema.optional(),
  ttl: time.days(7),
});
