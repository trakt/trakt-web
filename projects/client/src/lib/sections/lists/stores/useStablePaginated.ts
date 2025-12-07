import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { PaginatableStore } from '$lib/sections/lists/drilldown/PaginatableStore.ts';
import { useStableArray } from './useStableArray.ts';

export type StablePaginatedStoreProps<T, M> = {
  useList: PaginatableStore<T, M>;
  compareFn: (left: T, right: T) => boolean;
  type: M;
  limit: number;
} & FilterParams;

export function useStablePaginated<T, M = MediaType>(
  { useList, compareFn, ...params }: StablePaginatedStoreProps<T, M>,
) {
  const { list: unstable, ...rest } = useList(params);

  const { list } = useStableArray<T>(compareFn, unstable);

  return {
    list,
    ...rest,
  };
}
