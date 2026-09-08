<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  const { slug, mode }: { slug: string; mode: DiscoverMode } = $props();

  // Only my own history rows are actionable - a rating badge on someone else's
  // activity would be showing my rating next to their watch.
  const { isMe } = $derived(useIsMe(slug));
</script>

<DrilledMediaList
  id="recently-watched-list-paginated-{mode}-{slug}"
  type={mode}
  useList={({ limit }: { limit: number }) =>
    useRecentlyWatchedList({
      type: mode,
      limit,
      slug,
    })}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} style="summary" isActionable={$isMe} />
  {/snippet}
</DrilledMediaList>
