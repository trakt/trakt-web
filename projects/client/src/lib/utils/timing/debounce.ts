export function debounce<TArgs, TReturn>(
  func: (...args: TArgs[]) => TReturn | Promise<TReturn>,
  wait: number,
) {
  let timeout: NodeJS.Timeout;
  let currentPromise: Promise<TReturn> | null = null;

  return function executedFunction(...args: TArgs[]): Promise<TReturn> {
    if (currentPromise) {
      clearTimeout(timeout);
    }

    return (currentPromise = new Promise<TReturn>((resolve) => {
      timeout = setTimeout(async () => {
        const result = await func(...args);
        resolve(result);
        currentPromise = null;
      }, wait);
    }));
  };
}
