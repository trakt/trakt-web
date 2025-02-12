import { SPOILER_CLASS_NAME } from '$lib/features/spoilers/constants.ts';

export function spoilMeAnyway(node: HTMLElement) {
  function handleClick(e: MouseEvent) {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    node.classList.remove(SPOILER_CLASS_NAME);
    e.target.classList.remove(SPOILER_CLASS_NAME);
  }

  node.addEventListener('click', handleClick);

  return {
    destroy() {
      node.removeEventListener('click', handleClick);
    },
  };
}
