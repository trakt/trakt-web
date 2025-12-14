import type { Observable } from 'rxjs';

export function waitForValue<T>(
  store: Observable<T>,
  value: T,
  timeout = 100,
) {
  let lastValue: T;

  return new Promise<T>((resolve) => {
    const subscription = store.subscribe((emission) => {
      lastValue = emission;

      if (value === emission) {
        queueMicrotask(() => subscription.unsubscribe());
        resolve(emission);
      }

      setTimeout(() => resolve(lastValue), timeout);
    });
  });
}
