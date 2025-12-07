import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { InfiniteData } from '@tanstack/svelte-query';

type PaginatedResponse<T> = {
  data?: InfiniteData<Paginatable<T>>;
};

export function mapToEntries<T>(response: PaginatedResponse<T>) {
  return response?.data?.pages.flatMap((page) => page.entries);
}
