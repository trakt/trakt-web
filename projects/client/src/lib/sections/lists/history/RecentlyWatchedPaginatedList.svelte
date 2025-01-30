<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  type RecentlyWatchedPaginatedListProps = {
    title: string;
    type: "movie" | "episode";
  };

  const { title, type }: RecentlyWatchedPaginatedListProps = $props();
  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-watchlist-${type}"
  {title}
  {type}
  useList={useRecentlyWatchedList}
  urlBuilder={UrlBuilder.history}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} {style} />
  {/snippet}
</DrilledMediaList>
