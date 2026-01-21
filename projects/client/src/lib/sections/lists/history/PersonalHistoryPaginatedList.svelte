<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import * as m from "$lib/features/i18n/messages";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import { toRecentlyWatchedType } from "./_internal/toRecentlyWatchedType";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  const { mode }: { mode?: DiscoverMode } = $props();

  const historyType = $derived(toRecentlyWatchedType(mode));
</script>

<DrilledMediaList
  title={m.list_title_history()}
  id={`view-all-personal-history-list-${mode ?? "all"}`}
  type="episode"
  cardOrientation="landscape"
  useList={({ limit }: { limit: number }) =>
    useRecentlyWatchedList({
      type: historyType,
      limit,
      slug: "me",
    })}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} style="summary" isActionable />
  {/snippet}
</DrilledMediaList>
