import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { weave } from '$lib/utils/array/weave.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export function usePaginatedListQueries<TOutput, TError extends Error>(
  queries: Array<CreateQueryOptions<Paginatable<TOutput>, TError>>,
) {
  const paginatedQueries = queries.map((query) => usePaginatedListQuery(query));

  const isLoading = derived(
    paginatedQueries.map((q) => q.isLoading),
    ($loadingStates) => $loadingStates.some((loading) => loading),
  );

  const page = derived(
    paginatedQueries.map((q) => q.page),
    ($pages) => assertDefined($pages.at(0)),
  );

  const list = derived(
    paginatedQueries.map((q) => q.list),
    ($lists) =>
      $lists.length === 1 ? assertDefined($lists.at(0)) : weave(...$lists),
  );

  return {
    list,
    page,
    isLoading,
  };
}
