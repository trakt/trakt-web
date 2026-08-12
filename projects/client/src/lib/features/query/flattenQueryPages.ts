import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { InfiniteData } from '@tanstack/query-core';

export function flattenQueryPages<T>(
  query: { data?: InfiniteData<Paginatable<T>> },
): T[] {
  return query.data?.pages.flatMap((page) => page.entries) ?? [];
}
