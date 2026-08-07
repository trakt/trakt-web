import { goto } from '$app/navigation';
import { page } from '$app/state';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { COMMENT_LANGUAGE_ALL } from './commentLanguageAll.ts';

const REVIEW_LANGUAGE_PARAM = 'review_lang';
const STORAGE_KEY = 'trakt_comment_language';

/**
 * Module-level so every comment surface (inline section, drawer, season tab)
 * shares one selection, and so the choice survives navigation. Seeded from
 * `localStorage` on first import; falls back to "all languages" - the filter is
 * intentionally independent of the app locale.
 */
let preference = $state(
  safeLocalStorage.getItem(STORAGE_KEY) ?? COMMENT_LANGUAGE_ALL,
);

/**
 * Comment language filter. Reads the stored preference, overridden by a
 * shareable URL search param when present so a linked URL reproduces the
 * selection.
 *
 * `value` is the picker selection ("all" or a language code); `filter` is the
 * value to pass to the query (undefined for "all", i.e. no filter).
 */
export function useCommentLanguage() {
  const value = $derived(
    page.url.searchParams.get(REVIEW_LANGUAGE_PARAM) ?? preference,
  );
  const filter = $derived(
    value === COMMENT_LANGUAGE_ALL ? undefined : value,
  );

  function set(next: string) {
    preference = next;
    safeLocalStorage.setItem(STORAGE_KEY, next);

    const url = new URL(page.url);
    url.searchParams.set(REVIEW_LANGUAGE_PARAM, next);
    goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  }

  return {
    get value() {
      return value;
    },
    get filter() {
      return filter;
    },
    set,
  };
}
