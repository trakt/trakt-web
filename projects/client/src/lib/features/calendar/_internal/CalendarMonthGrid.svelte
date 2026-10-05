<script lang="ts" generics="T extends { key: string }">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { LOCALE_MAP } from "$lib/utils/formatting/date/LOCALE_MAP.ts";
  import { endOfWeek } from "date-fns/endOfWeek";
  import { isBefore } from "date-fns/isBefore";
  import { isToday } from "date-fns/isToday";
  import type { Snippet } from "svelte";
  import { startOfDay } from "date-fns/startOfDay";
  import type { Calendar } from "../models/Calendar.ts";
  import { buildMonthMatrix } from "./buildMonthMatrix.ts";
  import { dateKey } from "./dateKey.ts";

  const {
    allDays,
    activeDate,
    skipActiveWeek = false,
    preview,
    variant = "default",
  }: {
    allDays: Calendar<T>;
    activeDate: Date;
    /**
     * When `true`, the week containing `activeDate` is omitted from the
     * grid — useful when a rich day-strip already renders that week above.
     * When `false` (default) the active week is shown inline and the row
     * itself is wrapped via the `.is-active-week` modifier.
     */
    skipActiveWeek?: boolean;
    preview?: Snippet<[T[]]>;
    variant?: "default" | "mini";
  } = $props();

  const MAX_PREVIEW_ITEMS = 4;

  const referenceDate = $derived(
    endOfWeek(activeDate, {
      locale: LOCALE_MAP[getLocale()] ?? LOCALE_MAP["en"],
    }),
  );

  const matrix = $derived(
    buildMonthMatrix({
      referenceDate,
      activeDate,
      allDays,
      localeKey: getLocale(),
    }),
  );

  const todayStart = $derived(startOfDay(new Date()));

  const scrollToDay = (date: Date) => {
    const element = document.getElementById(dateKey(date));
    element?.scrollIntoView({ block: "start", behavior: "smooth" });
  };
</script>

<div class="calendar-month-grid" data-variant={variant}>
  {#each matrix.weeks as week, weekIndex (weekIndex)}
    {#if !(skipActiveWeek && weekIndex === matrix.activeWeekIndex)}
      <div
        class="week-row"
        class:is-active-week={!skipActiveWeek &&
          weekIndex === matrix.activeWeekIndex}
      >
        {#each week as cell (dateKey(cell.date))}
          <button
            type="button"
            class="month-day"
            class:has-items={cell.items.length > 0}
            class:is-past={isBefore(cell.date, todayStart)}
            class:is-today={isToday(cell.date)}
            class:is-outside-month={cell.isOutsideMonth}
            aria-label={m.button_label_go_to_calendar_day({
              day: toHumanDay({ date: cell.date, locale: getLocale() }),
            })}
            disabled={cell.items.length === 0}
            onclick={() => scrollToDay(cell.date)}
          >
            <span class="month-day-number">{cell.date.getDate()}</span>
            <span
              class="month-day-preview"
              data-count={Math.min(cell.items.length, MAX_PREVIEW_ITEMS)}
              aria-hidden="true"
            >
              {#if cell.items.length > 0 && preview}
                {@render preview(cell.items.slice(0, MAX_PREVIEW_ITEMS))}
              {:else if cell.items.length > 0}
                <span class="dot"></span>
              {/if}
            </span>
          </button>
        {/each}
      </div>
    {/if}
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .calendar-month-grid {
    --month-day-radius: var(--ni-8);

    display: flex;
    flex-direction: column;
    gap: var(--ni-4);

    width: 100%;
  }

  .week-row {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: var(--ni-4);

    border-radius: var(--month-day-radius);
  }

  .week-row.is-active-week {
    outline: var(--border-thickness-xxs) solid
      var(--color-calendar-item-indicator);
    outline-offset: var(--ni-2);
  }

  .month-day {
    all: unset;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-2);

    aspect-ratio: 3 / 4;
    min-width: 0;
    padding: var(--ni-2) var(--ni-4) var(--ni-4);
    box-sizing: border-box;
    overflow: hidden;

    border-radius: var(--month-day-radius);
    background-color: var(--color-calendar-inactive-background);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, opacity;

    &[disabled] {
      cursor: default;
    }

    &.is-outside-month {
      opacity: 0.45;
    }

    &.is-past:not(.is-today) {
      opacity: 0.55;
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
    }
  }

  .month-day-number {
    display: grid;
    place-items: center;

    min-width: var(--ni-24);
    height: var(--ni-18);
    padding-inline: var(--ni-4);
    box-sizing: border-box;

    border-radius: var(--border-radius-xxl);

    font-size: var(--font-size-tag);
    font-weight: 700;
    font-variant-numeric: tabular-nums;

    .month-day:not(.has-items) & {
      color: var(--color-text-secondary);
    }

    .month-day.is-today & {
      color: var(--shade-10);
      background-color: var(--color-calendar-item-indicator);
    }
  }

  .month-day-preview {
    flex: 1;
    min-height: 0;
    width: 100%;

    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: minmax(0, 1fr);
    gap: var(--ni-2);

    &[data-count="1"] {
      grid-template-columns: minmax(0, 1fr);
    }

    .dot {
      place-self: center;

      width: var(--ni-4);
      height: var(--ni-4);
      border-radius: 50%;

      background-color: var(--color-calendar-item-indicator);
    }
  }

  .calendar-month-grid[data-variant="mini"] {
    gap: var(--ni-2);

    .week-row {
      gap: var(--ni-2);
    }

    .month-day {
      aspect-ratio: auto;
      height: var(--ni-40);
      justify-content: center;

      background-color: transparent;
    }

    .month-day-preview {
      flex: 0 0 auto;
      display: flex;
      justify-content: center;

      height: var(--ni-4);
    }
  }

  @include for-mouse {
    .month-day.has-items:hover {
      background-color: var(--color-calendar-background-hover);
    }
  }
</style>
