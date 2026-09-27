import { NOOP_FN } from '$lib/utils/constants.ts';
import type { ActionReturn } from 'svelte/action';

type WhenSeenForParams = {
  callback: () => void;
  duration: number;
};

type Watch = WhenSeenForParams & {
  timer?: ReturnType<typeof setTimeout>;
};

const watches = new WeakMap<Element, Watch>();
let sharedObserver: IntersectionObserver | undefined;

function stopWatching(element: Element) {
  clearTimeout(watches.get(element)?.timer);
  watches.delete(element);
  sharedObserver?.unobserve(element);
}

function onIntersection(entries: IntersectionObserverEntry[]) {
  entries.forEach(({ target, isIntersecting }) => {
    const watch = watches.get(target);
    if (!watch) return;

    clearTimeout(watch.timer);
    if (!isIntersecting) return;

    watch.timer = setTimeout(() => {
      stopWatching(target);
      watch.callback();
    }, watch.duration);
  });
}

function getObserver() {
  sharedObserver ??= new IntersectionObserver(onIntersection, {
    threshold: 1,
  });
  return sharedObserver;
}

export function whenSeenFor(
  element: HTMLElement,
  params: WhenSeenForParams,
): ActionReturn<WhenSeenForParams> {
  if (!element) return { destroy: NOOP_FN };

  watches.set(element, { ...params });
  getObserver().observe(element);

  return {
    destroy: () => stopWatching(element),
  };
}
