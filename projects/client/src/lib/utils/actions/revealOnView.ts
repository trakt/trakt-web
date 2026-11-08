import { NOOP_FN } from '$lib/utils/constants.ts';
import type { ActionReturn } from 'svelte/action';
import { whenInViewport } from './whenInViewport.ts';

type RevealOnViewParams = {
  readonly delay?: number;
};

function isBelowFold(element: HTMLElement): boolean {
  return element.getBoundingClientRect().top >= globalThis.innerHeight;
}

function prefersReducedMotion(): boolean {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function revealOnView(
  element: HTMLElement,
  params: RevealOnViewParams = {},
): ActionReturn<RevealOnViewParams> {
  if (prefersReducedMotion() || !isBelowFold(element)) {
    return { destroy: NOOP_FN };
  }

  element.style.setProperty('--reveal-delay', `${params.delay ?? 0}ms`);
  element.dataset.reveal = 'pending';

  const viewport = whenInViewport(element, {
    callback: () => {
      element.dataset.reveal = 'shown';
    },
    requiresObserver: false,
  });

  return {
    destroy() {
      viewport.destroy?.();
      delete element.dataset.reveal;
    },
  };
}
