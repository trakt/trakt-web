<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import {
    drawerNavigation,
    Drawers,
  } from "$lib/features/drawers/drawerNavigation";
  import * as m from "$lib/features/i18n/messages";

  const { track } = useTrack(AnalyticsEvent.Drilldown);
  const { buildDrawerLink } = drawerNavigation();
</script>

<ActionButton
  href={buildDrawerLink(Drawers.Calendar)}
  label={m.button_label_calendar()}
  style="ghost"
  onclick={() => track({ source: "calendar" })}
>
  <CalendarIcon />
</ActionButton>
