<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import MediaCard from "../components/MediaCard.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useWatchlistList } from "./useWatchlistList";

  type WatchlistListProps = {
    title: string;
    type: MediaType;
    emptyMessage: string;
  };

  const { title, type, emptyMessage }: WatchlistListProps = $props();
  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-watchlist-${type}"
  {title}
  {type}
  {emptyMessage}
  useList={useWatchlistList}
  urlBuilder={UrlBuilder.watchlistPage}
>
  {#snippet item(media)}
    <MediaCard {type} {media} {style} />
  {/snippet}
</DrilledMediaList>
