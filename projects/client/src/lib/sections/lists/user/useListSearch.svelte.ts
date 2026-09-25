import { goto } from '$app/navigation';
import { page } from '$app/state';
import { onDestroy, untrack } from 'svelte';

const LIST_SEARCH_PARAM = 'terms';
const LIST_SEARCH_DEBOUNCE = 250;

function readSearchTerms(url: URL) {
  return url.searchParams.get(LIST_SEARCH_PARAM) ?? '';
}

function toSearchUrl(terms: string) {
  const url = new URL(page.url);

  if (terms.length > 0) {
    url.searchParams.set(LIST_SEARCH_PARAM, terms);
  } else {
    url.searchParams.delete(LIST_SEARCH_PARAM);
  }

  return url;
}

/**
 * Free-text filter for a list page: the personal lists overview, a single
 * list's items, or the watchlist.
 *
 * `term` mirrors the input as typed. `filter` is the trimmed, debounced value
 * handed to the request and mirrored into the URL (`?terms=`) so a filtered
 * page survives a reload and can be shared. `isOpen` tracks the search field's
 * visibility: it starts open when the URL already carries a term.
 *
 * The URL stays authoritative: SvelteKit reuses the page component across
 * client-side navigation (another user's lists, say), so when the URL's term
 * stops matching the committed filter the state follows the URL.
 *
 * Call it during component initialisation: a commit still pending when the
 * owner is destroyed, or when the URL moves on, is dropped, so it cannot write
 * `terms` onto the route the user navigated to.
 */
export function useListSearch() {
  const initial = readSearchTerms(page.url);

  let term = $state(initial);
  let filter = $state(initial.trim());
  let isOpen = $state(initial.trim().length > 0);
  let pending: ReturnType<typeof setTimeout> | undefined;

  onDestroy(() => clearTimeout(pending));

  // Our own commits echo back the filter we already hold, so only a URL that
  // disagrees with it (navigation, a pasted link) resets the search.
  $effect.pre(() => {
    const next = readSearchTerms(page.url);

    untrack(() => {
      if (next.trim() === filter) return;

      clearTimeout(pending);
      term = next;
      filter = next.trim();
      isOpen = filter.length > 0;
    });
  });

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
      pending = setTimeout(() => commit(next.trim()), LIST_SEARCH_DEBOUNCE);
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
