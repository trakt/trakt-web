import { openPopupContainer } from '$lib/features/portal/_internal/openPopupContainer.ts';
import { usePopupHelpers } from '$lib/features/portal/_internal/usePopupHelpers.ts';
import { clickOutside } from '$lib/utils/actions/clickOutside.ts';
import { onMount } from 'svelte';
import { get, readable, writable } from 'svelte/store';

export function usePortal() {
  let popupContainer: HTMLElement | null = null;

  const isPopupOpen = writable(false);
  const { addHelpers, removeHelpers, popupTarget } = usePopupHelpers();

  const closeHandler = () => {
    removeHelpers();
    isPopupOpen.set(false);
  };
  const openHandler = (target: HTMLElement) => {
    addHelpers(target);
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
