import type { EpisodeTranslationResponse } from '$lib/api.ts';
import type {
  AvailableLanguage,
  AvailableRegion,
} from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import {
  type EpisodeIntl,
  EpisodeIntlSchema,
} from '../../models/EpisodeIntl.ts';

type EpisodeIntlParams = {
  slug: string;
  season: number;
  episode: number;
  language: AvailableLanguage;
  region: AvailableRegion;
} & ApiParams;

function mapEpisodeIntlResponse(
  translation?: EpisodeTranslationResponse[0],
): EpisodeIntl | undefined {
  if (!translation) {
    return undefined;
  }

  return {
    title: translation.title,
    overview: translation.overview,
  };
}

const episodeIntlRequest = (
  { fetch, slug, language, season, episode }: EpisodeIntlParams,
) =>
  api({ fetch })
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
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch episode intl');
      }

      return response.body;
    });

export const episodeIntlQuery = await defineQuery({
  key: 'episodeIntl',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
    params.season,
    params.episode,
    params.language,
    params.region,
  ],
  request: episodeIntlRequest,
  mapper: (body, { language, region }) =>
    body
      .filter((translation) =>
        translation.language === language &&
        translation.country === region
      )
      .map(mapEpisodeIntlResponse)
      .at(0),
  schema: EpisodeIntlSchema.optional(),
});
