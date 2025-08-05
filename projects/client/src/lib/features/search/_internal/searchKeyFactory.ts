const SEARCH_CONTEXT_KEY = Symbol('search-context');

export function searchKeyFactory() {
  return SEARCH_CONTEXT_KEY;
}
