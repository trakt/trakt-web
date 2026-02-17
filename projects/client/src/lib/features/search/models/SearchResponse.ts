import type { ListsSearchResult } from '$lib/requests/queries/search/searchListsQuery.ts';
import type { MediaSearchResult } from '$lib/requests/queries/search/searchMediaQuery.ts';
import type { PeopleSearchResult } from '$lib/requests/queries/search/searchPeopleQuery.ts';

export type SearchResponse =
  | MediaSearchResult
  | PeopleSearchResult
  | ListsSearchResult;
