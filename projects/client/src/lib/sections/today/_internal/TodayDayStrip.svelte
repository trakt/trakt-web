<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { toHumanDayOfMonth } from "$lib/utils/formatting/date/toHumanDayOfMonth.ts";
  import { toHumanDayOfWeek } from "$lib/utils/formatting/date/toHumanDayOfWeek.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import type {
    TodayDayStripDay,
    TodayDayStripProps,
  } from "./TodayDayStripProps.ts";

  const { days, value, counts, onChange }: TodayDayStripProps = $props();

  const toLabel = (day: TodayDayStripDay) => {
    const date = toHumanDay({ date: day.date, locale: getLocale() });
    const count = counts?.[day.key];

    if (count == null) return date;
    return count === 1
      ? m.label_today_day_activity_one({ day: date })
      : m.label_today_day_activity_other({ day: date, count });
  };
</script>

<div
  class="trakt-today-day-strip"
  role="radiogroup"
  aria-label={m.label_today_day()}
  data-dpad-navigation={DpadNavigationType.List}
>
  {#each days as day (day.key)}
    {@const count = counts?.[day.key]}
    <button
      type="button"
      role="radio"
      class="day"
      class:is-selected={day.key === value}
      class:is-today={day.isToday}
      class:is-quiet={count === 0}
      aria-checked={day.key === value}
      aria-label={toLabel(day)}
      data-dpad-navigation={DpadNavigationType.Item}
      onclick={() => onChange(day.key)}
    >
      <span class="tag bold uppercase day-weekday">
        {toHumanDayOfWeek(day.date, getLocale())}
      </span>
      <span class="title day-date">
        {toHumanDayOfMonth(day.date, getLocale())}
      </span>
      {#if counts}
        <span class="tag bold day-count" class:is-loading={count == null}>
          {count == null ? "" : toHumanNumber(count, getLocale())}
        </span>
      {/if}
    </button>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-today-day-strip {
    --day-radius: var(--border-radius-l);
    --day-inset: var(--ni-4);

    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(7, var(--ni-56));
    gap: var(--gap-xxs);

    width: fit-content;
    max-width: 100%;
    padding: var(--day-inset);

    border-radius: calc(var(--day-radius) + var(--day-inset));
    background: var(--color-segmented-track-background);
    backdrop-filter: blur(var(--ni-8));

    @include for-mobile {
      width: 100%;
      grid-template-columns: repeat(7, minmax(0, 1fr));
    }

    .day {
      all: unset;

      position: relative;
      box-sizing: border-box;
      min-width: 0;

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ni-2);

      padding-block: var(--ni-6);
      border-radius: var(--day-radius);

      color: var(--color-text-secondary);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;

      transition: var(--transition-increment) ease-in-out;
      transition-property: background, color, box-shadow, transform;

      @include for-mouse {
        &:not(.is-selected):hover {
          color: var(--color-text-primary);
          background: color-mix(
            in srgb,
            var(--color-foreground) 6%,
            transparent
          );
        }
      }

      &:active {
        transform: scale(0.96);
      }

      &:focus-visible {
        outline: var(--ni-2) solid var(--color-text-emphasis);
        outline-offset: calc(-1 * var(--ni-2));
      }

      &.is-today .day-date {
        color: var(--color-text-emphasis);
      }

      &.is-selected {
        color: var(--color-segmented-selector-foreground);
        background: var(--color-segmented-selector-background);
        box-shadow: 0 var(--ni-4) var(--ni-12)
          color-mix(in srgb, var(--purple-500) 35%, transparent);
        cursor: default;

        .day-date {
          color: inherit;
        }

        .day-count {
          background: color-mix(in srgb, currentColor 22%, transparent);
          color: inherit;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;

        &:active {
          transform: none;
        }
      }
    }

    .day-weekday,
    .day-count {
      color: inherit;
    }

    .day-weekday {
      opacity: 0.8;
    }

    .day-date {
      color: var(--color-text-primary);
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }

    .day-count {
      box-sizing: border-box;
      min-width: var(--ni-24);
      height: var(--ni-16);
      padding-inline: var(--ni-6);

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: var(--border-radius-xxl);
      background: color-mix(in srgb, var(--purple-500) 16%, transparent);
      color: var(--color-text-emphasis);
      font-variant-numeric: tabular-nums;

      &.is-loading {
        background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
      }
    }

    .day.is-quiet:not(.is-selected) .day-count {
      background: transparent;
      color: var(--color-text-secondary);
    }
  }
</style>
