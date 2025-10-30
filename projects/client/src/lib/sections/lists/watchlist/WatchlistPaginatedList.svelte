<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useWatchList } from "./useWatchList";
  import WatchlistItem from "./WatchlistItem.svelte";

  type WatchListProps = {
    title: string;
    type?: DiscoverMode;
  };

  const { title, type }: WatchListProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
  const { filterMap } = useFilter();
</script>

<DrilledMediaList
  id="view-all-watchlist-${type}"
  {title}
  {type}
  filter={$filterMap}
  useList={useWatchList}
>
  {#snippet item(media)}
    <WatchlistItem type={media.type} {media} {style} />
  {/snippet}
</DrilledMediaList>
