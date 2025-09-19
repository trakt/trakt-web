<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { track } = useTrack(AnalyticsEvent.Drilldown);
</script>

<ActionButton
  href={UrlBuilder.calendar()}
  label={m.button_label_calendar()}
  style="ghost"
  onclick={() => track({ source: "calendar" })}
>
  <CalendarIcon />
</ActionButton>
