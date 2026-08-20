import { SPOILER_CLASS_NAME } from '$lib/features/spoilers/constants.ts';

export function spoilMeAnyway(node: HTMLElement, isDismissible = true) {
  let canDismiss = isDismissible;

  function handleClick(e: MouseEvent) {
    if (!canDismiss || !(e.target instanceof HTMLElement)) {
      return;
    }

    node.classList.remove(SPOILER_CLASS_NAME);
    e.target.classList.remove(SPOILER_CLASS_NAME);
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
