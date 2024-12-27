import type { Readable } from 'svelte/store';

export function resolve<T>(stream: Readable<T>): Promise<T> {
  return new Promise((resolve) => {
    const unsubscribe = stream.subscribe((value) => {
      resolve(value);
      queueMicrotask(() => unsubscribe());
    });
  });
}
