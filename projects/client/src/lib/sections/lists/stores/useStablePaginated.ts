import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { PaginatableStore } from '$lib/sections/lists/drilldown/PaginatableStore.ts';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { FeatureFlag } from '../../../features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '../../../features/feature-flag/useFeatureFlag.ts';
import { useStableArray } from './useStableArray.ts';

export type StablePaginatedStoreProps<T, M> = {
  useList: PaginatableStore<T, M>;
  compareFn: (left: T, right: T) => boolean;
  type: M;
  page: number;
  limit: number;
};
export function useStablePaginated<T, M = MediaType>(
  { useList, compareFn, ...params }: StablePaginatedStoreProps<T, M>,
) {
  const { list: unstable, isLoading, page } = useList(params);
  const { isEnabled } = useFeatureFlag(FeatureFlag.Debug);
  const { list, set } = useStableArray<T>(compareFn);

  onMount(() => {
    const unsubscribe = unstable.subscribe((items) => {
      if (get(isEnabled)) {
        console.debug(
          `[useStablePaginated] New items received for ${params.type}:`,
          items,
        );
      }
      set(items);
    });

    return () => {
      'unsubscribe' in unsubscribe ? unsubscribe.unsubscribe() : unsubscribe();
    };
  });

  return {
    list,
    isLoading,
    page,
  };
}
