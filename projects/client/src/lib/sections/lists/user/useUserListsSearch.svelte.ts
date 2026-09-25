import { goto } from '$app/navigation';
import { page } from '$app/state';

const LISTS_SEARCH_PARAM = 'terms';
const LISTS_SEARCH_DEBOUNCE = 250;

function toSearchUrl(terms: string) {
  const url = new URL(page.url);

  if (terms.length > 0) {
    url.searchParams.set(LISTS_SEARCH_PARAM, terms);
  } else {
    url.searchParams.delete(LISTS_SEARCH_PARAM);
  }

  return url;
}

/**
 * Free-text filter for a user's personal lists.
 *
 * `term` mirrors the input as typed. `filter` is the trimmed, debounced value
 * handed to the request and mirrored into the URL (`?terms=`) so a filtered
 * page survives a reload and can be shared. `isOpen` tracks the search field's
 * visibility: it starts open when the URL already carries a term.
 */
export function useUserListsSearch() {
  const initial = page.url.searchParams.get(LISTS_SEARCH_PARAM) ?? '';

  let term = $state(initial);
  let filter = $state(initial.trim());
  let isOpen = $state(initial.trim().length > 0);
  let pending: ReturnType<typeof setTimeout> | undefined;

  function commit(next: string) {
    clearTimeout(pending);
    filter = next;
    goto(toSearchUrl(next), {
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });
  }

  function open() {
    isOpen = true;
  }

  function close() {
    isOpen = false;
    term = '';
    commit('');
  }

  return {
    get term() {
      return term;
    },
    set term(next: string) {
      term = next;
      clearTimeout(pending);
      pending = setTimeout(() => commit(next.trim()), LISTS_SEARCH_DEBOUNCE);
    },
    get filter() {
      return filter;
    },
    get isOpen() {
      return isOpen;
    },
    open,
    close,
    toggle: () => (isOpen ? close() : open()),
  };
}
