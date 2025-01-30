<script lang="ts">
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  type RecentlyWatchedListProps = {
    title: string;
    type: "movie" | "episode";
    drilldownLabel: string;
  };

  const { title, type, drilldownLabel }: RecentlyWatchedListProps = $props();
</script>

<DrillableMediaList
  id="recently-watched-list-{type}"
  {title}
  {drilldownLabel}
  {type}
  useList={useRecentlyWatchedList}
  urlBuilder={UrlBuilder.history}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} />
  {/snippet}
</DrillableMediaList>
