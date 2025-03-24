import { onMount } from 'svelte';

export function scrollActiveCommentIntoView(
  node: HTMLElement,
  isActiveComment: boolean,
) {
  const update = (isActive: boolean) => {
    isActive &&
      node.scrollIntoView({ behavior: 'instant', inline: 'center' });
  };

  onMount(() => update(isActiveComment));
  return { update };
}
