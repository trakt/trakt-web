export function clonePopupTarget(popupTarget: HTMLElement) {
  const targetRect = popupTarget.getBoundingClientRect();
  const targetClone = popupTarget.cloneNode(true) as HTMLElement;

  targetClone.setAttribute('data-popup-state', 'opened');
  targetClone.style.position = 'absolute';
  targetClone.style.left = `${globalThis.window.scrollX + targetRect.left}px`;
  targetClone.style.top = `${globalThis.window.scrollY + targetRect.top}px`;

  targetClone.style.zIndex = 'calc(var(--layer-menu) + 1)';

  return targetClone;
}
