import { bodyPortal } from '$lib/features/portal/_internal/bodyPortal.ts';
import {
  POPUP_CLONE_ATTRIBUTE,
  POPUP_STATE_ATTRIBUTE,
} from '$lib/features/portal/_internal/constants.ts';
import { createUnderlay } from '$lib/features/portal/_internal/createUnderlay.ts';
import { PopupState } from '$lib/features/portal/_internal/models/PopupState.ts';
import { BehaviorSubject } from 'rxjs';
import { createSanitizedClone } from './createSanitizedClone.ts';
import { getTargetArea } from './getTargetArea.ts';
import type { PopupPlacement } from './models/PopupPlacement.ts';

const clearElement = (element: HTMLElement | null) => {
  element?.remove();
  return null;
};

export function usePopupHelpers(placement?: PopupPlacement) {
  const isTargetContained = placement?.mode === 'contain';
  const underlay = new BehaviorSubject<HTMLElement | null>(null);
  const targetClone = new BehaviorSubject<HTMLElement | null>(null);
  const area = getTargetArea();

  const removeCloneAfterContainer = (popupContainer: HTMLElement) => {
    const element = targetClone.value;
    if (element) {
      element.style.setProperty('pointer-events', 'none');
      element.setAttribute(POPUP_STATE_ATTRIBUTE, PopupState.Removing);
      targetClone.next(element);
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === popupContainer && targetClone.value) {
            clearElement(targetClone.value);
            targetClone.next(null);
            observer.disconnect();
          }
        });
      });
    });

    observer.observe(area.target, { childList: true });
  };

  const removeHelpers = (popupContainer: HTMLElement | null) => {
    clearElement(underlay.value);
    underlay.next(null);

    if (!isTargetContained) {
      return;
    }

    if (!popupContainer) {
      clearElement(targetClone.value);
      targetClone.next(null);
      return;
    }

    removeCloneAfterContainer(popupContainer);
  };

  const addHelpers = (target: HTMLElement) => {
    const newUnderlay = createUnderlay();
    underlay.next(newUnderlay);

    const underlayTarget = document.querySelector('dialog[open]') ??
      document.body;
    underlayTarget.appendChild(newUnderlay);

    if (!isTargetContained) {
      return;
    }

    clearElement(targetClone.value);
    targetClone.next(null);

    const clone = createSanitizedClone(target);
    const targetRect = target.getBoundingClientRect();

    clone.style.width = `${targetRect.width}px`;
    clone.style.height = `${targetRect.height}px`;
    clone.style.boxSizing = 'border-box';

    clone.setAttribute(POPUP_CLONE_ATTRIBUTE, 'true');
    clone.setAttribute(POPUP_STATE_ATTRIBUTE, PopupState.Opened);

    bodyPortal({ node: clone, targetRect, targetNode: target });

    /*
      +1 because the clone should be able to appear
      above the popup container.
    */
    clone.style.zIndex = 'calc(var(--layer-menu) + 1)';
    targetClone.next(clone);
  };

  return {
    addHelpers,
    removeHelpers,
  };
}
