<script lang="ts">
  const { days }: { days: number } = $props();

  const monthCount = $derived(Math.floor(days / 28));
  const remainingAfterMonths = $derived(days % 28);
  const weekCount = $derived(Math.floor(remainingAfterMonths / 7));
  const dayCount = $derived(remainingAfterMonths % 7);
</script>

<div class="trakt-streak-accumulator">
  {#if monthCount > 0}
    <div class="trakt-streak-group">
      <div class="trakt-streak-tooltip">{monthCount} {monthCount === 1 ? 'month' : 'months'}</div>
      {#each Array(monthCount) as _, i}
        <div class="trakt-streak-square month"></div>
      {/each}
    </div>
  {/if}

  {#if weekCount > 0}
    <div class="trakt-streak-group">
      <div class="trakt-streak-tooltip">{weekCount} {weekCount === 1 ? 'week' : 'weeks'}</div>
      {#each Array(weekCount) as _, i}
        <div class="trakt-streak-square week"></div>
      {/each}
    </div>
  {/if}

  {#if dayCount > 0}
    <div class="trakt-streak-group">
      <div class="trakt-streak-tooltip">{dayCount} {dayCount === 1 ? 'day' : 'days'}</div>
      {#each Array(dayCount) as _, i}
        <div
          class="trakt-streak-square day"
          class:today={i === dayCount - 1}
        ></div>
      {/each}
    </div>
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

    @include for-mobile {
      display: none;
    }
  }

  .trakt-streak-group {
    display: flex;
    gap: var(--ni-4);
    position: relative;

    .trakt-streak-tooltip {
      position: absolute;
      bottom: calc(100% + var(--ni-8));
      left: 50%;
      transform: translateX(-50%);

      padding: var(--ni-4) var(--ni-10);
      background: var(--shade-900);
      border: 1px solid var(--shade-800);
      border-radius: var(--border-radius-s);

      font-size: var(--ni-11);
      font-weight: 500;
      white-space: nowrap;
      color: var(--color-text-primary);

      opacity: 0;
      pointer-events: none;
      transition: opacity var(--transition-increment) ease-in-out;
    }

    @include for-mouse {
      &:hover .trakt-streak-tooltip {
        opacity: 1;
      }

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
      background: var(--purple-500);
      box-shadow: 0 0 var(--ni-8) color-mix(in srgb, var(--purple-500) 35%, transparent);

      &.today {
        &::after {
          content: '';
          position: absolute;
          inset: calc(var(--ni-2) * -1);
          border: var(--ni-1) solid var(--purple-400);
          border-radius: var(--ni-6);
          opacity: 0.6;
        }
      }
    }

    &.week {
      background: var(--blue-500);
      box-shadow: 0 0 var(--ni-8) color-mix(in srgb, var(--blue-500) 25%, transparent);
    }

    &.month {
      background: var(--orange-500);
      box-shadow: 0 0 var(--ni-8) color-mix(in srgb, var(--orange-500) 25%, transparent);
    }
  }
</style>
