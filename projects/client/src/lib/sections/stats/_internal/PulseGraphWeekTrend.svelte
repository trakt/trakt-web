<script lang="ts">
  import type { PulseGraphData } from "./models/PulseGraphData";

  const { data }: { data: PulseGraphData["weekTrend"] } = $props();

  let containerWidth = $state(0);
  let containerHeight = $state(0);

  const viewboxWidth = $derived(containerWidth || 240);
  const viewboxHeight = $derived(containerHeight || 96);
  const padX = 4;
  const padTop = 16;
  const dotRadius = 2.5;
  const dotCurrentRadius = 4;

  const points = $derived.by(() => {
    const weeks = data.weeks;
    const maxPlays = Math.max(...weeks.map((w) => w.plays), 1);
    const width = viewboxWidth - padX * 2;
    const height = viewboxHeight - padTop;

    return weeks.map((w, i) => ({
      x: padX + (i / Math.max(weeks.length - 1, 1)) * width,
      y: padTop + height - (w.plays / maxPlays) * height,
      plays: w.plays,
      label: w.label,
    }));
  });

  const polyline = $derived(points.map((p) => `${p.x},${p.y}`).join(" "));

  const polygon = $derived.by(() => {
    if (points.length === 0) return "";
    const first = points[0]!;
    const last = points[points.length - 1]!;
    const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
    return `${linePoints} ${last.x},${viewboxHeight} ${first.x},${viewboxHeight}`;
  });
</script>

<div class="graph-week-trend">
  <div
    class="trend-svg-container"
    bind:clientWidth={containerWidth}
    bind:clientHeight={containerHeight}
  >
    <svg viewBox="0 0 {viewboxWidth} {viewboxHeight}" class="trend-svg">
      <polygon points={polygon} class="trend-area" />
      <polyline points={polyline} class="trend-line" />
      {#each points as point, i (i)}
        {@const isLast = i === points.length - 1}
        <circle
          cx={point.x}
          cy={point.y}
          r={isLast ? dotCurrentRadius : dotRadius}
          class="trend-point"
          class:trend-point-current={isLast}
        />
        {#if isLast}
          <text x={point.x} y={point.y - 8} class="trend-value">
            {point.plays}
          </text>
        {/if}
      {/each}
    </svg>
  </div>
  <div class="trend-labels">
    {#each points as point (point.label)}
      <span class="trend-label">{point.label}</span>
    {/each}
  </div>
</div>

<style lang="scss">
  .graph-week-trend {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    flex: 1;
    justify-content: flex-end;
    min-height: 0;
  }

  .trend-svg-container {
    flex: 1;
    min-height: 0;
  }

  .trend-svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .trend-area {
    fill: color-mix(in srgb, var(--purple-500) 15%, transparent);
  }

  .trend-line {
    fill: none;
    stroke: var(--purple-400);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .trend-point {
    fill: var(--purple-400);
  }

  .trend-point-current {
    fill: var(--purple-400);
    stroke: var(--color-card-background);
    stroke-width: 2;
  }

  .trend-value {
    fill: var(--shade-400);
    font-size: var(--ni-10);
    text-anchor: middle;
    font-weight: 600;
  }

  .trend-labels {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
  }

  .trend-label {
    font-size: var(--ni-10);
    color: var(--shade-600);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
</style>
