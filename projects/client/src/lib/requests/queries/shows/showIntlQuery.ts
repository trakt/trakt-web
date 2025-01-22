import type { ShowTranslationResponse } from '$lib/api.ts';
import type {
  AvailableLanguage,
  AvailableRegion,
} from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
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

export const showIntlQuery = await defineQuery({
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
});
