<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import SortValue from "../user/_internal/SortValue.svelte";
  import type { SortBy } from "../user/models/SortBy";
  import type { SortDirection } from "../user/models/SortDirection";
  import { useSort } from "../user/useSort";
  import { useWatchList } from "./useWatchList";

  type WatchListProps = {
    type?: DiscoverMode;
    sortBy?: SortBy;
    sortHow?: SortDirection;
  };

  const { type, sortBy, sortHow }: WatchListProps = $props();

  const { filterMap } = useFilter();
  const sort = $derived(useSort(sortBy));
</script>

<DrilledMediaList
  id="view-all-watchlist-${type}"
  {type}
  filter={$filterMap}
  useList={(params) =>
    useWatchList({
      ...params,
      sortBy,
      sortHow,
    })}
  groupBy={sort.groupBy}
>
  {#snippet item(item)}
    {#snippet sortTag()}
      <SortValue {item} {sortBy} />
    {/snippet}

    <DefaultMediaItem
      type={item.type}
      media={item.entry}
      style="summary"
      source="watchlist"
      sortTag={sort.toTag(sortTag)}
    />
  {/snippet}
</DrilledMediaList>
