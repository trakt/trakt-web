<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { isSameWeek } from "date-fns";
  import { isToday } from "date-fns/isToday";
  import type { CalendarNavigationProps } from "../models/CalendarNavigationProps";
  import type { CalendarView } from "../models/CalendarView.ts";
  import CalendarViewSelector from "./CalendarViewSelector.svelte";

  type CalendarControlsProps = WithRequired<
    CalendarNavigationProps,
    "navigation"
  > & {
    view?: CalendarView;
    onToggleView?: () => void;
  };

  const {
    navigation,
    activeDate,
    maxDate,
    view,
    onToggleView,
  }: CalendarControlsProps = $props();

  const isNextDisabled = $derived(
    maxDate ? isSameWeek(activeDate, maxDate) : false,
  );
</script>

<div class="trakt-calendar-controls">
  <div class="calendar-controls-left">
    <ActionButton
      label={m.button_label_previous_calendar_period()}
      onclick={navigation.onPrevious}
      style="ghost"
    >
      <CaretLeftIcon />
    </ActionButton>

    <ActionButton
      label={m.button_label_next_calendar_period()}
      onclick={navigation.onNext}
      style="ghost"
      disabled={isNextDisabled}
    >
      <CaretRightIcon />
    </ActionButton>
  </div>

  <div class="calendar-controls-right">
    <Button
      color="default"
      label={m.button_label_reset_calendar_period()}
      disabled={isToday(activeDate)}
      onclick={navigation.onReset}
      style="ghost"
    >
      {m.button_text_reset_calendar_period()}
    </Button>

    {#if view && onToggleView}
      <CalendarViewSelector {view} onToggle={onToggleView} />
    {/if}
  </div>
</div>

<style lang="scss">
  .trakt-calendar-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: var(--gap-s);

    width: 100%;
  }

  .calendar-controls-left,
  .calendar-controls-right {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  :global(.trakt-calendar-header[data-variant="bar"]) .trakt-calendar-controls {
    gap: var(--ni-4);

    .calendar-controls-left {
      gap: var(--ni-2);
      padding-inline-end: var(--ni-4);
      border-inline-end: var(--border-thickness-xxs) solid
        var(--color-segmented-track-border);
    }
  }
</style>
