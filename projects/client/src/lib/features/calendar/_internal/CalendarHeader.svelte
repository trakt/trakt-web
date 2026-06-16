<script lang="ts">
  import type { CalendarNavigationProps } from "../models/CalendarNavigationProps";
  import CalendarControls from "./CalendarControls.svelte";

  const navigationProps: WithRequired<CalendarNavigationProps, "navigation"> =
    $props();
</script>

<div class="trakt-calendar-header">
  <CalendarControls {...navigationProps} />
</div>

<style>
  .trakt-calendar-header {
    height: var(--ni-40);
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
