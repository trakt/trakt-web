import {
  type ListType,
  ListTypeSchema,
} from '$lib/requests/models/ListType.ts';
import { recentSearchRequest } from '$lib/requests/queries/search/recentSearchRequest.ts';
import type { SearchItem } from '../models/SearchItem.ts';

function isListType(value: unknown): value is ListType {
  return ListTypeSchema.safeParse(value).success;
}

function mapToSearchType(item: SearchItem) {
  if ('biography' in item) {
    return 'people' as const;
  }

  if (isListType(item.type)) {
    return 'lists' as const;
  }

  switch (item.type) {
    case 'movie':
      return 'movies' as const;
    case 'show':
      return 'shows' as const;
  }
}

function mapToPayload(item: SearchItem, query: string) {
  return {
    query,
    id: item.id,
    type: mapToSearchType(item),
  };
}

export function postRecentSearch(
  item: SearchItem,
  query: string,
) {
  recentSearchRequest({ body: mapToPayload(item, query) });
}
