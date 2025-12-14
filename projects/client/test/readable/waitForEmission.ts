import type { Observable } from 'rxjs';

export function waitForEmission<T>(
  store: Observable<T>,
  emission: number,
  timeout = 100,
) {
  return new Promise<T>((resolve) => {
    let emissionCount = 0;
    let lastValue: T;

    const subscription = store.subscribe((value) => {
      emissionCount++;
      lastValue = value;

      if (emissionCount === emission) {
        queueMicrotask(() => subscription.unsubscribe());
        resolve(value);
      }

      setTimeout(() => resolve(lastValue), timeout);
    });
  });
}
