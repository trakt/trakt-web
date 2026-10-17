import { NOOP_FN } from '$lib/utils/constants.ts';
import type { ActionReturn } from 'svelte/action';

type Callback = () => void;

type WhenInViewportParams =
  | Callback
  | { readonly callback: Callback; readonly rootMargin?: string };

type Pool = {
  readonly observer: IntersectionObserver;
  readonly callbacks: WeakMap<Element, Callback>;
};

const pools = new Map<string, Pool>();

function getPool(options: IntersectionObserverInit): Pool {
  const key = JSON.stringify(options);
  const cached = pools.get(key);
  if (cached) return cached;

  const callbacks = new WeakMap<Element, Callback>();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const cb = callbacks.get(entry.target);
      if (!cb) continue;
      cb();
      observer.unobserve(entry.target);
      callbacks.delete(entry.target);
    }
  }, options);

  const pool: Pool = { observer, callbacks };
  pools.set(key, pool);
  return pool;
}

export function whenInViewport(
  element: HTMLElement,
  params: WhenInViewportParams,
): ActionReturn<undefined> {
  if (!element) {
    return { destroy: NOOP_FN };
  }

  const { callback, rootMargin } =
    typeof params === 'function'
      ? { callback: params, rootMargin: undefined }
      : params;

  const pool = getPool({ threshold: 0.1, rootMargin });
  pool.callbacks.set(element, callback);
  pool.observer.observe(element);

  return {
    destroy() {
      pool.observer.unobserve(element);
      pool.callbacks.delete(element);
    },
  };
}
