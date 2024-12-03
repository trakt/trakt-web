import type { MovieTranslationResponse } from '$lib/api.ts';
import type { MediaIntl } from '$lib/models/MediaIntl.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type MovieIntlParams = { slug: string; locale: string } & ApiParams;

export function mapResponseToMovieIntl(
  translation: MovieTranslationResponse[0],
): MediaIntl {
  return {
    ...translation,
  };
}

export function movieIntlRequest(
  { fetch, slug, locale }: MovieIntlParams,
): Promise<MediaIntl | Nil> {
  const parts = locale.toLowerCase().split('-');

  const language = assertDefined(parts.at(0), 'Language code is required.');
  const country = assertDefined(parts.at(1), 'Country code is required.');

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
        throw new Error('Failed to fetch up next');
      }

      const translation = body.find((translation) =>
        translation.language === language &&
        translation.country === country
      );

      return translation
        ? mapResponseToMovieIntl(
          translation,
        )
        : undefined;
    });
}

export const movieIntlQueryKey = (id: string) => ['movieIntl', id] as const;
export const movieIntlQuery = (
  params: MovieIntlParams,
) => ({
  queryKey: movieIntlQueryKey(params.slug),
  queryFn: () => movieIntlRequest(params),
});
