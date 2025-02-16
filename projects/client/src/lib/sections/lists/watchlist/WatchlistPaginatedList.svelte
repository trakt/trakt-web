<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import MediaCard from "../components/MediaCard.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { statusToStore } from "./statusToStore";
  import type { WatchlistStatus } from "./WatchlistStatus";

  type WatchListProps = {
    title: string;
    type: MediaType;
    status: WatchlistStatus;
  };

  const { title, type, status }: WatchListProps = $props();
  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
  const useList = $derived.by(() => statusToStore(status));
</script>

<DrilledMediaList
  id="view-all-watchlist-${type}"
  {title}
  {type}
  {useList}
  urlBuilder={UrlBuilder.watchlistPage}
>
  {#snippet item(media)}
    <MediaCard {type} {media} {style} />
  {/snippet}
</DrilledMediaList>
