import type { AvailableLanguage } from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { EpisodeTranslationResponse } from '@trakt/api';
import z from 'zod';
import {
  type EpisodeIntl,
  EpisodeIntlSchema,
} from '../../models/EpisodeIntl.ts';

type EpisodeIntlParams = {
  slug: string;
  season: number;
  episode: number;
  language: AvailableLanguage;
  enabled: boolean;
} & ApiParams;

function mapEpisodeIntlResponse(
  translation: EpisodeTranslationResponse[0],
): EpisodeIntl {
  return {
    title: translation.title,
    overview: translation.overview,
    country: translation.country,
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
        season: castNumberAsString(season),
        episode,
        language,
      },
    });

export const episodeIntlQuery = defineQuery({
  key: 'episodeIntl',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
    params.season,
    params.episode,
    params.language,
  ],
  request: episodeIntlRequest,
  mapper: (response) => response.body.map(mapEpisodeIntlResponse),
  schema: z.array(EpisodeIntlSchema),
  ttl: time.days(1),
  enabled: (params) => params.enabled,
});
