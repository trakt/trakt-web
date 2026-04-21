<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import SortValue from "../user/_internal/SortValue.svelte";
  import type { ListSortProps } from "../user/models/ListSortProps";
  import { useSort } from "../user/useSort";
  import WatchListItem from "./_internal/WatchListItem.svelte";
  import { useWatchList } from "./useWatchList";

  type WatchListProps = {
    type?: DiscoverMode;
    intent?: "default" | "start";
  } & ListSortProps;

  const {
    type,
    sortBy,
    sortHow,
    intent = "default",
  }: WatchListProps = $props();

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
    })}
  groupBy={sort.groupBy}
>
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
