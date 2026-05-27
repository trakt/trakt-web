<script lang="ts">
  import type { Snippet } from "svelte";
  import type { CalendarNavigationProps } from "../models/CalendarNavigationProps";
  import type { CalendarView } from "../models/CalendarView.ts";
  import CalendarControls from "./CalendarControls.svelte";

  type CalendarHeaderProps = WithRequired<
    CalendarNavigationProps,
    "navigation"
  > & {
    actions?: Snippet;
    view?: CalendarView;
    onToggleView?: () => void;
  };

  const { actions, view, onToggleView, ...navigationProps }: CalendarHeaderProps =
    $props();
</script>

<div class="trakt-calendar-header">
  {#if actions}
    <div class="calendar-header-actions">
      {@render actions()}
    </div>
  {/if}
  <CalendarControls {...navigationProps} {view} {onToggleView} />
</div>

<style>
  .trakt-calendar-header {
    height: var(--ni-40);
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .calendar-header-actions {
    display: flex;
    align-items: center;

    margin-inline-end: auto;
  }
</style>
