<script lang="ts">
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import SortValue from "../user/_internal/SortValue.svelte";
  import type { ListSortProps } from "../user/models/ListSortProps";
  import { useSort } from "../user/useSort";
  import WatchListItem from "./_internal/WatchListItem.svelte";
  import { useWatchList } from "./useWatchList";

  type WatchListProps = {
    type?: DiscoverMode;
    intent?: "default" | "start";
    searchTerm?: string | Nil;
  } & ListSortProps;

  const {
    type,
    sortBy,
    sortHow,
    intent = "default",
    searchTerm,
  }: WatchListProps = $props();

  const terms = $derived(searchTerm?.trim() || undefined);

  const { filterMap } = useFilter();
  const sort = $derived(useSort(sortBy));
</script>

<DrilledMediaList
  id="view-all-watchlist-${type}-${intent}"
  {type}
  filter={$filterMap}
  useList={(params) =>
    useWatchList({
      ...params,
      intent,
      sortBy,
      sortHow,
      terms,
    })}
  groupBy={sort.groupBy}
>
  {#snippet empty()}
    {#if terms}
      <p class="secondary">{m.list_placeholder_no_matching_list_items()}</p>
    {/if}
  {/snippet}

  {#snippet item(item)}
    {#snippet sortTag()}
      <SortValue {item} {sortBy} />
    {/snippet}

    <WatchListItem
      type={item.type}
      media={item.entry}
      sortTag={sort.toTag(sortTag)}
      {intent}
      style="summary"
    />
  {/snippet}
</DrilledMediaList>
