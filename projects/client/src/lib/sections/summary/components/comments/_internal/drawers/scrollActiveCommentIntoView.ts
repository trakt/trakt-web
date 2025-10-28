import { debounce } from '$lib/utils/timing/debounce.ts';
import { time } from '$lib/utils/timing/time.ts';
import { onMount } from 'svelte';

export function scrollActiveCommentIntoView(
  node: HTMLElement,
  isActiveComment: boolean,
) {
  const debouncedScroll = debounce(() => {
    if (node.offsetHeight > 0) {
      node.scrollIntoView({ behavior: 'smooth' });
    }
  }, time.fps(30));

  const update = (isActive: boolean) => {
    if (!isActive) {
      return;
    }

    if (node.offsetHeight > 0) {
      node.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    debouncedScroll();
  };

  onMount(() => update(isActiveComment));
  return { update };
}
