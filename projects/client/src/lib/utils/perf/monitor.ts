import { IS_PROD } from '../env';

export function monitor<
  TThis = unknown,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown,
>(
  fn: (this: TThis, ...args: TArgs) => TReturn,
  name: string,
): (this: TThis, ...args: TArgs) => TReturn {
  if (IS_PROD) {
    return fn;
  }

  return function (this: TThis, ...args: TArgs): TReturn {
    const start = performance.now();
    const result = fn.apply(this, args);

    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        console.log(`${name} took ${end - start}ms`);
      }) as TReturn;
    }

    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
    return result;
  };
}
