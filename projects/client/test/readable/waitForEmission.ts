import { type Readable } from 'svelte/store';

export function waitForEmission<T>(
  store: Readable<T>,
  emission: number,
  timeout = 15,
) {
  return new Promise<T>((resolve) => {
    let emissionCount = 0;
    let lastValue: T;

    const unsubscribe = store.subscribe((value) => {
      emissionCount++;
      lastValue = value;

      if (emissionCount === emission) {
        queueMicrotask(() => unsubscribe());
        resolve(value);
      }

      setTimeout(() => resolve(lastValue), timeout);
    });
  });
}
