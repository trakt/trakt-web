import type { Observable, Subscription } from 'rxjs';

export function resolve<T>(
  stream: Observable<T>,
  timeout = 1000,
): Promise<Exclude<T, Nil>> {
  return new Promise((resolve, reject) => {
    let subscription: Subscription | Nil = null;

    const timeoutId = setTimeout(() => {
      reject(new Error(`No value resolved, timed out after ${timeout}ms`));
      subscription?.unsubscribe();
    }, timeout);

    subscription = stream.subscribe((value) => {
      if (value !== undefined) {
        clearTimeout(timeoutId);
        resolve(value as Exclude<T, Nil>);
        queueMicrotask(() => subscription?.unsubscribe());
      }
    });
  });
}
