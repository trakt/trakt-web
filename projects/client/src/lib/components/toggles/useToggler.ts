import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { assertDefined } from '../../utils/assert/assertDefined.ts';
import {
  type TogglerId,
  TOGGLERS,
  type TogglerValueMap,
} from './_internal/constants.ts';

const TOGGLER_PREFIX = 'trakt_toggler';

const globalStores = new Map<string, BehaviorSubject<unknown>>();

export function useToggler<T extends TogglerId, K = TogglerValueMap[T]>(id: T) {
  const toggler = TOGGLERS[id];
  const storageKey = `${TOGGLER_PREFIX}_${toggler.id}`;

  if (!globalStores.has(storageKey)) {
    const initialValue = (() => {
      try {
        const stored = safeLocalStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (toggler.options.some((o) => o.value === parsed)) {
            return parsed;
          }
        }
      } catch {
        // ignore parse errors and use default
      }
      return toggler.default;
    })();

    globalStores.set(storageKey, new BehaviorSubject<unknown>(initialValue));
  }

  const current = globalStores.get(storageKey) as BehaviorSubject<K>;

  return {
    options: toggler.options,
    current: current.pipe(
      map(($current) => {
        const option = toggler.options.find((o) => o.value === $current) ??
          assertDefined(
            toggler.options.find((o) => o.value === toggler.default),
            'Default toggler option must exist',
          );
        return { value: option.value as K, text: option.text };
      }),
    ),
    set: (value: K) => {
      current.next(value);
      safeLocalStorage.setItem(storageKey, JSON.stringify(value));
    },
  };
}
