<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import MediaCard from "../components/MediaCard.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { useWatchlistList } from "./useWatchlistList";

  type WatchlistListProps = {
    title: string;
    type: MediaType;
    drilldownLabel: string;
    emptyMessage: string;
  };

  const { title, type, emptyMessage, drilldownLabel }: WatchlistListProps =
    $props();
</script>

<DrillableMediaList
  id="watchlist-list-{type}"
  {title}
  {drilldownLabel}
  {type}
  {emptyMessage}
  useList={useWatchlistList}
  urlBuilder={UrlBuilder.watchlistPage}
>
  {#snippet item(media)}
    <MediaCard {type} {media} />
  {/snippet}
</DrillableMediaList>
