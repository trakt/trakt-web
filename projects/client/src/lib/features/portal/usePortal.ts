import { POPUP_STATE_ATTRIBUTE } from '$lib/features/portal/_internal/constants.ts';
import { PopupState } from '$lib/features/portal/_internal/models/PopupState.ts';
import { openPopupContainer } from '$lib/features/portal/_internal/openPopupContainer.ts';
import { usePopupHelpers } from '$lib/features/portal/_internal/usePopupHelpers.ts';
import { clickOutside } from '$lib/utils/actions/clickOutside.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { BehaviorSubject } from 'rxjs';
import { onMount } from 'svelte';
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
      isOpened: new BehaviorSubject(false),
      close: NOOP_FN,
    };
  }

  const placement = props?.placement ?? DEFAULT_PLACEMENT;

  const popupContainer = new BehaviorSubject<HTMLElement | null>(null);
  const popupTarget = new BehaviorSubject<HTMLElement | null>(null);
  const isPopupOpen = new BehaviorSubject(false);

  const { addHelpers, removeHelpers } = usePopupHelpers(placement);

  const closeHandler = () => {
    popupTarget.value?.removeAttribute(POPUP_STATE_ATTRIBUTE);
    removeHelpers(popupContainer.value);
    popupTarget.next(null);
    isPopupOpen.next(false);
  };
  const openHandler = (target: HTMLElement) => {
    popupTarget.next(target);
    target.setAttribute(POPUP_STATE_ATTRIBUTE, PopupState.Opened);
    addHelpers(target);
    isPopupOpen.next(true);
  };

  const portalTrigger = (targetNode: HTMLElement) => {
    const closeAroundTarget = (event: Event) => {
      const isPersistent = props?.type === 'persistent';
      if (isPersistent && isTargetContained(popupContainer.value, event)) {
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
        popupContainer.value?.remove();
      },
    };
  };

  const portal = (node: HTMLElement) => {
    const target = popupTarget.value;
    if (!target || !isPopupOpen.value) {
      return;
    }

    popupContainer.next(node);
    return openPopupContainer(
      node,
      target,
      placement,
    );
  };

  return {
    portalTrigger,
    portal,
    isOpened: isPopupOpen.asObservable(),
    close: closeHandler,
  };
}
