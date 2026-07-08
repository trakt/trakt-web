import { goto } from '$app/navigation';
import { page } from '$app/state';
import { languageTag } from '$lib/features/i18n/index.ts';
import { COMMENT_LANGUAGE_ALL } from './commentLanguageAll.ts';

const REVIEW_LANGUAGE_PARAM = 'review_lang';

/**
 * Comment language filter, backed by a shareable URL search param. Defaults to
 * the user's current locale language when the param is absent. Shared across
 * every comment surface (inline section, drawer, season tab) so a linked URL
 * reproduces the selection.
 *
 * `value` is the picker selection ("all" or a language code); `filter` is the
 * value to pass to the query (undefined for "all", i.e. no filter).
 */
export function useCommentLanguage() {
  const value = $derived(
    page.url.searchParams.get(REVIEW_LANGUAGE_PARAM) ?? languageTag(),
  );
  const filter = $derived(
    value === COMMENT_LANGUAGE_ALL ? undefined : value,
  );

  function set(next: string) {
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
