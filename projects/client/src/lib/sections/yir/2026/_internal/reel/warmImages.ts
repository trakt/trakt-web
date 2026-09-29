import { NOOP_FN } from '$lib/utils/constants.ts';

const BATCH_SIZE = 4;

type Cancel = () => void;

function whenIdle(callback: () => void): Cancel {
  if (typeof globalThis.requestIdleCallback === 'function') {
    const handle = globalThis.requestIdleCallback(callback, { timeout: 1200 });
    return () => globalThis.cancelIdleCallback(handle);
  }

  const handle = setTimeout(callback, 200);
  return () => clearTimeout(handle);
}

function load(url: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = url;
  });
}

export function warmImages(urls: ReadonlyArray<string>): Cancel {
  let isCancelled = false;
  let cancelPending: Cancel = NOOP_FN;

  const next = (index: number) => {
    if (isCancelled || index >= urls.length) return;

    cancelPending = whenIdle(async () => {
      if (isCancelled) return;
      await Promise.all(urls.slice(index, index + BATCH_SIZE).map(load));
      next(index + BATCH_SIZE);
    });
  };

  next(0);

  return () => {
    isCancelled = true;
    cancelPending();
  };
}
