import { SPOILER_CLASS_NAME } from '$lib/features/spoilers/constants.ts';

export function spoilMeAnyway(node: HTMLElement, isDismissible = true) {
  let canDismiss = isDismissible;

  function handleClick(e: MouseEvent) {
    if (!canDismiss || !(e.target instanceof HTMLElement)) {
      return;
    }

    const { target } = e;
    const isHidden = node.classList.contains(SPOILER_CLASS_NAME) ||
      target.classList.contains(SPOILER_CLASS_NAME);

    if (!isHidden) {
      return;
    }

    e.preventDefault();

    node.classList.remove(SPOILER_CLASS_NAME);
    target.classList.remove(SPOILER_CLASS_NAME);
  }

  node.addEventListener('click', handleClick);

  return {
    update(next = true) {
      canDismiss = next;
    },
    destroy() {
      node.removeEventListener('click', handleClick);
    },
  };
}
