<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useWatchList } from "./useWatchList";

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
    <DefaultMediaItem type={media.type} {media} {style} source="watchlist" />
  {/snippet}
</DrilledMediaList>
