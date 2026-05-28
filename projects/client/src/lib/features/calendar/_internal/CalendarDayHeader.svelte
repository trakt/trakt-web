<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toCalendarDayParts } from "./toCalendarDayParts.ts";

  const { date, count }: { date: Date; count: number } = $props();

  const parts = $derived(toCalendarDayParts(date, getLocale()));
  const itemCountLabel = $derived(
    count === 1
      ? m.calendar_day_item_count_one({ count })
      : m.calendar_day_item_count_other({ count }),
  );
</script>

<div class="trakt-calendar-day-header">
  <span class="day-of-month">{parts.dayOfMonth}</span>
  <span class="day-meta">
    <span class="month bold">{parts.month}</span>
    <span class="weekday">{parts.weekday}</span>
  </span>
  <span class="item-count secondary">{itemCountLabel}</span>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-calendar-day-header {
    position: sticky;
    top: var(--calendar-nav-bottom, 0px);
    z-index: var(--layer-base);

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    height: var(--ni-55);
    padding: 0 var(--gap-s);

    background-color: color-mix(
      in srgb,
      var(--color-calendar-active-background) 50%,
      transparent
    );
    backdrop-filter: blur(var(--ni-8));
  }

  .day-of-month {
    font-size: var(--ni-30);
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.04em;
  }

  .day-meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1;

    .month,
    .weekday {
      font-size: var(--ni-12);
      letter-spacing: 0.04em;
    }
  }

  .item-count {
    font-size: var(--font-size-text);
  }
</style>
