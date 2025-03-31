type AlignPopupContainerProps = {
  popupContainer: HTMLElement;
  targetNode: HTMLElement;
  //We pass in the rect also to avoid unnecessary calls to getBoundingClientRect
  targetRect: DOMRect;
};

export function alignPopupContainer(
  { popupContainer, targetNode, targetRect }: AlignPopupContainerProps,
) {
  const popupRect = popupContainer.getBoundingClientRect();

  const alignedLeft = targetRect.right - popupRect.width;
  if (alignedLeft > 0) {
    targetNode.setAttribute('data-popup-direction', 'left');
    popupContainer.style.left = `${alignedLeft}px`;
    return;
  }

  if (popupRect.right > globalThis.window.outerWidth) {
    const unalignedLeft = globalThis.window.outerWidth - popupRect.width;

    targetNode.setAttribute('data-popup-direction', 'unaligned');
    popupContainer.style.left =
      `calc(${unalignedLeft}px - var(--layout-distance-side))`;
  }
}
