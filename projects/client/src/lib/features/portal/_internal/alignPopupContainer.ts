import { POPUP_DIRECTION_ATTRIBUTE } from '$lib/features/portal/_internal/constants.ts';
import { PopupDirection } from '$lib/features/portal/_internal/models/PopupDirection.ts';

type AlignPopupContainerProps = {
  popupContainer: HTMLElement;
  targetNode: HTMLElement;
  //We pass in the rect also to avoid unnecessary calls to getBoundingClientRect
  targetRect: DOMRect;
};

export function alignPopupContainer(
  { popupContainer, targetNode, targetRect }: AlignPopupContainerProps,
) {
  const setDirection = (direction: PopupDirection) => {
    targetNode.setAttribute(POPUP_DIRECTION_ATTRIBUTE, direction);
    popupContainer.setAttribute(POPUP_DIRECTION_ATTRIBUTE, direction);
  };

  const popupRect = popupContainer.getBoundingClientRect();

  setDirection(PopupDirection.Right);

  const alignedLeft = targetRect.right - popupRect.width;
  if (alignedLeft > 0) {
    setDirection(PopupDirection.Left);
    popupContainer.style.left = `${alignedLeft}px`;
    return;
  }

  if (popupRect.right > globalThis.window.innerWidth) {
    const unalignedLeft = globalThis.window.innerWidth - popupRect.width;

    setDirection(PopupDirection.Unaligned);
    popupContainer.style.left =
      `calc(${unalignedLeft}px - var(--layout-distance-side))`;
  }
}
