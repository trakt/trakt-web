<script lang="ts">
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import type { KpiTileProps } from "./KpiTileProps.ts";

  // SOT KPI tile: the "caption + headline value + optional delta" pattern that
  // stat cards across stats/profile/yir/rating each re-implemented. Purely
  // presentational and card-agnostic - wrap in <Card> at the call site when a
  // surface is needed.
  const {
    label,
    children,
    delta,
    icon,
    tooltip,
    size = "normal",
    align = "start",
  }: KpiTileProps = $props();
</script>

<div class="trakt-kpi-tile" data-size={size} data-align={align}>
  {#if icon}
    <div class="kpi-icon">{@render icon()}</div>
  {/if}

  <p class="kpi-label small secondary ellipsis">{label}</p>

  <div class="kpi-value">
    {#if tooltip}
      <Tooltip content={tooltip} side="right">
        {@render children()}
      </Tooltip>
    {:else}
      {@render children()}
    {/if}
  </div>

  {#if delta}
    <div class="kpi-delta">{@render delta()}</div>
  {/if}
</div>

<style lang="scss">
  .trakt-kpi-tile {
    --kpi-value-size: var(--ni-24);

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    justify-content: space-between;
    min-width: 0;
    height: 100%;
    box-sizing: border-box;

    &[data-size="large"] {
      --kpi-value-size: var(--ni-32);
    }

    &[data-align="center"] {
      align-items: center;
      text-align: center;
    }

    &[data-align="start"] {
      align-items: flex-start;
    }
  }

  .kpi-label {
    margin: 0;
    color: var(--color-text-secondary);
  }

  .kpi-icon :global(svg) {
    width: var(--ni-18);
    height: var(--ni-18);
  }

  .kpi-value {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-xxs);
    min-width: 0;

    &,
    :global(span),
    :global(p) {
      font-size: var(--kpi-value-size);
      line-height: 1.05;
      font-weight: 700;
    }

    // Split value parts (e.g. "2h" "11m") inherit the headline size.
    :global(.trakt-tooltip-trigger) {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap-xxs);
      align-items: center;
    }
  }

  .kpi-delta {
    display: flex;
    align-items: center;
  }
</style>
