import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import {
  type MediaParentalGuide,
  MediaParentalGuideSchema,
} from '$lib/requests/models/MediaParentalGuide.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { time } from '$lib/utils/timing/time.ts';
import { toMediaInfoPath } from '../../_internal/toMediaInfoPath.ts';

type MediaParentalGuideParams = {
  type: MediaType;
  slug: string;
  locale: AvailableLocale;
} & ApiParams;

const mediaParentalGuideRequest = async (
  { fetch, type, slug, locale }: MediaParentalGuideParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: toMediaInfoPath({ type, slug, infoType: 16, locale }),
  });

  // A missing guide 404s upstream; fold it into no-content so the query
  // resolves to null instead of throwing.
  if (response.status === 204 || response.status === 404) {
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
  dependencies: (params) => [params.type, params.slug, params.locale],
  request: mediaParentalGuideRequest,
  mapper: (response): MediaParentalGuide | null => response.body ?? null,
  schema: MediaParentalGuideSchema.nullish(),
  ttl: time.hours(3),
});
