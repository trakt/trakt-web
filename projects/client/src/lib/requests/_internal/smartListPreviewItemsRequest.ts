import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { SmartListItemResponseSchema } from '$lib/requests/models/SmartListItemResponse.ts';
import type { SmartListMediaType } from '$lib/requests/models/SmartListMediaType.ts';
import type { SmartListSource } from '$lib/requests/models/SmartListSource.ts';
import { buildParamString } from '$lib/utils/url/buildParamString.ts';

type SmartListPreviewItemsParams =
  & {
    source: SmartListSource;
    mediaType: SmartListMediaType;
    filters: Record<string, string>;
    extended: string;
    page?: number;
    limit?: number;
  }
  & ApiParams;

export async function smartListPreviewItemsRequest(
  { fetch, source, mediaType, filters, extended, page, limit }:
    SmartListPreviewItemsParams,
) {
  const response = await rawApiFetch({
    fetch,
    path: `/smart-lists/preview/items${
      buildParamString({
        ...filters,
        source,
        media_type: mediaType,
        extended,
        page,
        limit,
      })
    }`,
  });

  if (!response.ok) {
    throw new Error(`Smart list preview failed (${response.status})`);
  }

  return {
    body: SmartListItemResponseSchema.array().parse(await response.json()),
    headers: response.headers,
    status: 200 as const,
  };
}
