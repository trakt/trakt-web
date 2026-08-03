import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToSoundtrackTrack } from '../../_internal/mapToSoundtrackTrack.ts';
import { toMediaInfoPath } from '../../_internal/toMediaInfoPath.ts';
import { SOUNDTRACK_INFO } from '../../_internal/soundtrackInfo.ts';
import { SoundtrackResponseSchema } from '../../models/SoundtrackResponse.ts';
import { SoundtrackTrackSchema } from '../../models/SoundtrackTrack.ts';

type ShowSoundtrackParams = {
  slug: string;
  locale: AvailableLocale;
} & ApiParams;

const showSoundtrackRequest = async (
  { fetch, slug, locale }: ShowSoundtrackParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: toMediaInfoPath({ type: 'show', slug, locale, ...SOUNDTRACK_INFO }),
  });

  return {
    body: SoundtrackResponseSchema.parse(
      response.ok ? await response.json() : [],
    ),
    status: 200,
  };
};

export const showSoundtrackQuery = defineQuery({
  key: 'showSoundtrack',
  invalidations: [],
  dependencies: (params) => [params.slug, params.locale],
  request: showSoundtrackRequest,
  mapper: (response) =>
    response.body
      .map((entry) => mapToSoundtrackTrack('show_soundtrack', entry))
      .sort((a, b) => a.position - b.position),
  schema: SoundtrackTrackSchema.array(),
  ttl: time.hours(12),
});
