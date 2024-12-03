import type { ShowTranslationResponse } from '$lib/api.ts';
import type { MediaIntl } from '$lib/models/MediaIntl.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type ShowIntlParams = { slug: string; locale: string } & ApiParams;

export function mapResponseToShowIntl(
  translation: ShowTranslationResponse[0],
): MediaIntl {
  return {
    ...translation,
  };
}

export function showIntlRequest(
  { fetch, slug, locale }: ShowIntlParams,
): Promise<MediaIntl | Nil> {
  return api({ fetch })
    .shows
    .translations({
      params: {
        id: slug,
        language: locale,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up next');
      }

      const translation = body.find((translation) =>
        translation.language === locale
      );

      return translation
        ? mapResponseToShowIntl(
          translation,
        )
        : undefined;
    });
}

export const showIntlQueryKey = (id: string) => ['showIntl', id] as const;
export const showIntlQuery = (
  params: ShowIntlParams,
) => ({
  queryKey: showIntlQueryKey(params.slug),
  queryFn: () => showIntlRequest(params),
});
