import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { SortBy } from '../../../user/models/SortBy.ts';
import type { SortDirection } from '../../../user/models/SortDirection.ts';

type ListProps = {
  type: 'watchlist';
} | {
  type: 'user-list';
  list: MediaListSummary;
};

type ListUrlProps = {
  mode?: DiscoverMode;
  sortBy?: SortBy;
  sortHow?: SortDirection;
} & ListProps;

export function getListUrl(props: ListUrlProps) {
  const params: Record<string, string> = {};
  if (props?.mode && props.mode !== 'media') params.type = props.mode;
  if (props?.sortBy) params.sort_by = props.sortBy;
  if (props?.sortHow) params.sort_how = props.sortHow;

  switch (props.type) {
    case 'watchlist':
      return UrlBuilder.lists.watchlist('me', params);
    case 'user-list': {
      if (props.list.user.slug) {
        return UrlBuilder.users(props.list.user.slug).lists(
          props.list.slug,
          params,
        );
      }

      return UrlBuilder.lists.official(props.list.id, params);
    }
  }
}
