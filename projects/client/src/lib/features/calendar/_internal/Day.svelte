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
  onclick={scrollToDay}
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
      pointer-events: none;

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
