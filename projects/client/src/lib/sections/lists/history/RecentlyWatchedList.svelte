<script lang="ts">
  import MediaList from "../drilldown/MediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  type RecentlyWatchedListProps = {
    title: string;
    slug: string;
  };

  const { title, slug }: RecentlyWatchedListProps = $props();

  // FIXME: add drill down support
</script>

<MediaList
  {title}
  id={`recently-watched-list-${slug}`}
  type="episode"
  useList={() =>
    useRecentlyWatchedList({
      type: "all",
      slug,
    })}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} />
  {/snippet}
</MediaList>
