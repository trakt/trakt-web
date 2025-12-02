import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { SortBy } from '../../../user/models/SortBy.ts';
import type { SortDirection } from '../../../user/models/SortDirection.ts';

type ListUrlProps = {
  mode?: DiscoverMode;
  sortBy?: SortBy;
  sortHow?: SortDirection;
};

export function getListUrl(list: MediaListSummary, props?: ListUrlProps) {
  const params: Record<string, string> = {};
  if (props?.mode && props.mode !== 'media') params.type = props.mode;
  if (props?.sortBy) params.sort_by = props.sortBy;
  if (props?.sortHow) params.sort_how = props.sortHow;

  if (list.user.slug) {
    return UrlBuilder.users(list.user.slug).lists(list.slug, params);
  }

  return UrlBuilder.lists.official(list.id, params);
}
