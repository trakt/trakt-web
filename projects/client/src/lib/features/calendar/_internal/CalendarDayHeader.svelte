<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { isToday } from "date-fns/isToday";
  import { toCalendarDayParts } from "./toCalendarDayParts.ts";

  const {
    date,
    count,
    variant = "row",
  }: { date: Date; count: number; variant?: "row" | "column" } = $props();

  const parts = $derived(toCalendarDayParts(date, getLocale()));
  const isDateToday = $derived(isToday(date));
  const weekday = $derived.by(() => {
    if (isDateToday) return m.text_calendar_today();
    return variant === "column" ? parts.weekday : parts.weekdayLong;
  });
  const itemCountLabel = $derived(
    count === 1
      ? m.calendar_day_item_count_one({ count })
      : m.calendar_day_item_count_other({ count }),
  );
</script>

<div
  class="trakt-calendar-day-header"
  data-variant={variant}
  class:is-today={isDateToday}
  class:is-empty={count === 0}
>
  {#if variant === "column"}
    <span class="weekday bold ellipsis">{weekday}</span>
    <span class="date secondary no-wrap">{parts.dayOfMonth} {parts.month}</span>
  {:else}
    <span class="weekday bold">{weekday}</span>
    <span class="date secondary">{parts.dayOfMonth} {parts.month}</span>
    <span class="item-count secondary">{itemCountLabel}</span>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-calendar-day-header {
    --color-day-header-accent: var(--color-calendar-item-indicator);

    position: sticky;
    top: var(--calendar-sticky-top, 0px);
    z-index: var(--layer-raised);

    display: flex;
    align-items: baseline;
    gap: var(--gap-xs);

    background-color: var(--color-background);

    &[data-variant="column"] {
      justify-content: space-between;

      padding-block: var(--gap-xs);
      border-bottom: var(--border-thickness-xxs) solid
        var(--color-calendar-active-background);

      .weekday {
        min-width: 0;
        font-size: var(--font-size-text);
      }

      .date {
        font-size: var(--font-size-tag);
      }

      &.is-today {
        border-bottom-color: var(--color-day-header-accent);

        .weekday,
        .date {
          color: var(--color-day-header-accent);
        }
      }
    }

    &[data-variant="row"] {
      padding-block: var(--gap-s);

      .weekday {
        font-size: var(--ni-18);
        letter-spacing: -0.01em;
      }

      .date,
      .item-count {
        font-size: var(--font-size-text);
      }

      .item-count {
        margin-inline-start: auto;
      }

      &.is-today::before {
        content: "";
        align-self: center;

        width: var(--ni-4);
        height: var(--ni-18);
        border-radius: var(--border-radius-xxl);

        background-color: var(--color-day-header-accent);
      }

      &.is-empty .weekday {
        color: var(--color-text-secondary);
      }
    }
  }
</style>
