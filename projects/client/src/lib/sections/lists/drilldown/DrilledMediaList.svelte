<script lang="ts" generics="T extends { key: string }, M">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
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

  const isDesktop = useMedia(WellKnownMediaQuery.desktop);

  const itemWidthVar = $derived.by(() => {
    if ($isDesktop) {
      return cardOrientation === "landscape"
        ? "var(--width-landscape-card)"
        : "var(--width-portrait-card)";
    }

    return "var(--width-summary-card)";
  });

  // TODO: renderforguard instead of itemWidthVar?
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
      --width-item={itemWidthVar}
    >
      {#snippet empty()}
        {#if !isLoading}
          {@render externalEmpty?.()}
        {/if}
      {/snippet}
    </GridList>
  {/snippet}
</PaginatedList>
