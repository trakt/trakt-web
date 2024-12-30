import type { ShowTranslationResponse } from '$lib/api.ts';
import type {
  AvailableLanguage,
  AvailableRegion,
} from '$lib/features/i18n/index.ts';
import type { MediaIntl } from '$lib/models/MediaIntl.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type ShowIntlParams = {
  slug: string;
  language: AvailableLanguage;
  region: AvailableRegion;
} & ApiParams;

export function mapResponseToShowIntl(
  translation: ShowTranslationResponse[0],
): MediaIntl {
  return {
    ...translation,
  };
}

export function showIntlRequest(
  { fetch, slug, language, region }: ShowIntlParams,
): Promise<MediaIntl | Nil> {
  return api({ fetch })
    .shows
    .translations({
      params: {
        id: slug,
        language,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch show intl');
      }

      const translation = body.find((translation) =>
        translation.language === language &&
        translation.country === region
      );

      return translation
        ? mapResponseToShowIntl(
          translation,
        )
        : undefined;
    });
}

export const showIntlQueryKey = (params: ShowIntlParams) =>
  ['showIntl', params.slug, params.language, params.region] as const;
export const showIntlQuery = (
  params: ShowIntlParams,
) => ({
  queryKey: showIntlQueryKey(params),
  queryFn: () => showIntlRequest(params),
});
