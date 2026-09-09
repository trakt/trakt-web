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
const ORDER_SUFFIX = 'order';

const globalStores = new Map<string, BehaviorSubject<unknown>>();

export function resetGlobalStore() {
  globalStores.clear();
}

/**
 * Reads a stored order, dropping anything that is no longer an option and
 * appending anything new, so an order saved before a filter was added or
 * removed still applies instead of being thrown away.
 */
function readOrder(
  storageKey: string,
  options: ReadonlyArray<{ value: unknown }>,
): ReadonlyArray<{ value: unknown }> {
  try {
    const stored = safeLocalStorage.getItem(storageKey);
    if (!stored) return options;

    const order = JSON.parse(stored) as unknown;
    if (!Array.isArray(order)) return options;

    const known = order
      .map((value) => options.find((option) => option.value === value))
      .filter((option) => option != null);
    const rest = options.filter((option) => !known.includes(option));

    return [...known, ...rest];
  } catch {
    return options;
  }
}

export function useToggler<T extends TogglerId, K = TogglerValueMap[T]>(id: T) {
  const toggler = TOGGLERS[id];
  const storageKey = `${TOGGLER_PREFIX}_${toggler.id}`;
  const orderKey = `${storageKey}_${ORDER_SUFFIX}`;

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

  if (!globalStores.has(orderKey)) {
    globalStores.set(
      orderKey,
      new BehaviorSubject<unknown>(readOrder(orderKey, toggler.options)),
    );
  }

  const order = globalStores.get(orderKey) as BehaviorSubject<
    typeof toggler.options
  >;

  return {
    options: toggler.options,
    orderedOptions: order.asObservable(),
    setOrder: (values: K[]) => {
      const next = values
        .map((value) => toggler.options.find((o) => o.value === value))
        .filter((option) => option != null);

      if (next.length !== toggler.options.length) return;

      order.next(next as typeof toggler.options);
      safeLocalStorage.setItem(orderKey, JSON.stringify(values));
    },
    default: toggler.default as K,
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
