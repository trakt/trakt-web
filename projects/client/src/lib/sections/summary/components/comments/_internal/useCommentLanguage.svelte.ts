import { goto } from '$app/navigation';
import { page } from '$app/state';
import { ClientStateKey } from '$lib/features/client-state/models/ClientStateKey.ts';
import { useClientValue } from '$lib/features/client-state/useClientValue.ts';
import { languageTag } from '$lib/features/i18n/index.ts';
import { fromStore, type Readable } from 'svelte/store';
import { COMMENT_LANGUAGE_ALL } from './commentLanguageAll.ts';

const REVIEW_LANGUAGE_PARAM = 'review_lang';

/**
 * Comment language filter. Reads the stored preference, overridden by a
 * shareable URL search param when present so a linked URL reproduces the
 * selection. Without either, defaults to the user's current locale language.
 *
 * `value` is the picker selection ("all" or a language code); `filter` is the
 * value to pass to the query (undefined for "all", i.e. no filter).
 */
export function useCommentLanguage() {
  const store = useClientValue(ClientStateKey.CommentLanguage);
  const stored: Readable<string | null> = {
    subscribe: (run) => {
      const subscription = store.value.subscribe(run);
      return () => subscription.unsubscribe();
    },
  };
  const preference = fromStore(stored);

  const value = $derived(
    page.url.searchParams.get(REVIEW_LANGUAGE_PARAM) ??
      preference.current ??
      languageTag(),
  );
  const filter = $derived(
    value === COMMENT_LANGUAGE_ALL ? undefined : value,
  );

  function set(next: string) {
    store.set(next);

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
