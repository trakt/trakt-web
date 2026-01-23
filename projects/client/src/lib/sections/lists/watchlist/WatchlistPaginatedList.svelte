<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useListSorting } from "../user/_internal/useListSorting";
  import ListSortActions from "../user/ListSortActions.svelte";
  import { useWatchList } from "./useWatchList";

  type WatchListProps = {
    title: string;
    type?: DiscoverMode;
  };

  const { title, type }: WatchListProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
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

  {#snippet item(media)}
    <DefaultMediaItem type={media.type} {media} {style} source="watchlist" />
  {/snippet}
</DrilledMediaList>
