<script lang="ts">
  import type { CalendarNavigationProps } from "../models/CalendarNavigationProps";
  import type { CalendarView } from "../models/CalendarView.ts";
  import CalendarControls from "./CalendarControls.svelte";

  const {
    view,
    onToggleView,
    ...navigationProps
  }: WithRequired<CalendarNavigationProps, "navigation"> & {
    view: CalendarView;
    onToggleView: () => void;
  } = $props();
</script>

<div class="calendar-header">
  <CalendarControls {...navigationProps} {view} {onToggleView} />
</div>

<style>
  .calendar-header {
    height: var(--ni-40);
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
