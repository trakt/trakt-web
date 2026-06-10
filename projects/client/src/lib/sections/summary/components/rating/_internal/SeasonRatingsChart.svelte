<script lang="ts">
  import LineChart from "$lib/components/charts/LineChart.svelte";
  import type { Season } from "$lib/requests/models/Season.ts";

  type SeasonPoint = { season: number; rating: number };

  type Props = {
    seasons: Season[];
  };

  const { seasons }: Props = $props();

  const points: SeasonPoint[] = $derived.by(() => {
    const now = new Date();
    return seasons
      .filter((s) => s.number > 0 && s.rating != null && s.airDate <= now)
      .map((s) => ({
        season: s.number,
        rating: Math.round((s.rating ?? 0) * 100),
      }))
      .sort((a, b) => a.season - b.season);
  });

  const data = $derived(
    points.map((p) => ({ value: p.rating, label: `S${p.season}` })),
  );
  const tickLabels = $derived(points.map((p) => `S${p.season}`));

  // Zoom the line into its meaningful band rather than anchoring at 0.
  const baseline = $derived(Math.min(...points.map((p) => p.rating), 60));

  const peak = $derived(
    points.length > 0
      ? points.reduce((acc, p) => (p.rating > acc.rating ? p : acc))
      : null,
  );
  const trough = $derived(
    points.length > 0
      ? points.reduce((acc, p) => (p.rating < acc.rating ? p : acc))
      : null,
  );
</script>

{#if points.length >= 2}
  <section class="trakt-season-ratings-chart">
    <div class="header">
      <h3 class="card-title bold secondary">Quality Over Time</h3>
      {#if peak && trough}
        <span class="meta tag secondary">
          Peak S{peak.season} · {peak.rating}% &nbsp;·&nbsp; Low S{trough
            .season} · {trough.rating}%
        </span>
      {/if}
    </div>

    <div class="chart">
      <LineChart
        {data}
        {tickLabels}
        {baseline}
        showArea
        showDots
        label="Season ratings over time"
        height="var(--ni-160)"
      >
        {#snippet tooltip({ label, value })}
          <span class="season-tooltip">{label} · {value}%</span>
        {/snippet}
      </LineChart>
    </div>
  </section>
{/if}

<style>
  .trakt-season-ratings-chart {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    padding: var(--ni-12) var(--ni-16);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
  }

  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--gap-s);
    flex-wrap: wrap;
  }

  .card-title {
    color: var(--color-text-secondary);
    margin: 0;
    font-size: var(--font-size-text-small);
  }

  .meta {
    color: var(--color-text-secondary);
  }

  .chart {
    width: 100%;
  }

  .season-tooltip {
    display: block;
    white-space: nowrap;
    background-color: var(--color-tooltip-background);
    color: var(--color-tooltip-text);
    font-size: var(--ni-12);
    line-height: 1;
    font-weight: 500;
    border-radius: var(--border-radius-xs);
    padding: var(--ni-6) var(--ni-8);
    box-shadow: var(--shadow-menu);
  }
</style>
