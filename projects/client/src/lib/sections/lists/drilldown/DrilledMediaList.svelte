<script lang="ts" generics="T extends { key: string }, M">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import type { Snippet } from "svelte";
  import { mediaCardWidthResolver } from "../utils/mediaCardWidthResolver";
  import type { MediaListProps } from "./MediaListProps";

  type DrilledMediaListProps = MediaListProps<T, M> & {
    actions?: Snippet<[]>;
    cardOrientation?: "landscape" | "portrait";
    listActions?: Snippet;
  };

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
  }: DrilledMediaListProps = $props();
</script>

<PaginatedList {type} {id} {filter} {useList}>
  {#snippet items(items)}
    <GridList
      {...props}
      {id}
      {actions}
      {items}
      {listActions}
      --width-item={mediaCardWidthResolver(cardOrientation)}
    >
      {#snippet empty()}
        {@render externalEmpty?.()}
      {/snippet}
    </GridList>
  {/snippet}
</PaginatedList>
