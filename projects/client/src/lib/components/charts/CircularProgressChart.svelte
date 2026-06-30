<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    percentage,
    children,
  }: {
    /** Completion ratio, 0–100. Clamped to that range. */
    percentage: number;
    /** Optional content rendered in the center of the ring (e.g. a label). */
    children?: Snippet;
  } = $props();

  const clamped = $derived(Math.max(0, Math.min(100, percentage)));

  // The SVG path is a circle with circumference ≈ 100 units, so
  // `stroke-dasharray: {clamped}, 100` fills exactly `clamped`% of the ring.
  const ARC = "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831";
</script>

<div class="trakt-circular-progress-chart">
  <svg class="circular-chart" viewBox="0 0 36 36" role="img" aria-hidden="true">
    <path class="circle-bg" d={ARC} />
    <path class="circle" stroke-dasharray="{clamped}, 100" d={ARC} />
  </svg>
  {#if children}
    <div class="circular-progress-center">{@render children()}</div>
  {/if}
</div>

<style lang="scss">
  .trakt-circular-progress-chart {
    position: relative;
    display: inline-flex;
    width: var(--circular-progress-size, var(--ni-120));
    height: var(--circular-progress-size, var(--ni-120));
  }

  .circular-chart {
    width: 100%;
    height: 100%;
    // The arc path already starts at 12 o'clock and sweeps clockwise, so no
    // rotation is needed.
  }

  .circle-bg {
    fill: none;
    stroke: var(--circular-progress-track, var(--shade-800));
    stroke-width: var(--circular-progress-thickness, 2.4);
  }

  .circle {
    fill: none;
    stroke: var(--circular-progress-indicator, var(--red-500));
    stroke-width: var(--circular-progress-thickness, 2.4);
    stroke-linecap: round;
    transition: stroke-dasharray var(--transition-increment, 0.3s) ease-in-out;
  }

  .circular-progress-center {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
</style>
