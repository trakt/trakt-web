<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { isToday } from "date-fns/isToday";

  const {
    onNext,
    onPrevious,
    onReset,
    activeDate,
  }: {
    onNext: () => void;
    onPrevious: () => void;
    onReset: () => void;
    activeDate: Date;
  } = $props();
</script>

<div class="calendar-controls">
  <ActionButton
    label={m.button_label_previous_calendar_period()}
    onclick={onPrevious}
    style="ghost"
  >
    <CaretLeftIcon />
  </ActionButton>

  <Button
    color="custom"
    size="small"
    label={m.button_label_reset_calendar_period()}
    disabled={isToday(activeDate)}
    onclick={onReset}
    --color-background-custom="transparent"
    --color-foreground-custom="var(--color-foreground)"
  >
    {m.button_text_reset_calendar_period()}
  </Button>

  <ActionButton
    label={m.button_label_next_calendar_period()}
    onclick={onNext}
    style="ghost"
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
