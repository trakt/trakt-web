import type {
  MediaResult,
} from '$lib/requests/queries/search/searchMediaQuery.ts';
import type { PeopleSearchResult } from '$lib/requests/queries/search/searchPeopleQuery.ts';

type SearchResultReason = {
  reason: 'initial' | 'result' | 'cancelled';
};

type SearchResultEmpty = {
  response: null;
};

type SearchResultMedia = {
  response: {
    type: 'media';
    items: MediaResult[];
  };
};

type SearchResultPeople = {
  response: PeopleSearchResult;
};

export type SearchResult =
  & SearchResultReason
  & (
    | SearchResultEmpty
    | SearchResultMedia
    | SearchResultPeople
  );
