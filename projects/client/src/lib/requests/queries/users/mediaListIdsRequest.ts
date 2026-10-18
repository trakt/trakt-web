import type { ApiParams } from '$lib/requests/api.ts';
import type { ListId } from '$lib/requests/models/ListId.ts';
import { listIdsRequest } from './_internal/listIdsRequest.ts';

type MediaListIdsParams = {
  type: 'movie' | 'show';
  slug: string;
} & ApiParams;

export async function mediaListIdsRequest({
  fetch,
  type,
  slug,
}: MediaListIdsParams): Promise<ListId[]> {
  const { body } = await listIdsRequest({
    fetch,
    path: `/v3/${type}s/${slug}/me/lists`,
  });
  return body;
}
