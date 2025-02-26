<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import MediaCard from "../components/MediaCard.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import EmptyWatchlist from "./EmptyWatchlist.svelte";
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

<DrilledMediaList id="view-all-watchlist-${type}" {title} {type} {useList}>
  {#snippet item(media)}
    <MediaCard {type} {media} {style} />
  {/snippet}

  {#snippet empty()}
    <EmptyWatchlist {type} {status} />
  {/snippet}
</DrilledMediaList>
