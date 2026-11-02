<svelte:options css="injected" />

<script lang="ts">
  import type { StatTileProps } from "./StatTileProps.ts";

  const { value, label, icon }: StatTileProps = $props();
</script>

<div class="trakt-stat-tile">
  {@render icon()}
  <b class="stat-tile-value">{value}</b>
  <span class="stat-tile-label">{label}</span>
</div>

<style>
  .trakt-stat-tile {
    display: flex;
    align-items: center;
    gap: 10px;

    padding: 12px 18px;

    color: #efefef;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
  }

  .trakt-stat-tile :global(svg) {
    width: 32px;
    height: 32px;
  }

  .stat-tile-value {
    font-size: 32px;
    font-weight: bold;
  }

  .stat-tile-label {
    font-size: 26px;
    color: rgba(239, 239, 239, 0.7);
  }
</style>
