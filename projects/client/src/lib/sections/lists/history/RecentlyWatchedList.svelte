<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import MediaList from "../drilldown/MediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  type RecentlyWatchedListProps = {
    title: string;
    slug: string;
    mode: DiscoverMode;
  };

  const { title, slug, mode }: RecentlyWatchedListProps = $props();

  // FIXME: add drill down support
</script>

<MediaList
  {title}
  id={`recently-watched-list-${slug}`}
  type="episode"
  useList={({ limit }: { limit: number }) =>
    useRecentlyWatchedList({
      type: mode,
      limit,
      slug,
    })}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} />
  {/snippet}
</MediaList>
