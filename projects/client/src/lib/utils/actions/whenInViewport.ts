import { NOOP_FN } from '$lib/utils/constants.ts';
import type { ActionReturn } from 'svelte/action';

type Callback = () => void;

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
  callback: Callback,
): ActionReturn<undefined> {
  if (!element) {
    return { destroy: NOOP_FN };
  }

  const pool = getPool({ threshold: 0.1 });
  pool.callbacks.set(element, callback);
  pool.observer.observe(element);

  return {
    destroy() {
      pool.observer.unobserve(element);
      pool.callbacks.delete(element);
    },
  };
}
