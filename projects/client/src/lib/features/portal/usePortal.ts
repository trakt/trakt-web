import { POPUP_STATE_ATTRIBUTE } from '$lib/features/portal/_internal/constants.ts';
import { PopupState } from '$lib/features/portal/_internal/models/PopupState.ts';
import { openPopupContainer } from '$lib/features/portal/_internal/openPopupContainer.ts';
import { usePopupHelpers } from '$lib/features/portal/_internal/usePopupHelpers.ts';
import { clickOutside } from '$lib/utils/actions/clickOutside.ts';
import { onMount } from 'svelte';
import { get, readable, writable } from 'svelte/store';

export function usePortal() {
  let popupContainer: HTMLElement | null = null;

  const isPopupOpen = writable(false);
  const { addHelpers, removeHelpers, popupTarget } = usePopupHelpers();

  const closeHandler = (target: HTMLElement) => {
    target.removeAttribute(POPUP_STATE_ATTRIBUTE);
    removeHelpers(popupContainer);
    isPopupOpen.set(false);
  };
  const openHandler = (target: HTMLElement) => {
    target.setAttribute(POPUP_STATE_ATTRIBUTE, PopupState.Opened);
    addHelpers(target);
    isPopupOpen.set(true);
  };

  const portalTrigger = (targetNode: HTMLElement) => {
    const closeAroundTarget = () => closeHandler(targetNode);
    const openAroundTarget = () => openHandler(targetNode);

    onMount(() => {
      clickOutside(targetNode);
      targetNode.addEventListener('clickoutside', closeAroundTarget);
      targetNode.addEventListener('click', openAroundTarget);
    });

    return {
      destroy() {
        targetNode.removeEventListener('clickoutside', closeAroundTarget);
        targetNode.removeEventListener('click', openAroundTarget);
        removeHelpers(null);
        popupContainer?.remove();
      },
    };
  };

  const portal = (node: HTMLElement) => {
    const target = get(popupTarget);
    if (!target || !get(isPopupOpen)) {
      return;
    }

    popupContainer = node;
    return openPopupContainer(node, target);
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
