<script lang="ts" generics="T extends { key: string }">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { isBefore } from "date-fns/isBefore";
  import { isToday } from "date-fns/isToday";
  import { startOfDay } from "date-fns/startOfDay";
  import type { Snippet } from "svelte";
  import type { Calendar } from "../models/Calendar.ts";
  import CalendarDayHeader from "./CalendarDayHeader.svelte";
  import CalendarWeekHead from "./CalendarWeekHead.svelte";
  import { dateKey } from "./dateKey.ts";
  import { toCalendarItemCountLabel } from "./toCalendarItemCountLabel.ts";
  import { toCalendarWeekTitle } from "./toCalendarWeekTitle.ts";
  import { toWeekTimelineName } from "./toWeekTimelineName.ts";

  const {
    calendar,
    item,
  }: {
    calendar: Calendar<T>;
    item: Snippet<[T]>;
  } = $props();

  const now = new Date();
  const today = startOfDay(now);

  const title = $derived.by(() => {
    const firstDay = calendar.at(0);
    if (!firstDay) return "";

    return toCalendarWeekTitle({
      start: firstDay.date,
      today,
      locale: getLocale(),
    });
  });

  const weekStart = $derived.by(() => {
    const firstDay = calendar.at(0);
    return firstDay ? dateKey(firstDay.date) : undefined;
  });

  const count = $derived(
    calendar.reduce((total, day) => total + day.items.length, 0),
  );
  const countLabel = $derived(toCalendarItemCountLabel(count));
  const isEmptyWeek = $derived(count === 0);

  const toAirTime = (media: T) =>
    "airDate" in media && media.airDate instanceof Date
      ? media.airDate.getTime()
      : 0;

  const toUpNextIndex = (items: T[]) => {
    const index = items.findIndex((media) => toAirTime(media) > now.getTime());
    return index === -1 ? items.length : index;
  };
</script>

