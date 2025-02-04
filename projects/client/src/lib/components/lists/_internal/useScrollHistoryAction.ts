import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { useScrollHistory } from './useScrollHistory.ts';

export function useScrollHistoryAction(
  id: string,
  type: 'horizontal' | 'vertical' = 'horizontal',
) {
  const { readScrollState, writeScrollState, event } = useScrollHistory();

  const scrollPosition = writable(0);

  onMount(() => {
    return event.on('restore', () => {
      scrollPosition.set(readScrollState(id));
    });
  });

  function scrollHistory(container: HTMLElement) {
    const handleSnapshot = () => {
      const position = type === 'horizontal'
        ? container.scrollLeft
        : container.scrollTop;
      writeScrollState(id, position);
    };

    const updateScrollPosition = (position: number) => {
      const scrollProp = type === 'horizontal' ? 'scrollLeft' : 'scrollTop';
      container[scrollProp] = position;
    };

    onMount(() => event.on('snapshot', handleSnapshot));

    return {
      destroy: scrollPosition.subscribe(updateScrollPosition),
    };
  }

  return { scrollHistory };
}
