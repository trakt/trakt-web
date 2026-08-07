import { goto } from '$app/navigation';
import { page } from '$app/state';
import { languageTag } from '$lib/features/i18n/index.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { COMMENT_LANGUAGE_ALL } from './commentLanguageAll.ts';
import { commentLanguageCodes } from './commentLanguageCodes.ts';

const REVIEW_LANGUAGE_PARAM = 'review_lang';
const STORAGE_KEY = 'trakt-comment-language';

function isSupportedLanguage(value: string) {
  return value === COMMENT_LANGUAGE_ALL || commentLanguageCodes.has(value);
}

function toStoredPreference() {
  const stored = safeLocalStorage.getItem(STORAGE_KEY);
  if (stored == null) return null;

  return isSupportedLanguage(stored) ? stored : null;
}

let preference = $state<string | null>(toStoredPreference());

/**
 * Comment language filter. Reads the stored preference, overridden by a
 * shareable URL search param when present so a linked URL reproduces the
 * selection. Without either, defaults to the user's current locale language.
 *
 * `value` is the picker selection ("all" or a language code); `filter` is the
 * value to pass to the query (undefined for "all", i.e. no filter).
 */
export function useCommentLanguage() {
  const value = $derived(
    page.url.searchParams.get(REVIEW_LANGUAGE_PARAM) ?? preference ??
      languageTag(),
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
