import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { derived, type Writable, writable } from 'svelte/store';
import { assertDefined } from '../../utils/assert/assertDefined.ts';
import {
  type TogglerId,
  TOGGLERS,
  type TogglerValueMap,
} from './_internal/constants.ts';

const TOGGLER_PREFIX = 'trakt_toggler';

const globalStores = new Map<string, Writable<unknown>>();

export function useToggler<T extends TogglerId, K = TogglerValueMap[T]>(id: T) {
  const toggler = TOGGLERS[id];
  const storageKey = `${TOGGLER_PREFIX}_${toggler.id}`;

  if (!globalStores.has(storageKey)) {
    const initialValue = JSON.parse(
      safeLocalStorage.getItem(storageKey) ??
        JSON.stringify(toggler.default),
    );

    globalStores.set(storageKey, writable<K>(initialValue));
  }

  const current = globalStores.get(storageKey) as Writable<K>;

  return {
    options: toggler.options,
    current: derived(current, ($current) => ({
      value: $current,
      text: assertDefined(
        toggler.options.find((o) => o.value === $current),
        'Toggler option must exist',
      ).text,
    })),
    set: (value: K) => {
      current.set(value);
      safeLocalStorage.setItem(storageKey, JSON.stringify(value));
    },
  };
}
