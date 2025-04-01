import { bodyPortal } from '$lib/features/portal/_internal/bodyPortal.ts';
import { createUnderlay } from '$lib/features/portal/_internal/createUnderlay.ts';
import { writable } from 'svelte/store';

export function usePopupHelpers() {
  const underlay = writable<HTMLElement | null>(null);
  const targetClone = writable<HTMLElement | null>(null);

  const clearElement = (element: HTMLElement | null) => {
    element?.remove();
    return null;
  };

  const removeHelpers = () => {
    underlay.update(clearElement);
    targetClone.update(clearElement);
  };

  const addHelpers = (target: HTMLElement) => {
    const newUnderlay = createUnderlay();
    underlay.set(newUnderlay);
    document.body.appendChild(newUnderlay);

    const clone = target.cloneNode(true) as HTMLElement;
    clone.setAttribute('data-popup-state', 'opened');

    const targetRect = target.getBoundingClientRect();
    bodyPortal(clone, targetRect);

    /*
      +1 because the clone should be able to appear
      above the popup container.
    */
    clone.style.zIndex = 'calc(var(--layer-menu) + 1)';
    targetClone.set(clone);
  };

  return {
    addHelpers,
    removeHelpers,
    popupTarget: targetClone,
  };
}
