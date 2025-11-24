<script lang="ts">
  import { getLocale, languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { toHumanDayOfWeek } from "$lib/utils/formatting/date/toHumanDayOfWeek";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { useCalendarPeriod } from "../context/useCalendarPeriod";
  import type { CalendarEntry } from "../models/CalendarEntry";
  import ContentIndicator from "./ContentIndicator.svelte";

  const { day }: { day: CalendarEntry } = $props();

  const { activeDate } = useCalendarPeriod();

  const itemCount = $derived(day.items.length);
  const isActiveDate = $derived(
    day.date.toDateString() === $activeDate.date.toDateString(),
  );
</script>

<button
  class="trakt-calendar-day-button"
  aria-label={m.button_label_go_to_calendar_day({
    day: toHumanDay(day.date, getLocale()),
  })}
  class:has-items={itemCount > 0}
  class:is-active={isActiveDate}
  onclick={() => {
    activeDate.set({ date: day.date, source: "navigation" });
  }}
>
  <span>
    {toHumanMonth(day.date, languageTag(), "short")}
  </span>
  <span class="bold">{day.date.getDate()}</span>
  <span>{toHumanDayOfWeek(day.date, getLocale())}</span>

  <ContentIndicator {itemCount} />
</button>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-calendar-day-button {
    all: unset;
    user-select: none;

    display: flex;
    flex-direction: column;
    align-items: center;

    min-width: var(--ni-44);
    box-sizing: border-box;

    border-radius: var(--border-radius-s);

    transition: background-color var(--transition-increment) ease-in-out;
    background-color: var(--color-calendar-inactive-background);

    padding: var(--ni-8);
    gap: var(--gap-xs);

    &:not(.has-items) {
      span {
        opacity: 0.5;
      }
    }

    &.is-active {
      background-color: var(--color-calendar-active-background);
    }

    @include for-mouse() {
      &:not(.is-active):hover {
        cursor: pointer;
        background-color: var(--color-calendar-background-hover);
      }
    }
  }
</style>
