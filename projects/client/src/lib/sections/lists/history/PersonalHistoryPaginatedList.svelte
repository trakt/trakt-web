<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import {
    addDays,
    useRecentlyWatchedList,
  } from "../stores/useRecentlyWatchedList";
  import HistoryCalendar from "./_internal/HistoryCalendar.svelte";
  import { toRecentlyWatchedType } from "./_internal/toRecentlyWatchedType";

  const { mode }: { mode?: DiscoverMode } = $props();

  const now = new Date();
  const then = addDays(now, -30);

  const historyType = $derived(toRecentlyWatchedType(mode));

  // TODO pass in mode directly?
  const { historyCalendarItems, isLoading } = $derived(
    useRecentlyWatchedList({
      type: historyType,
      slug: "me",
      startDate: then,
      endDate: now,
    }),
  );
</script>

{#if $isLoading}
  <LoadingIndicator />
{:else}
  <HistoryCalendar calendar={$historyCalendarItems} />
{/if}
<!-- <DrilledMediaList
  title={m.list_title_history()}
  id={`view-all-personal-history-list-${mode ?? "all"}`}
  type="episode"
  cardOrientation="landscape"
  useList={() =>
    useRecentlyWatchedList({
      type: historyType,
      slug: "me",
      startDate: then,
      endDate: now,
    })}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} style="summary" isActionable />
  {/snippet}
</DrilledMediaList> -->
