export const SEARCH_CONTEXT_KEY = Symbol('search-context');

const MOVIE_SEARCH_KEY = Symbol('search-movie');
const SHOW_SEARCH_KEY = Symbol('search-show');

export function searchKeyFactory(type: string) {
  switch (type) {
    case 'movie':
      return MOVIE_SEARCH_KEY;
    case 'show':
      return SHOW_SEARCH_KEY;
    default:
      throw new Error(`Unknown search type: ${type}`);
  }
}
