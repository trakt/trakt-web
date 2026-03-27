<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  const {
    title,
    slug,
    mode,
  }: { title: string; slug: string; mode: DiscoverMode } = $props();
</script>

<DrilledMediaList
  id="recently-watched-list-paginated-{mode}-{slug}"
  {title}
  type={mode}
  useList={({ limit }: { limit: number }) =>
    useRecentlyWatchedList({
      type: mode,
      limit,
      slug,
    })}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} style="summary" />
  {/snippet}
</DrilledMediaList>
