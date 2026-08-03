import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToSoundtrackTrack } from '../../_internal/mapToSoundtrackTrack.ts';
import { toMediaInfoPath } from '../../_internal/toMediaInfoPath.ts';
import { SOUNDTRACK_INFO } from '../../_internal/soundtrackInfo.ts';
import { SoundtrackResponseSchema } from '../../models/SoundtrackResponse.ts';
import { SoundtrackTrackSchema } from '../../models/SoundtrackTrack.ts';

type MovieSoundtrackParams = {
  slug: string;
  locale: AvailableLocale;
} & ApiParams;

const movieSoundtrackRequest = async (
  { fetch, slug, locale }: MovieSoundtrackParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: toMediaInfoPath({ type: 'movie', slug, locale, ...SOUNDTRACK_INFO }),
  });

  return {
    body: SoundtrackResponseSchema.parse(
      response.ok ? await response.json() : [],
    ),
    status: 200,
  };
};

export const movieSoundtrackQuery = defineQuery({
  key: 'movieSoundtrack',
  invalidations: [],
  dependencies: (params) => [params.slug, params.locale],
  request: movieSoundtrackRequest,
  mapper: (response) =>
    response.body
      .map((entry) => mapToSoundtrackTrack('movie_soundtrack', entry))
      .sort((a, b) => a.position - b.position),
  schema: SoundtrackTrackSchema.array(),
  ttl: time.hours(12),
});
