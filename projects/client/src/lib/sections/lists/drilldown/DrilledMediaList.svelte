<script lang="ts" generics="T extends { key: string }, M">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import type { DrilledMediaListProps } from "./MediaListProps";

  const {
    type,
    filter,
    empty: externalEmpty,
    useList,
    actions,
    cardOrientation = "portrait",
    id,
    listActions,
    ...props
  }: DrilledMediaListProps<T, M> = $props();
</script>

<PaginatedList {type} {filter} {useList}>
  {#snippet items(items, isLoading)}
    <GridList
      {...props}
      {id}
      {actions}
      {items}
      {listActions}
      sizing="auto"
      --width-item="var(--width-summary-card)"
    >
      {#snippet empty()}
        {#if !isLoading}
          {@render externalEmpty?.()}
        {/if}
      {/snippet}
    </GridList>
  {/snippet}
</PaginatedList>
