import type { MovieTranslationResponse } from '$lib/api.ts';
import type {
  AvailableLanguage,
  AvailableRegion,
} from '$lib/features/i18n/index.ts';
import type { MediaIntl } from '$lib/models/MediaIntl.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type MovieIntlParams = {
  slug: string;
  language: AvailableLanguage;
  region: AvailableRegion;
} & ApiParams;

export function mapResponseToMovieIntl(
  translation: MovieTranslationResponse[0],
): MediaIntl {
  return {
    ...translation,
  };
}

export function movieIntlRequest(
  { fetch, slug, language, region }: MovieIntlParams,
): Promise<MediaIntl | Nil> {
  return api({ fetch })
    .movies
    .translations({
      params: {
        id: slug,
        language,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch movie intl');
      }

      const translation = body.find((translation) =>
        translation.language === language &&
        translation.country === region
      );

      return translation
        ? mapResponseToMovieIntl(
          translation,
        )
        : undefined;
    });
}

export const movieIntlQueryKey = (params: MovieIntlParams) =>
  ['movieIntl', params.slug, params.language, params.region] as const;
export const movieIntlQuery = (
  params: MovieIntlParams,
) => ({
  queryKey: movieIntlQueryKey(params),
  queryFn: () => movieIntlRequest(params),
});
