<script lang="ts">
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const daysPerMonth = 30;
  const daysPerWeek = 7;

  const { days, active }: { days: number; active: boolean } = $props();

  const monthCount = $derived(Math.floor(days / daysPerMonth));
  const remainingAfterMonths = $derived(days % daysPerMonth);
  const weekCount = $derived(Math.floor(remainingAfterMonths / daysPerWeek));
  const dayCount = $derived(remainingAfterMonths % daysPerWeek);

  const monthLabel = $derived(
    monthCount === 1
      ? m.text_stats_streak_month({ count: String(monthCount) })
      : m.text_stats_streak_months({ count: String(monthCount) }),
  );

  const weekLabel = $derived(
    weekCount === 1
      ? m.text_stats_streak_week({ count: String(weekCount) })
      : m.text_stats_streak_weeks({ count: String(weekCount) }),
  );

  const dayLabel = $derived(
    dayCount === 1
      ? m.text_stats_streak_day({ count: String(dayCount) })
      : m.text_stats_streak_days({ count: String(dayCount) }),
  );
</script>

{#snippet streakGroup(count: number, label: string, type: "month" | "week" | "day")}
  {#if count > 0}
    <Tooltip content={label} variant="compact">
      <div class="trakt-streak-group">
        {#each Array.from({ length: count }) as _, i (i)}
          <div
            class="trakt-streak-square {type}"
            class:today={type === "day" && active && i === count - 1}
          ></div>
        {/each}
      </div>
    </Tooltip>
  {/if}
{/snippet}

<div class="trakt-streak-accumulator">
  {@render streakGroup(monthCount, monthLabel, "month")}
  {@render streakGroup(weekCount, weekLabel, "week")}
  {@render streakGroup(dayCount, dayLabel, "day")}

  {#if !active}
    <Tooltip content={m.text_stats_watch_today()} variant="compact">
      <div class="trakt-streak-square day empty"></div>
    </Tooltip>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-streak-accumulator {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-8);
    flex-shrink: 0;
    justify-content: flex-end;
    align-content: center;
    max-width: var(--ni-320);
  }

  .trakt-streak-group {
    display: flex;
    gap: var(--ni-4);

    @include for-mouse {
      &:hover .trakt-streak-square {
        transform: scale(1.15);
      }
    }
  }

  .trakt-streak-square {
    width: var(--ni-20);
    height: var(--ni-20);
    border-radius: var(--ni-4);
    cursor: default;
    transition: transform var(--transition-increment) ease-in-out;
    position: relative;

    &.day {
      background: var(--color-streak-day);
      box-shadow: 0 0 var(--ni-8) var(--color-streak-day-glow);

      &.today {
        &::after {
          content: "";
          position: absolute;
          inset: calc(var(--ni-2) * -1);
          border: var(--ni-1) solid var(--color-streak-day-border);
          border-radius: var(--ni-6);
          opacity: 0.6;
        }
      }

      &.empty {
        background: transparent;
        border: var(--ni-1) dashed var(--color-streak-day-border);
        box-shadow: none;
        opacity: 0.5;
      }
    }

    &.week {
      background: var(--color-streak-week);
      box-shadow: 0 0 var(--ni-8) var(--color-streak-week-glow);
    }

    &.month {
      background: var(--color-streak-month);
      box-shadow: 0 0 var(--ni-8) var(--color-streak-month-glow);
    }
  }
</style>
