import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import {
  type MediaParentalGuide,
  MediaParentalGuideSchema,
} from '$lib/requests/models/MediaParentalGuide.ts';
import { time } from '$lib/utils/timing/time.ts';

type MediaParentalGuideParams = {
  imdbId?: string | null;
} & ApiParams;

const mediaParentalGuideRequest = async (
  { fetch, imdbId }: MediaParentalGuideParams,
) => {
  if (!imdbId) {
    return {
      body: undefined,
      status: 204,
    };
  }

  const response = await rawApiFetch({
    fetch,
    path: `/v3/media/imdb/${encodeURIComponent(imdbId)}/parental-guide`,
  });

  if (response.status === 204) {
    return {
      body: undefined,
      status: 204,
    };
  }

  if (!response.ok) {
    return {
      body: undefined,
      status: response.status,
    };
  }

  return {
    body: MediaParentalGuideSchema.parse(await response.json()),
    status: 200,
  };
};

export const mediaParentalGuideQuery = defineQuery({
  key: 'mediaParentalGuide',
  invalidations: [],
  dependencies: (params) => [params.imdbId ?? ''],
  request: mediaParentalGuideRequest,
  mapper: (response): MediaParentalGuide | null => response.body ?? null,
  schema: MediaParentalGuideSchema.nullish(),
  ttl: time.hours(3),
  enabled: (params) => Boolean(params.imdbId),
});
