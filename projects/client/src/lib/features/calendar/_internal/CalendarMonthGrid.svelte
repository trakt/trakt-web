<script lang="ts" generics="T extends { key: string }">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { LOCALE_MAP } from "$lib/utils/formatting/date/LOCALE_MAP.ts";
  import { endOfWeek } from "date-fns/endOfWeek";
  import { isBefore } from "date-fns/isBefore";
  import { startOfDay } from "date-fns/startOfDay";
  import type { Calendar } from "../models/Calendar.ts";
  import { buildMonthMatrix } from "./buildMonthMatrix.ts";
  import { dateKey } from "./dateKey.ts";

  const {
    allDays,
    activeDate,
    skipActiveWeek = false,
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
  } = $props();

  const MAX_INDICATOR_DOTS = 3;

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

<div class="calendar-month-grid">
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
            aria-label={m.button_label_go_to_calendar_day({
              day: toHumanDay({ date: cell.date, locale: getLocale() }),
            })}
            disabled={cell.items.length === 0}
            onclick={() => scrollToDay(cell.date)}
          >
            <span class="month-day-number">{cell.date.getDate()}</span>
            {#if cell.items.length > 0}
              <span class="month-day-indicator" aria-hidden="true">
                {#each Array(Math.min(cell.items.length, MAX_INDICATOR_DOTS)) as _, i (i)}
                  <span class="dot"></span>
                {/each}
              </span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .calendar-month-grid {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    width: 100%;
  }

  .week-row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--gap-xs);

    border-radius: var(--ni-10);
  }

  .week-row.is-active-week {
    outline: var(--border-thickness-xxs) solid var(--purple-400);
    outline-offset: var(--ni-2);
  }

  .month-day {
    all: unset;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ni-2);

    aspect-ratio: 1 / 1;

    border-radius: var(--ni-10);

    background-color: var(--shade-800);
    color: var(--color-text-secondary);

    font-size: var(--font-size-text);

    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, color;
  }

  .month-day.has-items {
    background-color: var(--purple-700);
    color: var(--shade-10);
  }

  .month-day[disabled] {
    cursor: not-allowed;
  }

  .month-day.is-past {
    opacity: 0.3;
  }

  .month-day-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ni-2);

    height: var(--ni-4);

    .dot {
      width: var(--ni-4);
      height: var(--ni-4);

      border-radius: 50%;
      background-color: var(--shade-10);
    }
  }

  @include for-mouse {
    .month-day.has-items:hover {
      background-color: var(--purple-600);
    }
  }
</style>
