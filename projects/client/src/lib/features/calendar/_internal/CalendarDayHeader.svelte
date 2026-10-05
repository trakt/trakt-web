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
    <span class="weekday">{parts.weekday}</span>
    <span class="day-number">{parts.dayOfMonth}</span>
  {:else}
    <span class="day-number">{parts.dayOfMonth}</span>
    <span class="day-meta">
      <span class="weekday bold">
        {isDateToday ? m.text_calendar_today() : parts.weekdayLong}
      </span>
      <span class="month secondary">{parts.monthLong}</span>
    </span>
    <span class="item-count secondary">{itemCountLabel}</span>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-calendar-day-header {
    --color-day-header-accent: var(--color-calendar-item-indicator);

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    .day-number {
      display: grid;
      place-items: center;

      font-weight: 800;
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.02em;
    }

    &.is-today .day-number {
      color: var(--shade-10);
      background-color: var(--color-day-header-accent);
      box-shadow: 0 0 var(--ni-16)
        color-mix(in srgb, var(--color-day-header-accent) 55%, transparent);
    }

    &[data-variant="column"] {
      flex-direction: column;
      gap: var(--ni-2);

      .weekday {
        font-size: var(--font-size-tag);
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--color-text-secondary);
      }

      .day-number {
        width: var(--ni-36);
        height: var(--ni-36);
        border-radius: 50%;

        font-size: var(--ni-20);
      }

      &.is-today .weekday {
        color: var(--color-day-header-accent);
      }

      &.is-empty:not(.is-today) .day-number {
        color: var(--color-text-secondary);
      }
    }

    &[data-variant="row"] {
      position: sticky;
      top: var(--calendar-sticky-top, 0px);
      z-index: var(--layer-raised);

      padding-block: var(--gap-s);

      background-color: var(--color-background);

      .day-number {
        min-width: var(--ni-40);
        height: var(--ni-40);
        padding-inline: var(--ni-4);
        box-sizing: border-box;
        border-radius: var(--border-radius-m);

        font-size: var(--ni-24);

        background-color: var(--color-calendar-inactive-background);
      }

      &.is-today .day-number {
        background-color: var(--color-day-header-accent);
      }

      .day-meta {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
      }

      .weekday {
        font-size: var(--font-size-text);
      }

      .month,
      .item-count {
        font-size: var(--font-size-tag);
      }

      .item-count {
        margin-inline-start: auto;
      }
    }
  }
</style>
