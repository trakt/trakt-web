<script lang="ts">
  import type { CalendarNavigationProps } from "../../models/CalendarNavigationProps";
  import type { CalendarView } from "../models/CalendarView.ts";
  import CalendarControls from "./CalendarControls.svelte";

  type CalendarHeaderProps = WithRequired<
    CalendarNavigationProps,
    "navigation"
  > & {
    view?: CalendarView;
    onToggleView?: () => void;
    variant?: "plain" | "bar";
  };

  const {
    view,
    onToggleView,
    variant = "plain",
    ...navigationProps
  }: CalendarHeaderProps = $props();
</script>

<div class="trakt-calendar-header" data-variant={variant}>
  <CalendarControls {...navigationProps} {view} {onToggleView} />
</div>

<style lang="scss">
  .trakt-calendar-header {
    height: var(--ni-40);
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .trakt-calendar-header[data-variant="bar"] {
    padding-inline: var(--ni-4) 0;
    box-sizing: border-box;
    gap: var(--ni-4);

    border-radius: var(--border-radius-m);
    background-color: var(--color-segmented-track-background);
    backdrop-filter: blur(var(--ni-8));
  }
</style>
