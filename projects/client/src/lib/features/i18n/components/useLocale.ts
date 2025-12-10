import { browser } from '$app/environment';
import {
  type AvailableLocale,
  defaultLocale,
  getLocale,
  setLocale,
} from '$lib/features/i18n/index.ts';
import { BehaviorSubject, type Subscription } from 'rxjs';
import { getContext, setContext } from 'svelte';

const LOCALE_CONTEXT_KEY = 'locale';

type LocaleWritable = {
  subscribe: (observer: (value: AvailableLocale) => void) => Subscription;
  set: (value: string) => void;
};

export function useLocale(): LocaleWritable {
  if (!browser) {
    const subject = new BehaviorSubject(getLocale());
    return {
      subscribe: subject.subscribe.bind(subject),
      set: (value: string) => subject.next(setLocale(value)),
    };
  }

  const locale =
    getContext<BehaviorSubject<AvailableLocale>>(LOCALE_CONTEXT_KEY) ??
      setContext(
        LOCALE_CONTEXT_KEY,
        new BehaviorSubject(
          setLocale(
            globalThis?.document?.documentElement?.lang ?? defaultLocale,
          ),
        ),
      );

  return {
    subscribe: locale.subscribe.bind(locale),
    set: (value: string) => {
      locale.next(setLocale(value));

      if (browser) {
        globalThis.document.documentElement.lang = value;
      }
    },
  };
}
