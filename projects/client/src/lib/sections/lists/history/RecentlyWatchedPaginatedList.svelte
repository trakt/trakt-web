<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  type RecentlyWatchedPaginatedListProps = {
    title: string;
  };

  const { title }: RecentlyWatchedPaginatedListProps = $props();
  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-recently-watched-list"
  {title}
  type="episode"
  useList={({ limit }) =>
    useRecentlyWatchedList({
      type: "all",
      limit,
    })}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} {style} />
  {/snippet}
</DrilledMediaList>
