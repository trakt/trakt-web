export function waitForEmission<T>(
  store: ReadableOrObservable<T>,
  emission: number,
  timeout = 100,
) {
  return new Promise<T>((resolve) => {
    let emissionCount = 0;
    let lastValue: T;

    const unsubscribe = store.subscribe((value) => {
      emissionCount++;
      lastValue = value;

      if (emissionCount === emission) {
        queueMicrotask(() =>
          'unsubscribe' in unsubscribe
            ? unsubscribe.unsubscribe()
            : unsubscribe()
        );
        resolve(value);
      }

      setTimeout(() => resolve(lastValue), timeout);
    });
  });
}
