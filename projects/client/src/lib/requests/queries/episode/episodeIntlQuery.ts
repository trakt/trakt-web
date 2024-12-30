import type { EpisodeTranslationResponse } from '$lib/api.ts';
import type {
  AvailableLanguage,
  AvailableRegion,
} from '$lib/features/i18n/index.ts';
import type { EpisodeIntl } from '$lib/models/EpisodeIntl.ts';
import type { MediaIntl } from '$lib/models/MediaIntl.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type EpisodeIntlParams = {
  slug: string;
  season: number;
  episode: number;
  language: AvailableLanguage;
  region: AvailableRegion;
} & ApiParams;

export function mapResponseToEpisodeIntl(
  translation: EpisodeTranslationResponse[0],
): MediaIntl {
  return {
    ...translation,
    tagline: '',
  };
}

export function episodeIntlRequest(
  { fetch, slug, language, region, season, episode }: EpisodeIntlParams,
): Promise<EpisodeIntl | Nil> {
  return api({ fetch })
    .shows
    .episode
    .translations({
      params: {
        id: slug,
        season,
        episode,
        language,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch episode intl');
      }

      const translation = body.find((translation) =>
        translation.language === language &&
        translation.country === region
      );

      return translation
        ? mapResponseToEpisodeIntl(
          translation,
        )
        : undefined;
    });
}

export const episodeIntlQueryKey = (params: EpisodeIntlParams) =>
  [
    'episodeIntl',
    params.slug,
    params.season,
    params.episode,
    params.language,
    params.region,
  ] as const;
export const episodeIntlQuery = (
  params: EpisodeIntlParams,
) => ({
  queryKey: episodeIntlQueryKey(params),
  queryFn: () => episodeIntlRequest(params),
});
