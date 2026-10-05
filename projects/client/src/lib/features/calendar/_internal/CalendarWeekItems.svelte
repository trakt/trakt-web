<script lang="ts" generics="T extends { key: string }">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { isBefore } from "date-fns/isBefore";
  import { startOfDay } from "date-fns/startOfDay";
  import type { Snippet } from "svelte";
  import type { Calendar } from "../models/Calendar.ts";
  import CalendarDayHeader from "./CalendarDayHeader.svelte";
  import { dateKey } from "./dateKey.ts";
  import { toCalendarWeekTitle } from "./toCalendarWeekTitle.ts";

  const {
    calendar,
    item,
  }: {
    calendar: Calendar<T>;
    item: Snippet<[T]>;
  } = $props();

  const today = startOfDay(new Date());

  const title = $derived.by(() => {
    const firstDay = calendar.at(0);
    if (!firstDay) return "";

    return toCalendarWeekTitle({
      start: firstDay.date,
      today,
      locale: getLocale(),
    });
  });
</script>

<section class="trakt-calendar-week">
  <h2 class="week-title">{title}</h2>

  <div class="week-days">
    {#each calendar as day (dateKey(day.date))}
      <div
        id={dateKey(day.date)}
        class="week-day calendar-day-anchor"
        class:is-past={isBefore(day.date, today)}
      >
        <CalendarDayHeader
          date={day.date}
          count={day.items.length}
          variant="column"
        />
        <div class="week-day-items">
          {#each day.items as media (media.key)}
            {@render item(media)}
          {:else}
            <p class="week-day-empty secondary">
              {m.text_calendar_nothing_scheduled()}
            </p>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  $board-min-width: 744px;

  .trakt-calendar-week {
    container-type: inline-size;

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding-bottom: var(--gap-xl);

    .week-title {
      margin: 0;
      font-size: var(--ni-20);
      letter-spacing: -0.01em;
    }

    .week-days {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: var(--gap-s);
    }

    .week-day {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      min-width: 0;

      scroll-margin-top: var(--calendar-sticky-top, 0px);

      transition: opacity var(--transition-increment) ease-in-out;

      &.is-past {
        opacity: 0.55;

        @include for-mouse {
          &:hover {
            opacity: 1;
          }
        }
      }
    }

    .week-day-items {
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);
    }

    .week-day-empty {
      display: grid;
      place-items: center;

      aspect-ratio: 2 / 3;
      margin: 0;
      padding: var(--gap-s);

      border: var(--border-thickness-xxs) dashed
        var(--color-calendar-active-background);
      border-radius: var(--border-radius-m);

      font-size: var(--font-size-tag);
      text-align: center;
    }
  }

  @container (max-width: #{$board-min-width}) {
    .trakt-calendar-week {
      .week-days {
        grid-template-columns: minmax(0, 1fr);
        gap: var(--gap-l);
      }

      .week-day-items {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(var(--ni-104), 1fr));
        gap: var(--gap-m) var(--gap-s);
      }

      .week-day-empty {
        aspect-ratio: auto;
        place-items: start;

        padding: 0;
        border: none;
      }
    }
  }
</style>
