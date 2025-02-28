import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { derived, readable } from 'svelte/store';
import type { LimitStore } from '../drilldown/LimitStore.ts';
import type { PaginatableStore } from '../drilldown/PaginatableStore.ts';

export const toInMemoryPaginatable = <T>(params: {
  useList: LimitStore<T>;
  type: MediaType;
  total: number;
}): PaginatableStore<T> => {
  const { total, type, useList } = params;

  const { list: store, isLoading } = useList({ type, limit: total });

  return ({ page, limit }) => {
    const from = (page - 1) * limit;
    const to = page * limit;

    const list = derived(
      store,
      ($store) => $store.slice(from, Math.min(to, total)),
    );

    return {
      list,
      isLoading,
      page: readable({ page, total: Math.ceil(total / limit) }),
    };
  };
};
