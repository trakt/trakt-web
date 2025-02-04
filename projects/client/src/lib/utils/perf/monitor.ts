import { print, PrintTarget } from '$lib/utils/console/print.ts';
import { IS_PROD } from '$lib/utils/env/index.ts';

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
        print(PrintTarget.Monitor, 'info', `${name} took ${end - start}ms`);
      }) as TReturn;
    }

    const end = performance.now();
    print(PrintTarget.Monitor, 'info', `${name} took ${end - start}ms`);
    return result;
  };
}
