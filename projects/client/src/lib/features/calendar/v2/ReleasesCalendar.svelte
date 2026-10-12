<script lang="ts">
  import type { ReleasesCalendarEntry } from "$lib/requests/queries/calendars/releasesCalendarQuery";
  import { useReleasesCalendar } from "../_internal/useReleasesCalendar";
  import ReleasesCalendarItem from "../ReleasesCalendarItem.svelte";
  import CalendarExperience from "./_internal/CalendarExperience.svelte";
</script>

{#snippet item(media: ReleasesCalendarEntry)}
  <ReleasesCalendarItem item={media} variant="summary" />
{/snippet}

<CalendarExperience
  useSource={useReleasesCalendar}
  sourceKey="releases"
  {item}
/>
