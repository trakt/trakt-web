<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { isSameWeek } from "date-fns";
  import { isToday } from "date-fns/isToday";
  import type { CalendarNavigationProps } from "../models/CalendarNavigationProps";

  type CalendarControlsProps = WithRequired<
    CalendarNavigationProps,
    "navigation"
  >;

  const { navigation, activeDate, maxDate }: CalendarControlsProps = $props();

  const isNextDisabled = $derived(
    maxDate ? isSameWeek(activeDate, maxDate) : false,
  );
</script>

<div class="calendar-controls">
  <ActionButton
    label={m.button_label_previous_calendar_period()}
    onclick={navigation.onPrevious}
    style="ghost"
  >
    <CaretLeftIcon />
  </ActionButton>

  <Button
    color="default"
    label={m.button_label_reset_calendar_period()}
    disabled={isToday(activeDate)}
    onclick={navigation.onReset}
    style="ghost"
  >
    {m.button_text_reset_calendar_period()}
  </Button>

  <ActionButton
    label={m.button_label_next_calendar_period()}
    onclick={navigation.onNext}
    style="ghost"
    disabled={isNextDisabled}
  >
    <CaretRightIcon />
  </ActionButton>
</div>

<style>
  .calendar-controls {
    display: flex;
    align-items: center;

    gap: var(--gap-xs);
  }
</style>