{#snippet upNextMarker()}
  <div class="week-up-next" aria-hidden="true">
    <span class="up-next-label">{m.text_calendar_up_next()}</span>
  </div>
{/snippet}

<section class="trakt-calendar-week" class:is-empty={isEmptyWeek}>
  <header class="week-heading">
    <h2 class="week-title">{title}</h2>
    <span class="week-count secondary">{countLabel}</span>
  </header>

  <div
    class="week-days-head"
    data-week-start={weekStart}
    style:view-timeline-name={weekStart
      ? toWeekTimelineName(weekStart)
      : undefined}
  >
    <CalendarWeekHead {calendar} />
  </div>

  <div class="week-days">
    {#each calendar as day (dateKey(day.date))}
      {@const isDayToday = isToday(day.date)}
      {@const upNextIndex = isDayToday ? toUpNextIndex(day.items) : -1}
      <div
        id={dateKey(day.date)}
        class="week-day calendar-day-anchor"
        class:is-past={isBefore(day.date, today)}
        class:is-today={isDayToday}
      >
        <div class="week-day-row-header">
          <CalendarDayHeader
            date={day.date}
            count={day.items.length}
            variant="column"
          />
        </div>
        <div class="week-day-items">
          {#each day.items as media, index (media.key)}
            {#if index === upNextIndex}
              {@render upNextMarker()}
            {/if}
            {@render item(media)}
          {:else}
            <p class="week-day-empty secondary">
              <span class="week-day-empty-label">
                {m.text_calendar_nothing_scheduled()}
              </span>
            </p>
          {/each}
          {#if day.items.length > 0 && upNextIndex === day.items.length}
            {@render upNextMarker()}
          {/if}
        </div>
      </div>
    {/each}
  </div>

  {#if isEmptyWeek}
    <p class="week-empty secondary">{m.text_calendar_nothing_scheduled()}</p>
  {/if}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-calendar-week {
    --color-week-today-tint: color-mix(
      in srgb,
      var(--color-calendar-item-indicator) 12%,
      transparent
    );
    --week-column-padding: var(--ni-6);
    --week-empty-line: color-mix(
      in srgb,
      var(--color-foreground) 14%,
      transparent
    );

    display: flex;
    flex-direction: column;
  }

  .week-heading {
    display: flex;
    align-items: baseline;
    gap: var(--gap-s);

    padding-block: var(--gap-m) var(--gap-s);

    .week-title {
      margin: 0;
      font-size: var(--ni-20);
      font-weight: 800;
      letter-spacing: -0.01em;
    }

    .week-count {
      font-size: var(--font-size-text);
    }
  }

  .week-days {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: var(--gap-xs);
  }

  .week-days-head {
    view-timeline-inset: var(--calendar-bar-bottom, 0px) 0px;

    box-shadow: 0 var(--border-thickness-xxs) 0
      var(--color-calendar-active-background);
  }

  .week-day {
    display: flex;
    flex-direction: column;
    min-width: 0;

    padding: var(--gap-s) var(--week-column-padding) var(--gap-m);
    border-end-start-radius: var(--border-radius-l);
    border-end-end-radius: var(--border-radius-l);

    scroll-margin-top: var(--calendar-sticky-top, 0px);

    transition: opacity var(--transition-increment) ease-in-out;

    &.is-today {
      background: linear-gradient(
        to bottom,
        var(--color-week-today-tint),
        transparent
      );
    }

    &.is-past {
      opacity: 0.5;

      @include for-mouse {
        &:hover {
          opacity: 1;
        }
      }
    }
  }

  .week-day-row-header {
    display: none;
  }

  .week-day-items {
    isolation: isolate;

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .week-up-next {
    display: flex;
    align-items: center;
    gap: var(--ni-4);

    color: var(--color-calendar-item-indicator);

    &::before {
      content: "";
      width: var(--ni-8);
      height: var(--ni-8);
      border-radius: 50%;

      background-color: currentColor;
      box-shadow: 0 0 var(--ni-8) currentColor;
    }

    &::after {
      content: "";
      flex: 1;
      height: var(--ni-2);
      border-radius: var(--border-radius-xxl);

      background-color: currentColor;
    }

    .up-next-label {
      order: 1;

      font-size: var(--font-size-tag);
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
  }

  .week-day-empty {
    display: grid;
    place-items: center;

    min-height: var(--ni-104);
    margin: 0;
    padding: var(--gap-s);

    border: var(--border-thickness-xxs) dashed
      var(--color-calendar-active-background);
    border-radius: var(--border-radius-m);

    font-size: var(--font-size-tag);
    text-align: center;

    cursor: default;
    user-select: none;
  }

  .week-empty {
    display: none;
  }

  @include for-desktop {
    .week-day-empty {
      aspect-ratio: 2 / 3;
      min-height: 0;
      padding: 0;

      border: var(--border-thickness-xxs) solid var(--week-empty-line);
      border-radius: var(--border-radius-m);
      mask-image: linear-gradient(to bottom, black, transparent 85%);

      .week-day-empty-label {
        @include visually-hidden;
      }
    }

    .trakt-calendar-week.is-empty {
      .week-day {
        padding-bottom: 0;
      }

      .week-day-items {
        display: none;
      }

      .week-empty {
        display: flex;
        align-items: center;
        gap: var(--gap-m);

        margin: 0;
        padding-block: var(--gap-m) var(--gap-l);

        color: var(--color-text-secondary);
        font-size: var(--font-size-tag);

        &::before,
        &::after {
          content: "";
          flex: 1;
          height: var(--border-thickness-xxs);

          background: linear-gradient(
            to right,
            transparent,
            var(--week-empty-line)
          );
        }

        &::before {
          transform: scaleX(var(--rtl-sign));
        }

        &::after {
          transform: scaleX(calc(-1 * var(--rtl-sign)));
        }
      }
    }
  }

  @include for-tablet-lg {
    .week-days-head {
      display: none;
    }

    .week-days {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--gap-xs);
    }

    .week-day {
      display: grid;
      grid-template-columns: var(--ni-56) minmax(0, 1fr);
      align-items: start;
      gap: var(--gap-s);

      padding: var(--gap-xs);
      border-radius: var(--border-radius-l);

      &.is-today {
        background: var(--color-week-today-tint);
      }
    }

    .week-day-row-header {
      position: sticky;
      top: calc(var(--calendar-sticky-top, 0px) + var(--gap-xs));

      display: flex;
      justify-content: center;
    }

    .week-day-items {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(var(--ni-88), 1fr));
      gap: var(--gap-s);

      .week-up-next {
        grid-column: 1 / -1;
      }
    }

    .week-day-empty {
      min-height: 0;
      place-items: center start;

      padding: 0;
      border: none;
    }
  }
</style>
