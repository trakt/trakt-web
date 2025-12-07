<script lang="ts" generics="T extends { key: string }, M">
  import LoadingIndicator from "$lib/sections/lists/drilldown/_internal/LoadingIndicator.svelte";
  import { useLazyLoader } from "$lib/sections/lists/drilldown/_internal/useLazyLoader";
  import { DEFAULT_DRILL_SIZE } from "$lib/utils/constants";
  import type { PaginatedListProps } from "./models/PaginatedListProps";

  const { useList, type, filter, items }: PaginatedListProps<T, M> = $props();

  const { list, hasNextPage, isLoading, fetchNextPage } = $derived(
    useList({
      type,
      filter,
      limit: DEFAULT_DRILL_SIZE,
    }),
  );

  const loadMore = () => {
    if ($hasNextPage && !$isLoading) {
      $fetchNextPage();
    }
  };

  const { observeDimension } = $derived(useLazyLoader({ loadMore }));
</script>

<div use:observeDimension>
  {@render items($list)}
</div>

{#if $isLoading}
  <LoadingIndicator />
{/if}
