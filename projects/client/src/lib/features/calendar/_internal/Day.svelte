<script lang="ts" generics="T extends { key: string }">
  import { getLocale, languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { toHumanDayOfWeek } from "$lib/utils/formatting/date/toHumanDayOfWeek";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import ContentIndicator from "./ContentIndicator.svelte";
  import { dateKey } from "./dateKey";

  const {
    day,
    isActiveDate,
  }: {
    day: { date: Date; items: T[] };
    isActiveDate: boolean;
  } = $props();

  const itemCount = $derived(day.items.length);

  // TODO disable on empty days
</script>

<svelte:element
  this={itemCount > 0 ? "a" : "div"}
  href={itemCount > 0 ? `#${dateKey(day.date)}` : undefined}
  class="trakt-calendar-day-button"
  aria-label={m.button_label_go_to_calendar_day({
    day: toHumanDay(day.date, getLocale()),
  })}
  class:has-items={itemCount > 0}
  class:is-active={isActiveDate}
>
  <span>
    {toHumanMonth(day.date, languageTag(), "short")}
  </span>
  <span class="bold">{day.date.getDate()}</span>
  <span>{toHumanDayOfWeek(day.date, getLocale())}</span>

  <ContentIndicator {itemCount} />
</svelte:element>

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
      &.has-items:not(.is-active):hover {
        cursor: pointer;
        background-color: var(--color-calendar-background-hover);
      }
    }
  }
</style>
