import type { Readable } from 'svelte/store';

export function resolve<T>(stream: Readable<T>, timeout = 1000): Promise<T> {
  return new Promise((resolve, reject) => {
    const unsubscribe = stream.subscribe((value) => {
      const timeoutId = setTimeout(
        () =>
          reject(new Error(`No value resolved, timed out after ${timeout}ms`)),
        timeout,
      );

      if (value !== undefined) {
        resolve(value);
        clearTimeout(timeoutId);
        queueMicrotask(() => unsubscribe());
      }
    });
  });
}
