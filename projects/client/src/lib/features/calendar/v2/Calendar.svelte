<script lang="ts">
  import {
    useCalendar,
    type CalendarItem as CalendarItemEntry,
  } from "../_internal/useCalendar";
  import CalendarItem from "../CalendarItem.svelte";
  import CalendarExperience from "./_internal/CalendarExperience.svelte";
</script>

{#snippet item(media: CalendarItemEntry)}
  <CalendarItem item={media} variant="summary" />
{/snippet}

<CalendarExperience useSource={useCalendar} sourceKey="calendar" {item} hasFeed />
