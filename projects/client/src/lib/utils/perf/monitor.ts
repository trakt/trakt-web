import { IS_PROD } from '../env';

// skipcq: JS-0323
export function monitor<T extends (...args: any[]) => any>(
  fn: T,
  name: string,
): (...args: Parameters<T>) => ReturnType<T> {
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
  };
}
