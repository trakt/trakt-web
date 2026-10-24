import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { MediaType } from '../models/MediaType.ts';
import { RealityCheckResponseSchema } from '../models/RealityCheckResponse.ts';
import { toMediaInfoPath } from './toMediaInfoPath.ts';

const REALITY_CHECK_INFO_TYPE = 34;

type RealityCheckRequestParams = {
  type: MediaType;
  slug: string;
  locale: AvailableLocale;
} & ApiParams;

export async function realityCheckRequest({
  fetch,
  type,
  slug,
  locale,
}: RealityCheckRequestParams) {
  const response = await rawApiFetch({
    fetch,
    path: toMediaInfoPath({
      type,
      slug,
      infoType: REALITY_CHECK_INFO_TYPE,
      infoVersion: 1,
      locale,
    }),
  });

  if (response.status === 204 || response.status === 404) {
    return { body: undefined, status: 204 };
  }

  if (!response.ok) {
    return { body: undefined, status: response.status };
  }

  return {
    body: RealityCheckResponseSchema.parse(await response.json()),
    status: 200,
  };
}
