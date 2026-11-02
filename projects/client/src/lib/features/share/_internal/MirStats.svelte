<svelte:options css="injected" />

<script lang="ts">
  import type { MirShareData } from "../models/MirShareData.ts";
  import type { ShareType } from "../models/ShareType.ts";
  import ShareStatIcon from "../assets/ShareStatIcon.svelte";
  import StatTile from "./StatTile.svelte";

  const {
    totals,
    variant,
  }: { totals: MirShareData["totals"]; variant: ShareType } = $props();

  const hours = $derived(Math.round(totals.minutes / 60));
  const hasTypeCounts = $derived(variant !== "open-graph");
</script>

<div class="trakt-mir-stats" data-variant={variant}>
  <StatTile
    value={totals.plays.toLocaleString()}
    label={totals.plays === 1 ? "play" : "plays"}
  >
    {#snippet icon()}<ShareStatIcon kind="plays" />{/snippet}
  </StatTile>
  <StatTile
    value={hours.toLocaleString()}
    label={hours === 1 ? "hour" : "hours"}
  >
    {#snippet icon()}<ShareStatIcon kind="hours" />{/snippet}
  </StatTile>
  {#if hasTypeCounts}
    <StatTile
      value={totals.episodes.toLocaleString()}
      label={totals.episodes === 1 ? "episode" : "episodes"}
    >
      {#snippet icon()}<ShareStatIcon kind="episodes" />{/snippet}
    </StatTile>
    <StatTile
      value={totals.movies.toLocaleString()}
      label={totals.movies === 1 ? "movie" : "movies"}
    >
      {#snippet icon()}<ShareStatIcon kind="movies" />{/snippet}
    </StatTile>
  {/if}
</div>

<style>
  .trakt-mir-stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
  }

  .trakt-mir-stats[data-variant="open-graph"] {
    justify-content: flex-start;
  }

  .trakt-mir-stats[data-variant="story"] {
    width: 860px;
    gap: 24px;
  }

  .trakt-mir-stats[data-variant="story"] :global(.trakt-stat-tile) {
    width: 418px;
    box-sizing: border-box;
  }
</style>
