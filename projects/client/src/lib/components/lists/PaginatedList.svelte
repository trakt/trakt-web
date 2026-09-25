<script lang="ts" generics="T extends { key: string }, M">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { useLazyLoader } from "$lib/sections/lists/drilldown/_internal/useLazyLoader";
  import { DEFAULT_DRILL_SIZE } from "$lib/utils/constants";
  import { of } from "rxjs";
  import type { PaginatedListProps } from "./models/PaginatedListProps";

  const {
    useList,
    type,
    filter,
    items,
    target = "default",
  }: PaginatedListProps<T, M> = $props();

  const noError = of(false);

  const {
    list,
    hasNextPage,
    isLoading,
    isError = noError,
    fetchNextPage,
  } = $derived(
    useList({
      type,
      filter,
      limit: DEFAULT_DRILL_SIZE,
    }),
  );

  const loadMore = () => {
    if ($hasNextPage && !$isLoading) {
      fetchNextPage();
    }
  };

  let listElement = $state<HTMLDivElement | null>(null);
  const parentElement = $derived<HTMLElement | Nil>(
    target === "parent" ? listElement?.parentElement : null,
  );

  const { observeDimension } = $derived(
    useLazyLoader({ loadMore, parent: parentElement }),
  );
</script>

<div bind:this={listElement} use:observeDimension class="trakt-paginated-list">
  {@render items($list, $isLoading, $isError)}
</div>

{#if $isLoading}
  <LoadingIndicator />
{/if}
