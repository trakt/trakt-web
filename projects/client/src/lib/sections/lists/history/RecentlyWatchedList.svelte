<script lang="ts">
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  type RecentlyWatchedListProps = {
    title: string;
    drilldownLabel: string;
  };

  const { title, drilldownLabel }: RecentlyWatchedListProps = $props();
</script>

<DrillableMediaList
  id="recently-watched-list"
  {title}
  {drilldownLabel}
  type="episode"
  useList={({ limit }) =>
    useRecentlyWatchedList({
      type: "all",
      limit,
    })}
  urlBuilder={UrlBuilder.history.all}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} />
  {/snippet}
</DrillableMediaList>
