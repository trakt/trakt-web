import type { ActionReturn } from 'svelte/action';

type PointerType = 'mouse' | 'pen' | 'touch';

export function disableTransitionOn(
  node: HTMLElement,
  pointerType: PointerType,
): ActionReturn<undefined> {
  function transitionHandler(ev: PointerEvent) {
    if (ev.pointerType === pointerType) {
      return node.style.setProperty('transition', 'none');
    }

    return node.style.removeProperty('transition');
  }

  node.addEventListener('pointerdown', transitionHandler);

  return {
    destroy() {
      node.removeEventListener('pointerdown', transitionHandler);
    },
  };
}
