import { Observable } from 'rxjs';

type StoreLike<T> = {
  subscribe: (
    run: (value: T) => void,
  ) => (() => void) | { unsubscribe: () => void };
};

export function resolve<T>(
  stream: Observable<T> | StoreLike<T>,
  timeout = 1000,
): Promise<T> {
  return new Promise((resolveResult, rejectResult) => {
    let isResolved = false;
    let cleanup: (() => void) | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const onValue = (value: T) => {
      if (value !== undefined && !isResolved) {
        isResolved = true;
        resolveResult(value);
        if (timeoutId) clearTimeout(timeoutId);
        if (cleanup) cleanup();
      }
    };

    let unsubscribeOrObj: ReturnType<StoreLike<T>['subscribe']>;
    try {
      unsubscribeOrObj = stream.subscribe(onValue);
    } catch (e) {
      if (!isResolved) {
        rejectResult(e);
      }
      return;
    }

    // Normalize unsubscribe
    if (typeof unsubscribeOrObj === 'function') {
      cleanup = unsubscribeOrObj;
    } else if (unsubscribeOrObj && 'unsubscribe' in unsubscribeOrObj) {
      cleanup = () => unsubscribeOrObj.unsubscribe();
    }

    // If already resolved (synchronous), cleanup now
    if (isResolved && cleanup) {
      cleanup();
      cleanup = undefined;
    }

    if (!isResolved) {
      timeoutId = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          rejectResult(
            new Error(`No value resolved, timed out after ${timeout}ms`),
          );
          if (cleanup) cleanup();
        }
      }, timeout);
    }
  });
}
