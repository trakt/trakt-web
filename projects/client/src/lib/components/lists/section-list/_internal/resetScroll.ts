import { tick } from 'svelte';
import type { ActionReturn } from 'svelte/action';
import { pauseScrollSnap } from '$lib/utils/scroll/pauseScrollSnap.ts';

function holdScrollOffset(node: HTMLElement) {
  let frame = 0;
  let release: (() => void) | undefined;

  const resume = () => {
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        release?.();
        release = undefined;
      });
    });
  };

  const observer = new MutationObserver(() => {
    cancelAnimationFrame(frame);
    release ??= pauseScrollSnap(node);
    resume();
  });

  observer.observe(node, { childList: true });

  return () => {
    cancelAnimationFrame(frame);
    release?.();
    observer.disconnect();
  };
}

export function resetScroll(
  node: HTMLElement,
  key?: unknown,
): ActionReturn<unknown> {
  if (key !== undefined) {
    // Key-based mode: reset only when key changes, not on every DOM mutation.
    // Used by lists with stable item arrays (e.g. UpNextList) so that in-place
    // updates (marking as watched) don't scroll back to position 0.
    const release = holdScrollOffset(node);

    return {
      update() {
        tick().then(() => {
          node.scrollLeft = 0;
        });
      },
      destroy: release,
    };
  }

  const observer = new MutationObserver(() => {
    tick().then(() => {
      node.scrollLeft = 0;
    });
  });

  observer.observe(node, { childList: true });

  return {
    update() {},
    destroy() {
      observer.disconnect();
    },
  };
}
