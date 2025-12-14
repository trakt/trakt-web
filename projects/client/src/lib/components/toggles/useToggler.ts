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
    const initialValue = JSON.parse(
      safeLocalStorage.getItem(storageKey) ??
        JSON.stringify(toggler.default),
    );

    globalStores.set(storageKey, new BehaviorSubject<unknown>(initialValue));
  }

  const current = globalStores.get(storageKey) as BehaviorSubject<K>;

  return {
    options: toggler.options,
    current: current.pipe(
      map(($current) => ({
        value: $current,
        text: assertDefined(
          toggler.options.find((o) => o.value === $current),
          'Toggler option must exist',
        ).text,
      })),
    ),
    set: (value: K) => {
      current.next(value);
      safeLocalStorage.setItem(storageKey, JSON.stringify(value));
    },
  };
}
