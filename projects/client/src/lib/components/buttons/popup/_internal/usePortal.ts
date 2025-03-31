import { clonePopupTarget } from '$lib/components/buttons/popup/_internal/clonePopupTarget.ts';
import { clickOutside } from '$lib/utils/actions/clickOutside.ts';
import { onMount } from 'svelte';
import { get, readable, writable } from 'svelte/store';
import { bodyPortal } from './bodyPortal.ts';
import { createUnderlay } from './createUnderlay.ts';

export function usePortal() {
  let popupContainer: HTMLElement | null = null;
  let underlay: HTMLDivElement | null = null;
  let targetClone: HTMLElement | null = null;

  const removeHelpers = () => {
    underlay?.remove();
    targetClone?.remove();
  };

  const isPopupOpen = writable(false);
  const closeHandler = () => {
    removeHelpers();
    isPopupOpen.set(false);
  };
  const openHandler = (target: HTMLElement) => {
    underlay = createUnderlay();
    targetClone = clonePopupTarget(target);

    document.body.appendChild(underlay);
    document.body.appendChild(targetClone);

    isPopupOpen.set(true);
  };

  const portalTrigger = (targetNode: HTMLElement) => {
    const openAroundTarget = () => openHandler(targetNode);

    onMount(() => {
      clickOutside(targetNode);
      targetNode.addEventListener('clickoutside', closeHandler);
      targetNode.addEventListener('click', openAroundTarget);
    });

    return {
      destroy() {
        targetNode.removeEventListener('clickoutside', closeHandler);
        targetNode.removeEventListener('click', openAroundTarget);
        removeHelpers();
        popupContainer?.remove();
      },
    };
  };

  const portal = (node: HTMLElement) => {
    if (!targetClone || !get(isPopupOpen)) {
      return;
    }

    popupContainer = node;

    return bodyPortal(node, targetClone);
  };

  return {
    portalTrigger,
    portal,
    isOpened: readable(get(isPopupOpen), (isOpened) => {
      const unsubscribe = isPopupOpen.subscribe(isOpened);
      return unsubscribe;
    }),
  };
}
