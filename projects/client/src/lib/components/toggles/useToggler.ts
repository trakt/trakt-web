import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { derived, writable } from 'svelte/store';
import {
  type TogglerId,
  TOGGLERS,
  type TogglerValueMap,
} from './_internal/constants.ts';

const TOGGLER_PREFIX = 'trakt_toggler';

export function useToggler<T extends TogglerId, K = TogglerValueMap[T]>(id: T) {
  const toggler = TOGGLERS[id];

  const current = writable<K>(
    JSON.parse(
      safeLocalStorage.getItem(`${TOGGLER_PREFIX}_${toggler.id}`) ??
        JSON.stringify(toggler.default),
    ),
  );

  return {
    options: toggler.options,
    current: derived(current, ($current) => $current),
    set: (value: K) => {
      current.set(value);
      safeLocalStorage.setItem(
        `${TOGGLER_PREFIX}_${id}`,
        JSON.stringify(value),
      );
    },
  };
}
