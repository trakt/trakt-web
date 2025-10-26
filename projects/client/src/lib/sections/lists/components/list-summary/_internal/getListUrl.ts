import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

export function getListUrl(list: MediaListSummary, mode?: DiscoverMode) {
  const type = mode === 'media' ? undefined : mode;

  if (list.user.slug) {
    return UrlBuilder.users(list.user.slug).lists(list.slug, type);
  }

  return UrlBuilder.lists.official(list.id, type);
}
