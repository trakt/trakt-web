import { bodyPortal } from '$lib/features/portal/_internal/bodyPortal.ts';
import { createUnderlay } from '$lib/features/portal/_internal/createUnderlay.ts';
import { get, writable } from 'svelte/store';

const clearElement = (element: HTMLElement | null) => {
  element?.remove();
  return null;
};

export function usePopupHelpers() {
  const underlay = writable<HTMLElement | null>(null);
  const targetClone = writable<HTMLElement | null>(null);

  const removeCloneAfterContainer = (popupContainer: HTMLElement) => {
    targetClone.update((element) => {
      element?.style.setProperty('pointer-events', 'none');
      element?.setAttribute('data-popup-state', 'removing');
      return element;
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === popupContainer && get(targetClone)) {
            targetClone.update(clearElement);
            observer.disconnect();
          }
        });
      });
    });

    observer.observe(document.body, { childList: true });
  };

  const removeHelpers = (popupContainer: HTMLElement | null) => {
    underlay.update(clearElement);

    if (!popupContainer) {
      targetClone.update(clearElement);
      return;
    }

    removeCloneAfterContainer(popupContainer);
  };

  const addHelpers = (target: HTMLElement) => {
    const newUnderlay = createUnderlay();
    underlay.set(newUnderlay);
    document.body.appendChild(newUnderlay);

    targetClone.update(clearElement);

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
