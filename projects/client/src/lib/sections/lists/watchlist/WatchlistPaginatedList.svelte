<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import SortValue from "../user/_internal/SortValue.svelte";
  import { useListSorting } from "../user/_internal/useListSorting";
  import ListSortActions from "../user/ListSortActions.svelte";
  import { useWatchList } from "./useWatchList";

  type WatchListProps = {
    title: string;
    type?: DiscoverMode;
  };

  const { title, type }: WatchListProps = $props();

  const { filterMap } = useFilter();

  const { current, update, options, urlBuilder } = $derived(
    useListSorting({ type: "watchlist" }),
  );
</script>

<DrilledMediaList
  id="view-all-watchlist-${type}"
  {title}
  {type}
  filter={$filterMap}
  useList={(params) =>
    useWatchList({
      ...params,
      sortBy: $current.sorting.value,
      sortHow: $current.sortHow,
    })}
>
  {#snippet listActions()}
    <ListSortActions
      {options}
      {urlBuilder}
      current={$current}
      onUpdate={update}
    />
  {/snippet}

  {#snippet item(item)}
    {#snippet sortTag()}
      <SortValue {item} sortBy={$current.sorting.value} />
    {/snippet}

    <DefaultMediaItem
      type={item.type}
      media={item.entry}
      style="summary"
      source="watchlist"
      sortTag={$current.sorting.value ? sortTag : undefined}
    />
  {/snippet}
</DrilledMediaList>
