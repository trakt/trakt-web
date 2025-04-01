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
    target.removeAttribute('data-popup-state');
    removeHelpers(popupContainer);
    isPopupOpen.set(false);
  };
  const openHandler = (target: HTMLElement) => {
    target.setAttribute('data-popup-state', 'opened');
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
