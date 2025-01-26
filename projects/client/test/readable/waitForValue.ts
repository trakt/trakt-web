import { type Readable } from 'svelte/store';

export function waitForValue<T>(
  store: Readable<T>,
  value: T,
  timeout = 15,
) {
  let lastValue: T;

  return new Promise<T>((resolve) => {
    const unsubscribe = store.subscribe((emission) => {
      lastValue = emission;

      if (value === emission) {
        queueMicrotask(() => unsubscribe());
        resolve(emission);
      }

      setTimeout(() => resolve(lastValue), timeout);
    });
  });
}
