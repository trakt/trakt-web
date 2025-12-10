import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';
import type { BehaviorSubject } from 'rxjs';

export type SearchContext = {
  mode: BehaviorSubject<SearchMode>;
  isSearching: BehaviorSubject<boolean>;
  pathName: string;
  query: BehaviorSubject<string>;
  config: TypesenseConfig;
};
