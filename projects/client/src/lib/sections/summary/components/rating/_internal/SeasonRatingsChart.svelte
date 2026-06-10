<script lang="ts">
  import type { Season } from "$lib/requests/models/Season.ts";

  type SeasonPoint = { season: number; rating: number };

  type Props = {
    seasons: Season[];
  };

  const { seasons }: Props = $props();

  const points: SeasonPoint[] = $derived(
    seasons
      .filter((s) => s.number > 0 && s.rating != null)
      .map((s) => ({
        season: s.number,
        rating: Math.round((s.rating ?? 0) * 100),
      }))
      .sort((a, b) => a.season - b.season),
  );

  const width = 480;
  const height = 140;
  const padX = 24;
  const padY = 16;

  const xs = $derived(points.map((p) => p.season));
  const ys = $derived(points.map((p) => p.rating));

  const minX = $derived(Math.min(...xs));
  const maxX = $derived(Math.max(...xs));
  const minY = $derived(Math.min(...ys, 60));
  const maxY = $derived(Math.max(...ys, 100));

  function toX(season: number) {
    if (maxX === minX) return width / 2;
    return padX + ((season - minX) / (maxX - minX)) * (width - 2 * padX);
  }

  function toY(rating: number) {
    if (maxY === minY) return height / 2;
    return (
      height - padY -
      ((rating - minY) / (maxY - minY)) * (height - 2 * padY)
    );
  }

  const linePath = $derived(
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.season)} ${toY(p.rating)}`)
      .join(" "),
  );

  const areaPath = $derived(
    `${linePath} L ${toX(points.at(-1)?.season ?? 0)} ${height - padY} L ${
      toX(points.at(0)?.season ?? 0)
    } ${height - padY} Z`,
  );

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
        Peak S{peak.season} · {peak.rating}% &nbsp;·&nbsp; Low S{trough.season}
        · {trough.rating}%
      </span>
    {/if}
  </div>

  <svg
    class="chart"
    viewBox={`0 0 ${width} ${height}`}
    role="img"
    aria-label="Season ratings over time"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="seasonRatingsArea" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="var(--color-text-emphasis)" stop-opacity="0.55" />
        <stop offset="100%" stop-color="var(--color-text-emphasis)" stop-opacity="0.05" />
      </linearGradient>
    </defs>

    {#each [70, 80, 90] as gridY (gridY)}
      <line
        class="grid-line"
        x1={padX}
        x2={width - padX}
        y1={toY(gridY)}
        y2={toY(gridY)}
      />
    {/each}

    <path class="area" d={areaPath} />
    <path class="line" d={linePath} />

    {#each points as p (p.season)}
      <g class="point" transform={`translate(${toX(p.season)}, ${toY(p.rating)})`}>
        <circle r="5" />
        <text class="point-label tag" y="-8" text-anchor="middle">
          {p.rating}%
        </text>
      </g>
    {/each}

    {#each points as p (p.season)}
      <text
        class="axis-label tag secondary"
        x={toX(p.season)}
        y={height - 2}
        text-anchor="middle"
      >
        S{p.season}
      </text>
    {/each}
  </svg>
  </section>
{/if}

<style lang="scss">
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
    height: auto;
    overflow: visible;
  }

  .grid-line {
    stroke: var(--color-text-secondary);
    stroke-width: 1;
    stroke-dasharray: 2 3;
    opacity: 0.35;
  }

  .area {
    fill: url(#seasonRatingsArea);
  }

  .line {
    fill: none;
    stroke: var(--color-text-emphasis);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .point circle {
    fill: var(--color-text-primary);
    stroke: var(--color-text-emphasis);
    stroke-width: 2;
  }

  .point-label {
    fill: var(--color-text-primary);
    font-size: var(--font-size-text-small);
    font-weight: 700;
  }

  .axis-label {
    fill: var(--color-text-primary);
    font-size: var(--font-size-text-small);
    font-weight: 600;
  }
</style>
