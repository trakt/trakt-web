<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import * as m from "$lib/features/i18n/messages";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import { toRecentlyWatchedType } from "./_internal/toRecentlyWatchedType";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  const { mode }: { mode?: DiscoverMode } = $props();

  const historyType = $derived(toRecentlyWatchedType(mode));

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  title={m.list_title_history()}
  id={"view-all-personal-history-list"}
  type="episode"
  cardOrientation="landscape"
  useList={({ limit, page }: { limit: number; page: number }) =>
    useRecentlyWatchedList({
      type: historyType,
      limit,
      page,
      slug: "me",
    })}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} {style} isActionable />
  {/snippet}
</DrilledMediaList>
