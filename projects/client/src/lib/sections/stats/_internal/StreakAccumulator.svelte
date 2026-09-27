<script lang="ts">
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { languageTag } from "$lib/features/i18n";
  import type { HeatmapCell } from "./models/HeatmapCell.ts";
  import { formatActivityTooltip } from "./utils/formatActivityTooltip.ts";

  const {
    cells,
    isCelebrating = false,
  }: { cells: ReadonlyArray<HeatmapCell>; isCelebrating?: boolean } = $props();

  const now = new Date();
  const locale = $derived(languageTag());
</script>

<div class="trakt-streak-accumulator">
  {#each cells as cell (cell.date.getTime())}
    <Tooltip
      content={formatActivityTooltip({
        date: cell.date,
        count: cell.count,
        locale,
        now,
      })}
    >
      <div
        class="trakt-streak-pill"
        data-active={cell.count > 0 || undefined}
        data-future={cell.isFuture || undefined}
        data-today={cell.isToday || undefined}
        data-celebrating={(cell.isToday && isCelebrating) || undefined}
      ></div>
    </Tooltip>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-streak-accumulator {
    display: flex;
    gap: var(--gap-xs);
    align-items: center;
    justify-content: space-between;

    flex: 1;
    min-width: 0;
    max-width: var(--ni-160);
    margin-inline-start: auto;
    padding-block: var(--ni-2);

    @include for-tablet-sm-and-below {
      flex: none;
    }

    :global(.trakt-tooltip-trigger) {
      width: var(--ni-8);
      flex-shrink: 1;
      min-width: var(--ni-4);
    }
  }

  .trakt-streak-pill {
    width: 100%;
    height: var(--ni-32);

    border-radius: var(--border-radius-s);
    background: var(--color-heatmap-empty);
    border: var(--ni-1) solid transparent;
    transition: transform calc(0.5 * var(--transition-increment)) ease-in-out,
      opacity var(--transition-increment) ease-in-out;

    @include for-tablet-sm-and-below {
      height: var(--ni-18);
    }

    @include for-mouse {
      &:hover {
        transform: scaleX(1.5) scaleY(1.2);
      }
    }

    &[data-active] {
      background: var(--color-streak-day);
      border-color: transparent;
      opacity: 0.5;
    }

    &[data-future],
    &[data-today]:not([data-active]) {
      background: transparent;
      border-color: var(--color-heatmap-empty);
    }

    &[data-today] {
      outline: var(--ni-1) solid var(--color-streak-day);
      outline-offset: var(--ni-1);
      opacity: 1;
    }

    &[data-celebrating] {
      animation: streak-today-glow 1600ms 260ms ease-out both;
    }
  }

  @keyframes streak-today-glow {
    0% {
      background: var(--color-streak-day);
      transform: scaleY(1);
    }
    30% {
      background: var(--orange-400);
      box-shadow: 0 0 var(--ni-10) var(--orange-400);
      transform: scaleY(1.2);
    }
    100% {
      background: var(--orange-400);
      transform: scaleY(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-streak-pill[data-celebrating] {
      animation: none;
      background: var(--orange-400);
    }
  }
</style>
