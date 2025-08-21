import { bodyPortal } from '$lib/features/portal/_internal/bodyPortal.ts';
import { POPUP_STATE_ATTRIBUTE } from '$lib/features/portal/_internal/constants.ts';
import { createUnderlay } from '$lib/features/portal/_internal/createUnderlay.ts';
import { PopupState } from '$lib/features/portal/_internal/models/PopupState.ts';
import { get, writable } from 'svelte/store';
import { createSanitizedClone } from './createSanitizedClone.ts';
import { getTargetArea } from './getTargetArea.ts';

const clearElement = (element: HTMLElement | null) => {
  element?.remove();
  return null;
};

export function usePopupHelpers() {
  const underlay = writable<HTMLElement | null>(null);
  const targetClone = writable<HTMLElement | null>(null);
  const area = getTargetArea();

  const removeCloneAfterContainer = (popupContainer: HTMLElement) => {
    targetClone.update((element) => {
      element?.style.setProperty('pointer-events', 'none');
      element?.setAttribute(POPUP_STATE_ATTRIBUTE, PopupState.Removing);
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

    observer.observe(area.target, { childList: true });
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

    const underlayTarget = document.querySelector('dialog[open]') ??
      document.body;
    underlayTarget.appendChild(newUnderlay);

    targetClone.update(clearElement);

    const clone = createSanitizedClone(target);
    const targetRect = target.getBoundingClientRect();

    clone.style.width = `${targetRect.width}px`;
    clone.style.height = `${targetRect.height}px`;
    clone.style.boxSizing = 'border-box';

    clone.setAttribute(POPUP_STATE_ATTRIBUTE, PopupState.Opened);

    bodyPortal({ node: clone, targetRect, targetNode: target });

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
    targetClone,
  };
}
