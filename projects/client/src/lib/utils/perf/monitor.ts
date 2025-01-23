import { IS_PROD } from '../env';

export function monitor<T extends (...args: unknown[]) => unknown>(
  fn: T,
  name: string,
): T {
  if (IS_PROD) {
    return fn;
  }

  return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    const start = performance.now();
    const result = fn.apply(this, args);

    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        console.log(`${name} took ${end - start}ms`);
      }) as ReturnType<T>;
    }

    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
    return result as ReturnType<T>;
  } as T;
}
