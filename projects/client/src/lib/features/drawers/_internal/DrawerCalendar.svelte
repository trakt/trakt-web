<script lang="ts">
  import { useCalendarPeriod } from "$lib/features/calendar/context/useCalendarPeriod";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";

  const { mode }: { mode: DiscoverMode } = $props();

  const { startDate, endDate, next, previous, reset, activeDate } =
    useCalendarPeriod();
</script>
