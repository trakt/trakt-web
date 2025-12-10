import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject, map } from 'rxjs';
import { assertDefined } from '../../utils/assert/assertDefined.ts';
import {
  type TogglerId,
  TOGGLERS,
  type TogglerValueMap,
} from './_internal/constants.ts';

const TOGGLER_PREFIX = 'trakt_toggler';

const globalStores = new Map<string, BehaviorSubject<any>>();

export function useToggler<T extends TogglerId, K = TogglerValueMap[T]>(id: T) {
  const toggler = TOGGLERS[id];
  const storageKey = `${TOGGLER_PREFIX}_${toggler.id}`;

  if (!globalStores.has(storageKey)) {
    const initialValue = JSON.parse(
      safeLocalStorage.getItem(storageKey) ??
        JSON.stringify(toggler.default),
    );

    globalStores.set(storageKey, new BehaviorSubject<K>(initialValue));
  }

  const current = globalStores.get(storageKey) as BehaviorSubject<K>;

  return {
    options: toggler.options,
    current: current.pipe(
      map((c) => ({
        value: c,
        text: assertDefined(
          toggler.options.find((o) => o.value === c),
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
