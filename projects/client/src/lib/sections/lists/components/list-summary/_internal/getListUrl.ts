import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

export function getListUrl(list: MediaListSummary, type?: MediaType) {
  if (list.user.slug) {
    return UrlBuilder.users(list.user.slug).lists(list.slug, type);
  }

  return UrlBuilder.lists.official(list.id, type);
}
