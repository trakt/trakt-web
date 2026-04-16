<script lang="ts">
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { languageTag } from "$lib/features/i18n";
  import type { HeatmapCell } from "./useActivityHeatmap.ts";
  import { formatActivityTooltip } from "./utils/formatActivityTooltip.ts";

  const { cells }: { cells: ReadonlyArray<HeatmapCell> } = $props();

  const locale = $derived(languageTag());
</script>

<div class="trakt-streak-accumulator">
  {#each cells as cell (cell.date.getTime())}
    <Tooltip
      content={formatActivityTooltip({
        date: cell.date,
        count: cell.count,
        locale,
      })}
      disabled={cell.isFuture}
    >
      <div
        class="trakt-streak-pill"
        data-active={cell.count > 0 || undefined}
        data-future={cell.isFuture || undefined}
        data-today={cell.isToday || undefined}
      ></div>
    </Tooltip>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-streak-accumulator {
    display: flex;
    gap: var(--gap-xxs);
    align-items: center;
    justify-content: space-between;

    flex: 1;
    min-width: 0;
    max-width: var(--ni-920);
    margin-left: auto;

    :global(.trakt-tooltip-trigger) {
      width: var(--ni-12);
      flex-shrink: 1;
      min-width: var(--ni-4);

      @include for-tablet-sm-and-below {
        flex: 1;
        width: auto;
      }
    }

    @include for-tablet-sm-and-below {
      max-width: none;
      margin-left: 0;
      padding-block: var(--ni-2);
    }
  }

  .trakt-streak-pill {
    width: 100%;
    height: var(--ni-32);

    border-radius: var(--border-radius-s);
    background: transparent;
    border: var(--ni-1) solid var(--color-streak-day-border);
    transition: transform var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        transform: scaleY(1.2);
      }
    }

    &[data-active] {
      background: var(--color-streak-day);
      border-color: transparent;
    }

    &[data-future] {
      width: var(--ni-12);
      flex-shrink: 1;
      min-width: var(--ni-4);
      opacity: 0.25;

      @include for-tablet-sm-and-below {
        flex: 1;
        width: auto;
      }
    }

    &[data-today] {
      border-color: var(--color-streak-day);
      outline: var(--ni-1) solid var(--color-streak-day);
      outline-offset: var(--ni-1);
    }
  }
</style>
