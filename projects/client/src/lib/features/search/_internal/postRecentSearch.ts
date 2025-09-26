import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { PersonSummary } from '$lib/requests/models/PersonSummary.ts';
import { recentSearchRequest } from '$lib/requests/queries/search/recentSearchRequest.ts';

type SearchItem = PersonSummary | MediaEntry;

function mapToSearchType(item: SearchItem) {
  if ('biography' in item) {
    return 'people' as const;
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
