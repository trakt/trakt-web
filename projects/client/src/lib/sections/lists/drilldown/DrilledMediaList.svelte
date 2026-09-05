<script lang="ts" generics="T extends { key: string }, M">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import { useLargeScreenCards } from "$lib/features/large-screen-cards/useLargeScreenCards.ts";
  import { drilldownGrid } from "$lib/sections/lists/utils/drilldownGrid.ts";
  import type { DrilledMediaListProps } from "./MediaListProps";

  const {
    type,
    filter,
    empty: externalEmpty,
    useList,
    actions,
    variant = "portrait",
    id,
    listActions,
    ...props
  }: DrilledMediaListProps<T, M> = $props();

  const isLargeScreenCards = useLargeScreenCards();
  const grid = $derived(drilldownGrid($isLargeScreenCards, variant));
</script>

<PaginatedList {type} {filter} {useList}>
  {#snippet items(items, isLoading)}
    <GridList
      {...props}
      {id}
      {actions}
      {items}
      {listActions}
      sizing={grid.sizing}
      --width-item={grid.itemWidth}
    >
      {#snippet empty()}
        {#if !isLoading}
          {@render externalEmpty?.()}
        {/if}
      {/snippet}
    </GridList>
  {/snippet}
</PaginatedList>
