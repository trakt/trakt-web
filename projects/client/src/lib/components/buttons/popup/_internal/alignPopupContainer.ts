export function alignPopupContainer(
  popupContainer: HTMLElement,
  targetRect: DOMRect,
) {
  const popupRect = popupContainer.getBoundingClientRect();

  const alignedLeft = targetRect.right - popupRect.width;
  if (alignedLeft > 0) {
    popupContainer.setAttribute('data-popup-direction', 'left');
    popupContainer.style.left = `${alignedLeft}px`;
    return;
  }

  if (popupRect.right > globalThis.window.outerWidth) {
    const unalignedLeft = globalThis.window.outerWidth - popupRect.width;

    popupContainer.setAttribute('data-popup-direction', 'unaligned');
    popupContainer.style.left =
      `calc(${unalignedLeft}px - var(--layout-distance-side))`;
  }
}
