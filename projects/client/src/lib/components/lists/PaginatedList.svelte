<script lang="ts" generics="T, M">
  import LoadingIndicator from "$lib/sections/lists/drilldown/_internal/LoadingIndicator.svelte";
  import { useLazyLoader } from "$lib/sections/lists/drilldown/_internal/useLazyLoader";
  import { DEFAULT_DRILL_SIZE } from "$lib/utils/constants";
  import { writable } from "svelte/store";
  import type { PaginatedListProps } from "./models/PaginatedListProps";

  const { id, useList, type, filter, items }: PaginatedListProps<T, M> =
    $props();

  const currentPage = writable(1);
  const loadedPages = writable<Map<number, T[]>>(new Map());
  const initialId = writable(id);

  const { list, page, isLoading } = $derived(
    useList({
      type,
      filter,
      page: $currentPage,
      limit: DEFAULT_DRILL_SIZE,
    }),
  );

  $effect(() => {
    if (id !== $initialId) {
      currentPage.set(1);
      loadedPages.set(new Map());
      initialId.set(id);
    }
  });

  $effect(() => {
    if ($isLoading) {
      return;
    }
    loadedPages.update((pages) => {
      pages.set($page.current ?? 1, $list);
      return pages;
    });
  });

  const loadMore = () => {
    if ($isLoading) {
      return;
    }

    const hasMorePages = ($page?.total ?? 1) > $currentPage;
    const isCurrentPageFetched =
      $loadedPages.get($page?.current ?? 1) !== undefined;

    if (isCurrentPageFetched && hasMorePages) {
      currentPage.update((page) => page + 1);
    }
  };

  const { observeDimension } = $derived(useLazyLoader({ loadMore }));
  const allItems = $derived(Array.from($loadedPages.values()).flat());
</script>

<div class="trakt-paginated-list" use:observeDimension>
  {@render items(allItems)}
</div>

{#if $isLoading}
  <LoadingIndicator />
{/if}
