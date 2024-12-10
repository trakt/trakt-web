import { browser } from '$app/environment';
import {
  type AvailableLocale,
  defaultLocale,
  getLocale,
  setLocale,
} from '$lib/features/i18n/index.ts';
import { getContext, setContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';

const LOCALE_CONTEXT_KEY = 'locale';

type LocaleWritable = {
  subscribe: Writable<AvailableLocale>['subscribe'];
  set: (value: string) => void;
};

export function useLocale(): LocaleWritable {
  if (!browser) {
    return writable(getLocale()) as LocaleWritable;
  }
  const locale = getContext<Writable<AvailableLocale>>(LOCALE_CONTEXT_KEY) ??
    setContext(
      LOCALE_CONTEXT_KEY,
      writable(
        setLocale(globalThis?.document?.documentElement?.lang ?? defaultLocale),
      ),
    );

  return {
    subscribe: locale.subscribe,
    set: (value: string) => {
      locale.set(setLocale(value));

      if (browser) {
        globalThis.document.documentElement.lang = value;
      }
    },
  };
}
