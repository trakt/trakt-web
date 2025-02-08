import { clickOutside } from '$lib/utils/actions/clickOutside.ts';
import { onMount } from 'svelte';
import { get, readable, writable } from 'svelte/store';
import { bodyPortal } from './bodyPortal.ts';

export function usePortal() {
  let popupTarget: HTMLElement | null = null;
  let popupContainer: HTMLElement | null = null;

  const isPopupOpen = writable(false);
  const closeHandler = () => isPopupOpen.set(false);
  const openHandler = () => isPopupOpen.set(true);

  const portalTrigger = (targetNode: HTMLElement) => {
    onMount(() => {
      popupTarget = targetNode;
      clickOutside(targetNode);
      targetNode.addEventListener('clickoutside', closeHandler);
      targetNode.addEventListener('click', openHandler);
    });

    return {
      destroy() {
        targetNode.removeEventListener('clickoutside', closeHandler);
        targetNode.removeEventListener('click', openHandler);
        popupContainer?.remove();
      },
    };
  };

  const portal = (node: HTMLElement) => {
    if (!popupTarget || !get(isPopupOpen)) {
      return;
    }

    popupContainer = node;

    return bodyPortal(node, popupTarget);
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
