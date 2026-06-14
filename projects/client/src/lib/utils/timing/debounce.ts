export function debounce<TArgs, TReturn>(
  func: (...args: TArgs[]) => TReturn | Promise<TReturn>,
  wait: number,
) {
  let timeout: NodeJS.Timeout;
  let resolvers: Array<(value: TReturn) => void> = [];

  return function executedFunction(...args: TArgs[]): Promise<TReturn> {
    clearTimeout(timeout);

    return new Promise<TReturn>((resolve) => {
      resolvers.push(resolve);

      timeout = setTimeout(async () => {
        const result = await func(...args);
        const pending = resolvers;
        resolvers = [];
        pending.forEach((settle) => settle(result));
      }, wait);
    });
  };
}
