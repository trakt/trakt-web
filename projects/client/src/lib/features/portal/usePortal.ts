import { POPUP_STATE_ATTRIBUTE } from '$lib/features/portal/_internal/constants.ts';
import { PopupState } from '$lib/features/portal/_internal/models/PopupState.ts';
import { openPopupContainer } from '$lib/features/portal/_internal/openPopupContainer.ts';
import { usePopupHelpers } from '$lib/features/portal/_internal/usePopupHelpers.ts';
import { clickOutside } from '$lib/utils/actions/clickOutside.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { onMount } from 'svelte';
import { derived, get, readable, writable } from 'svelte/store';
import { isTargetContained } from './_internal/isTargetContained.ts';
import type { PopupPlacement } from './_internal/models/PopupPlacement.ts';

type PortalProps = {
  disabled?: boolean;
  placement?: PopupPlacement;
  type?: 'default' | 'persistent';
};

const DEFAULT_PLACEMENT: PopupPlacement = {
  position: 'left',
  mode: 'contain',
};

export function usePortal(props?: PortalProps) {
  if (props?.disabled) {
    return {
      portalTrigger: () => ({
        destroy: NOOP_FN,
      }),
      portal: () => ({
        destroy: NOOP_FN,
      }),
      isOpened: readable(false),
      close: NOOP_FN,
    };
  }

  const popupContainer = writable<HTMLElement | null>(null);
  const popupTarget = writable<HTMLElement | null>(null);
  const isPopupOpen = writable(false);

  const { addHelpers, removeHelpers, targetClone } = usePopupHelpers();

  const closeHandler = () => {
    get(popupTarget)?.removeAttribute(POPUP_STATE_ATTRIBUTE);
    removeHelpers(get(popupContainer));
    popupTarget.set(null);
    isPopupOpen.set(false);
  };
  const openHandler = (target: HTMLElement) => {
    popupTarget.set(target);
    target.setAttribute(POPUP_STATE_ATTRIBUTE, PopupState.Opened);
    addHelpers(target);
    isPopupOpen.set(true);
  };

  const portalTrigger = (targetNode: HTMLElement) => {
    const closeAroundTarget = (event: Event) => {
      const isPersistent = props?.type === 'persistent';
      if (isPersistent && isTargetContained(get(popupContainer), event)) {
        return;
      }

      closeHandler();
    };
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
        get(popupContainer)?.remove();
      },
    };
  };

  const portal = (node: HTMLElement) => {
    const target = get(targetClone);
    if (!target || !get(isPopupOpen)) {
      return;
    }

    popupContainer.set(node);
    return openPopupContainer(
      node,
      target,
      props?.placement ?? DEFAULT_PLACEMENT,
    );
  };

  return {
    portalTrigger,
    portal,
    isOpened: derived(isPopupOpen, ($isOpened) => $isOpened),
    close: closeHandler,
  };
}
