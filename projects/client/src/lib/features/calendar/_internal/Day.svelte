<script lang="ts" generics="T extends { key: string }">
  import { getLocale, languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { isBefore } from "date-fns/isBefore";
  import { startOfDay } from "date-fns/startOfDay";
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
  const isPast = $derived(isBefore(day.date, startOfDay(new Date())));

  const scrollToDay = () => {
    const key = dateKey(day.date);
    const dayElement = document.getElementById(key);
    if (!dayElement) return;

    dayElement.scrollIntoView({ block: "start", behavior: "smooth" });
  };
</script>

<button
  class="trakt-calendar-day-button"
  aria-label={m.button_label_go_to_calendar_day({
    day: toHumanDay({ date: day.date, locale: getLocale() }),
  })}
  class:has-items={itemCount > 0}
  class:is-active={isActiveDate}
  class:is-past={isPast}
  onclick={scrollToDay}
>
  <span class="day-cell">
    <span class="day-of-month">{day.date.getDate()}</span>
    <span class="month">{toHumanMonth(day.date, languageTag(), "short")}</span>
  </span>

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
    gap: var(--gap-xs);

    min-width: var(--ni-44);
    box-sizing: border-box;
  }

  .day-cell {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    padding: var(--ni-4) var(--ni-2);
    box-sizing: border-box;

    border: var(--border-thickness-xxs) solid transparent;
    border-radius: var(--ni-10);

    color: var(--color-text-secondary);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, border-color, color;

    .day-of-month,
    .month {
      font-size: var(--font-size-text);
      line-height: var(--ni-24);
      letter-spacing: 0.025em;
    }

    .day-of-month {
      font-weight: 600;
    }
  }

  .trakt-calendar-day-button:not(.has-items) {
    pointer-events: none;

    .day-cell {
      opacity: 0.6;
    }
  }

  .trakt-calendar-day-button.is-active .day-cell {
    background-color: var(--purple-900);
    border-color: var(--purple-700);
    color: var(--shade-10);
  }

  .trakt-calendar-day-button.is-past {
    opacity: 0.3;
  }

  @include for-mouse {
    .trakt-calendar-day-button.has-items:not(.is-active):hover {
      cursor: pointer;

      .day-cell {
        background-color: color-mix(
          in srgb,
          var(--purple-900) 35%,
          transparent
        );
        color: var(--shade-10);
      }
    }
  }
</style>
