import { type Readable } from 'svelte/store';

export async function waitForEmission<T>(
  store: Readable<T>,
  emission: number,
  timeout = 15,
) {
  return new Promise((resolve) => {
    let emissionCount = 0;
    let lastValue: T;

    const unsubscribe = store.subscribe((value) => {
      emissionCount++;
      lastValue = value;

      if (emissionCount === emission) {
        unsubscribe();
        resolve(value);
      }

      setTimeout(() => resolve(lastValue), timeout);
    });
  });
}
