<script lang="ts">
  import type { CalendarEntry } from "../models/CalendarEntry";
  import CalendarSwipe from "./CalendarSwipe.svelte";
  import { dateKey } from "./dateKey";
  import Day from "./Day.svelte";

  const { calendar }: { calendar: CalendarEntry[] } = $props();
</script>

<CalendarSwipe>
  <div class="trakt-calendar-days">
    {#each calendar as day (dateKey(day.date))}
      <Day {day} />
    {/each}
  </div>
</CalendarSwipe>

<style>
  .trakt-calendar-days {
    position: relative;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: var(--gap-micro);

    border-radius: var(--border-radius-s);

    :global(.trakt-calendar-day-button) {
      flex: 1;
    }
  }
</style>
