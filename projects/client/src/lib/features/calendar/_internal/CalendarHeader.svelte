<script lang="ts">
  import type { CalendarNavigationProps } from "../models/CalendarNavigationProps";
  import CalendarControls from "./CalendarControls.svelte";

  const navigationProps: WithRequired<CalendarNavigationProps, "navigation"> =
    $props();
</script>

<div class="calendar-header">
  <CalendarControls {...navigationProps} />
</div>

<style>
  .calendar-header {
    height: var(--ni-40);
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
