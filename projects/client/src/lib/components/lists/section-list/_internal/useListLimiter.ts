import { useVarToPixels } from '$lib/stores/css/useVarToPixels.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { debounce } from '$lib/utils/timing/debounce.ts';
import { time } from '$lib/utils/timing/time.ts';
import { onMount } from 'svelte';
import { get, readable, readonly, writable } from 'svelte/store';
import type { ListVariant } from '../models/ListVariant.ts';
import { getMaxItemCount } from './getMaxItemCount.ts';

type UseListLimiterProps = {
  itemCount: number;
  variant: ListVariant;
  list: HTMLElement | null;
};

export function useListLimiter(
  { itemCount, variant, list }: UseListLimiterProps,
) {
  if (variant.type !== 'limit') {
    return readable(itemCount);
  }

  const maxItems = writable(itemCount);
  const gap = useVarToPixels('var(--list-gap)');

  onMount(() => {
    const limitItems = () => {
      if (!list) {
        return;
      }

      maxItems.set(
        getMaxItemCount({
          container: list,
          itemWidth: variant.itemWidth,
          gap: get(gap),
        }),
      );
    };

    limitItems();

    const debouncedLimitItems = debounce(limitItems, time.fps(30));
    const unregister = GlobalEventBus.getInstance().register(
      'resize',
      () => debouncedLimitItems(),
    );

    return () => {
      unregister();
    };
  });

  return readonly(maxItems);
}
