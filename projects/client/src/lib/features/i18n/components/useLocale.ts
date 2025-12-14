import { browser } from '$app/environment';
import {
  type AvailableLocale,
  defaultLocale,
  getLocale,
  setLocale,
} from '$lib/features/i18n/index.ts';
import { BehaviorSubject, type PartialObserver, type Subscription } from 'rxjs';
import { getContext, setContext } from 'svelte';
import { NOOP_FN } from '../../../utils/constants.ts';

const LOCALE_CONTEXT_KEY = 'locale';

type LocaleStore = {
  subscribe: (
    observerOrNext?:
      | PartialObserver<AvailableLocale>
      | ((value: AvailableLocale) => void),
  ) => Subscription;
  set: (value: string) => void;
};

export function useLocale(): LocaleStore {
  if (!browser) {
    const subject = new BehaviorSubject(getLocale());
    return {
      subscribe: subject.subscribe.bind(subject),
      set: NOOP_FN,
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
