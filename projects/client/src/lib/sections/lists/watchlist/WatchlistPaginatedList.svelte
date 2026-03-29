<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import SortValue from "../user/_internal/SortValue.svelte";
  import type { SortBy } from "../user/models/SortBy";
  import type { SortDirection } from "../user/models/SortDirection";
  import { useWatchList } from "./useWatchList";

  type WatchListProps = {
    title: string;
    type?: DiscoverMode;
    sortBy?: SortBy;
    sortHow?: SortDirection;
  };

  const { title, type, sortBy, sortHow }: WatchListProps = $props();

  const { filterMap } = useFilter();
</script>

<DrilledMediaList
  id="view-all-watchlist-${type}"
  {title}
  {type}
  filter={$filterMap}
  useList={(params) =>
    useWatchList({
      ...params,
      sortBy,
      sortHow,
    })}
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
      sortTag={sortBy ? sortTag : undefined}
    />
  {/snippet}
</DrilledMediaList>
