import { goto } from '$app/navigation';
import { page } from '$app/state';
import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';
import { getSearchContext } from './_internal/getSearchContext.ts';

/**
 * Read + drive the search content mode without spinning up the full search
 * results pipeline (unlike `useSearch`). The mode lives in the SearchProvider
 * context (seeded/synced from the `?m=` param), so writing the param is what
 * moves the selection - no component-local subject to drift out of sync.
 */
export function useSearchMode() {
  const { mode, pathName } = getSearchContext();

  const setMode = (value: SearchMode) => {
    const url = new URL(page.url.href);
    url.searchParams.set('m', value);

    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url, {
      replaceState: page.url.pathname === pathName,
      keepFocus: true,
    });
  };

  return { mode, setMode };
}
