<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import HistoryCalendar from "$lib/features/calendar/HistoryCalendar.svelte";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useHistoryCalendar } from "../stores/useHistoryCalendar.ts";
  import { toRecentlyWatchedType } from "./_internal/toRecentlyWatchedType";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  const { mode, syncId }: { mode?: DiscoverMode; syncId?: number } = $props();

  const historyType = $derived(toRecentlyWatchedType(mode));

  const { filterMap } = useFilter();
  const { user } = useUser();

  const sourceKey = $derived(
    `${historyType}:${JSON.stringify($filterMap)}:${syncId}`,
  );

  const useSource = ({ start, days }: { start: Date; days: number }) =>
    useHistoryCalendar({
      start,
      days,
      type: historyType,
      filter: $filterMap,
      syncId,
    });

  const now = new Date();
</script>

<HistoryCalendar
  {useSource}
  {sourceKey}
  layout="list"
  maxDate={now}
  minDate={$user?.joinedAt}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} style="summary" isActionable />
  {/snippet}
</HistoryCalendar>
