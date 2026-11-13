import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { DocumentaryCheckResponseSchema } from '../models/DocumentaryCheckResponse.ts';
import type { MediaType } from '../models/MediaType.ts';
import { toMediaInfoPath } from './toMediaInfoPath.ts';

const DOCUMENTARY_CHECK_INFO_TYPE = 66;

type DocumentaryCheckRequestParams = {
  type: MediaType;
  slug: string;
  locale: AvailableLocale;
} & ApiParams;

export async function documentaryCheckRequest({
  fetch,
  type,
  slug,
  locale,
}: DocumentaryCheckRequestParams) {
  const response = await rawApiFetch({
    fetch,
    path: toMediaInfoPath({
      type,
      slug,
      infoType: DOCUMENTARY_CHECK_INFO_TYPE,
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
    body: DocumentaryCheckResponseSchema.parse(await response.json()),
    status: 200,
  };
}
