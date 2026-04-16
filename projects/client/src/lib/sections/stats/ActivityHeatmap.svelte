<script lang="ts">
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { languageTag } from "$lib/features/i18n";
  import { useActivityHeatmap } from "./_internal/useActivityHeatmap.ts";
  import { formatActivityTooltip } from "./_internal/utils/formatActivityTooltip.ts";

  const { mode }: { mode: DiscoverMode } = $props();

  const { heatmap, isLoading } = $derived(useActivityHeatmap({ mode }));

  const locale = $derived(languageTag());
</script>

{#if $isLoading}
  <div class="trakt-activity-heatmap-section">
    <div class="trakt-activity-heatmap-skeleton"></div>
  </div>
{:else if $heatmap}
  {@const { cells, monthLabel, dayLabels, totalRows } = $heatmap}
  <div class="trakt-activity-heatmap-section">
    <div class="trakt-activity-heatmap">
      <span class="bold">{monthLabel}</span>

      <div
        class="trakt-heatmap-grid"
        style="--total-rows: {totalRows}"
        role="grid"
        aria-label="Activity heatmap for {monthLabel}"
      >
        {#each dayLabels as day, col (col)}
          <span
            class="trakt-heatmap-day-label"
            style="grid-column: {col + 1}; grid-row: 1">{day}</span
          >
        {/each}

        {#each cells as cell (cell.date.getTime())}
          {#if cell.isFuture}
            <div
              class="trakt-heatmap-cell"
              data-future
              style="grid-column: {cell.col + 1}; grid-row: {cell.row + 2}"
              role="gridcell"
              aria-hidden="true"
            ></div>
          {:else}
            <Tooltip
              content={formatActivityTooltip({
                date: cell.date,
                count: cell.count,
                locale,
              })}
              --cell-col={cell.col + 1}
              --cell-row={cell.row + 2}
            >
              <div
                class="trakt-heatmap-cell"
                data-intensity={cell.intensity}
                data-today={cell.isToday || undefined}
                role="gridcell"
                aria-label={formatActivityTooltip({
                  date: cell.date,
                  count: cell.count,
                  locale,
                })}
                aria-current={cell.isToday ? "date" : undefined}
              ></div>
            </Tooltip>
          {/if}
        {/each}
      </div>

      <div class="trakt-heatmap-legend">
        <span class="trakt-heatmap-legend-label">Less</span>
        {#each [0, 1, 2, 3, 4] as level (level)}
          <div class="trakt-heatmap-cell" data-intensity={level}></div>
        {/each}
        <span class="trakt-heatmap-legend-label">More</span>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  $cell-gap: var(--ni-4);

  .trakt-activity-heatmap-skeleton {
    height: var(--ni-200);
    border-radius: var(--border-radius-m);
    background: var(--color-heatmap-empty);
    position: relative;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      transform: translateX(-100%);
      animation: slide calc(20 * var(--transition-increment)) infinite;
      background: linear-gradient(
        110deg,
        transparent 0%,
        color-mix(in srgb, var(--color-foreground) 6%, transparent) 50%,
        transparent 100%
      );
    }
  }

  .trakt-activity-heatmap {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .trakt-heatmap-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: $cell-gap;

    :global(.trakt-tooltip-trigger) {
      grid-column: var(--cell-col);
      grid-row: var(--cell-row);
    }
  }

  .trakt-heatmap-day-label {
    font-size: var(--ni-10);
    color: var(--color-text-secondary);
    text-align: center;
    user-select: none;
    padding-bottom: var(--ni-2);
  }

  .trakt-heatmap-cell {
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--border-radius-s);
    transition: transform calc(0.5 * var(--transition-increment)) ease-in-out;
    cursor: default;

    &[data-intensity="0"] {
      background: var(--color-heatmap-empty);
    }
    &[data-intensity="1"] {
      background: var(--color-heatmap-l1);
    }
    &[data-intensity="2"] {
      background: var(--color-heatmap-l2);
    }
    &[data-intensity="3"] {
      background: var(--color-heatmap-l3);
    }
    &[data-intensity="4"] {
      background: var(--color-heatmap-l4);
    }

    &[data-future] {
      background: var(--color-heatmap-empty);
      opacity: 0.35;
    }

    &[data-today] {
      outline: 2px solid var(--color-text-emphasis);
      outline-offset: 1px;
    }

    @include for-mouse {
      &:not([data-future]):hover {
        transform: scale(1.1);
      }
    }
  }

  .trakt-heatmap-legend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: $cell-gap;
  }

  .trakt-heatmap-legend-label {
    font-size: var(--ni-10);
    color: var(--color-text-secondary);
    user-select: none;
  }

  .trakt-heatmap-legend .trakt-heatmap-cell {
    width: var(--ni-12);
    height: var(--ni-12);
    border-radius: var(--ni-2);
  }
</style>
