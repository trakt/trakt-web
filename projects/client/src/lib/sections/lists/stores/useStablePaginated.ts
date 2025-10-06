import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { PaginatableStore } from '$lib/sections/lists/drilldown/PaginatableStore.ts';
import { onMount } from 'svelte';
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

  const { list, set } = useStableArray<T>(compareFn);

  onMount(() => {
    const unsubscribe = unstable.subscribe(set);

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
