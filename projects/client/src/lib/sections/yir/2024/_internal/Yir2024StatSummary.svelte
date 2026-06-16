<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { formatNumber } from "$lib/utils/format/formatNumber.ts";
  import type { Yir2024StatSummaryProps } from "./Yir2024StatSummaryProps.ts";

  const {
    mostWatched,
    leastWatched,
    countLabel,
    total,
    unit,
  }: Yir2024StatSummaryProps = $props();
</script>

<dl class="trakt-yir-2024-stat-summary">
  {#if mostWatched}
    <div class="yir-2024-stat-row">
      <dt>{m.yir_2024_stat_most_watched()}</dt>
      <dd>
        <span class="ellipsis yir-2024-stat-name">{mostWatched.name}</span>
        <span class="bold uppercase tag yir-2024-stat-count">
          {formatNumber(mostWatched.count)}
          {unit(mostWatched.count)}
        </span>
      </dd>
    </div>
  {/if}

  {#if leastWatched}
    <div class="yir-2024-stat-row">
      <dt>{m.yir_2024_stat_least_watched()}</dt>
      <dd>
        <span class="ellipsis yir-2024-stat-name">{leastWatched.name}</span>
        <span class="bold uppercase tag yir-2024-stat-count">
          {formatNumber(leastWatched.count)}
          {unit(leastWatched.count)}
        </span>
      </dd>
    </div>
  {/if}

  <div class="yir-2024-stat-row">
    <dt>{countLabel}</dt>
    <dd class="yir-2024-stat-total">{formatNumber(total)}</dd>
  </div>
</dl>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-2024-stat-summary {
    display: flex;
    flex-direction: column;
  }

  // Each row has a light divider under it (matching v2's stat-line) so the
  // rows read as a list. Last row drops the divider.
  .yir-2024-stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--ni-32);
    padding: var(--ni-16) 0;
    border-bottom: var(--border-thickness-xxs) solid var(--shade-800);

    &:last-child {
      border-bottom: none;
    }

    @include for-tablet-sm-and-below {
      gap: var(--ni-16);
    }

    dt {
      font-size: var(--font-size-title);
      color: var(--shade-10);
    }

    dd {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
      font-size: var(--font-size-title);
      color: var(--shade-10);
      min-width: 0;
    }
  }

  // Entry name pops in the YIR purple so it visually links back to the
  // chart's highlight color (matches v2's link styling). Truncation handled
  // by the `.ellipsis` utility class on the markup.
  .yir-2024-stat-name {
    color: var(--purple-300);
  }

  // Pill-shaped count badge with white background + dark text — matches the
  // v2 design. `--border-radius-xxl` is the established v3 token for
  // pill-shaped tags; `.tag` utility class handles font sizing.
  .yir-2024-stat-count {
    background: var(--shade-10);
    color: var(--shade-900);
    border-radius: var(--border-radius-xxl);
    padding: var(--ni-4) var(--ni-10);
    white-space: nowrap;
  }

  .yir-2024-stat-total {
    color: var(--shade-10);
  }
</style>
