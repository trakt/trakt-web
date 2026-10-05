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

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

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

  :global(.trakt-calendar-toolbar) .trakt-calendar-header {
    height: var(--ni-40);
    padding-inline: var(--ni-4) 0;
    box-sizing: border-box;
    gap: var(--ni-4);

    border-radius: var(--border-radius-m);
    background-color: var(--color-segmented-track-background);
    backdrop-filter: blur(var(--ni-8));

    .calendar-header-actions:empty {
      display: none;
    }

    .calendar-header-actions {
      margin-inline-end: 0;
      padding-inline-end: var(--ni-4);
      border-inline-end: var(--border-thickness-xxs) solid
        var(--color-segmented-track-border);
    }
  }
</style>
