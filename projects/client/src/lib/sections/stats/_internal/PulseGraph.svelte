<script lang="ts">
  import type { PulseGraphData } from "./useWeeklyPulse";

  type GraphType = "dailyBars" | "weekTrend" | "watchClock" | "showsMovies";

  const { kind, data }: { kind: GraphType; data: PulseGraphData } = $props();

  const TITLES: Record<GraphType, string> = {
    dailyBars: "Daily Activity",
    weekTrend: "4-Week Trend",
    watchClock: "Peak Hours",
    showsMovies: "Shows vs Movies",
  };

  const title = $derived(TITLES[kind]);

  // Daily bars derived data
  const dailyMax = $derived(Math.max(...data.dailyBars.thisWeek, 1));

  // Week trend SVG coordinates
  const trendPoints = $derived.by(() => {
    const weeks = data.weekTrend.weeks;
    const maxPlays = Math.max(...weeks.map((w) => w.plays), 1);
    const VIEWBOX_WIDTH = 240;
    const GRAPH_AREA_HEIGHT = 80;
    const padX = 24;
    const padTop = 24;
    const padBottom = 4;
    const width = VIEWBOX_WIDTH - padX * 2;
    const height = GRAPH_AREA_HEIGHT - padTop - padBottom;

    return weeks.map((w, i) => ({
      x: padX + (i / Math.max(weeks.length - 1, 1)) * width,
      y: padTop + height - (w.plays / maxPlays) * height,
      plays: w.plays,
      label: w.label,
    }));
  });

  const trendPolyline = $derived(
    trendPoints.map((p) => `${p.x},${p.y}`).join(" "),
  );

  const trendPolygon = $derived.by(() => {
    if (trendPoints.length === 0) return "";
    const first = trendPoints[0]!;
    const last = trendPoints[trendPoints.length - 1]!;
    const linePoints = trendPoints.map((p) => `${p.x},${p.y}`).join(" ");
    return `${linePoints} ${last.x},80 ${first.x},80`;
  });

  // Watch clock max
  const clockMax = $derived(
    Math.max(...data.watchClock.buckets.map((b) => b.count), 1),
  );

  // Shows vs Movies total
  const smTotal = $derived(data.showsMovies.episodes + data.showsMovies.movies);
  const showsPct = $derived(
    smTotal > 0 ? (data.showsMovies.episodes / smTotal) * 100 : 50,
  );
</script>

<div class="trakt-pulse-graph">
  <p class="trakt-pulse-graph-title">{title}</p>

  {#if kind ==="dailyBars"}
    <div class="graph-daily-bars">
      {#each data.dailyBars.dayLabels as dayLabel, i (i)}
        {@const twHeight =
          dailyMax > 0 ? ((data.dailyBars.thisWeek[i] ?? 0) / dailyMax) * 48 : 0}
        {@const isToday = i === data.dailyBars.todayIndex}
        <div class="daily-bar-col">
          <div class="daily-bar-track">
            <div
              class="daily-bar-fill"
              class:is-today={isToday}
              style:height="{twHeight}px"
            ></div>
          </div>
          <span class="daily-bar-label">{dayLabel}</span>
        </div>
      {/each}
    </div>
  {:else if kind ==="weekTrend"}
    <div class="graph-week-trend">
      <svg viewBox="0 0 240 96" class="trend-svg">
        <polygon points={trendPolygon} class="trend-area" />
        <polyline points={trendPolyline} class="trend-line" />
        {#each trendPoints as point, i (i)}
          {@const isLast = i === trendPoints.length - 1}
          <circle
            cx={point.x}
            cy={point.y}
            r={isLast ? 4 : 2.5}
            class="trend-point"
            class:trend-point-current={isLast}
          />
          {#if isLast}
            <text x={point.x} y={point.y - 8} class="trend-value"
              >{point.plays}</text
            >
          {/if}
        {/each}
      </svg>
      <div class="trend-labels">
        {#each trendPoints as point (point.label)}
          <span class="trend-label">{point.label}</span>
        {/each}
      </div>
    </div>
  {:else if kind ==="watchClock"}
    <div class="graph-watch-clock">
      {#each data.watchClock.buckets as bucket (bucket.label)}
        <div class="clock-row">
          <span class="clock-label">{bucket.label}</span>
          <div class="clock-bar-track">
            <div
              class="clock-bar-fill"
              style:width="{(bucket.count / clockMax) * 100}%"
            ></div>
          </div>
          <span class="clock-count">{bucket.count}</span>
        </div>
      {/each}
    </div>
  {:else if kind ==="showsMovies"}
    <div class="graph-shows-movies">
      <div class="sm-bar-track">
        <div class="sm-bar-shows" style:width="{showsPct}%"></div>
        <div class="sm-bar-movies" style:width="{100 - showsPct}%"></div>
      </div>
      <div class="sm-legends">
        <div class="sm-legend">
          <span class="sm-dot sm-dot-shows"></span>
          <span class="sm-legend-text"
            >{data.showsMovies.episodes} Episodes</span
          >
        </div>
        <div class="sm-legend">
          <span class="sm-dot sm-dot-movies"></span>
          <span class="sm-legend-text">{data.showsMovies.movies} Movies</span>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-pulse-graph {
    flex: 2 0 calc(var(--ni-148) * 2 + var(--gap-xs));
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    padding: var(--ni-16);
    background: var(--shade-930);
    border: 1px solid var(--shade-910);
    border-radius: var(--border-radius-m);
    overflow: hidden;
  }

  .trakt-pulse-graph-title {
    font-size: var(--ni-11);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--shade-400);
  }

  /* ── Daily Bars ─────────────────────────────────────── */
  .graph-daily-bars {
    display: flex;
    align-items: flex-end;
    gap: var(--ni-8);
    flex: 1;
    padding-top: var(--ni-4);
  }

  .daily-bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-4);
    flex: 1;
  }

  .daily-bar-track {
    position: relative;
    width: 100%;
    height: var(--ni-48);
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .daily-bar-fill {
    position: relative;
    width: 70%;
    background: var(--purple-500);
    border-radius: var(--ni-2);
    min-height: 1px;
    z-index: 1;

    &.is-today {
      background: var(--purple-400);
      box-shadow: 0 0 var(--ni-6)
        color-mix(in srgb, var(--purple-400) 40%, transparent);
    }
  }

  .daily-bar-label {
    font-size: var(--ni-10);
    color: var(--shade-600);
    line-height: 1;
  }

  /* ── Week Trend ─────────────────────────────────────── */
  .graph-week-trend {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    flex: 1;
  }

  .trend-svg {
    width: 100%;
    height: auto;
  }

  .trend-area {
    fill: color-mix(in srgb, var(--purple-800) 30%, transparent);
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
    stroke: var(--shade-930);
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
    padding: 0 var(--ni-24);
  }

  .trend-label {
    font-size: var(--ni-10);
    color: var(--shade-600);
  }

  /* ── Watch Clock ────────────────────────────────────── */
  .graph-watch-clock {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    flex: 1;
    justify-content: center;
  }

  .clock-row {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
  }

  .clock-label {
    font-size: var(--ni-11);
    color: var(--shade-400);
    width: var(--ni-72);
    flex-shrink: 0;
    text-align: right;
  }

  .clock-bar-track {
    flex: 1;
    height: var(--ni-6);
    background: var(--shade-950);
    border-radius: var(--ni-4);
    overflow: hidden;
  }

  .clock-bar-fill {
    height: 100%;
    background: var(--purple-500);
    border-radius: var(--ni-4);
    min-width: 2px;
  }

  .clock-count {
    font-size: var(--ni-11);
    color: var(--shade-600);
    width: var(--ni-28);
    text-align: right;
    flex-shrink: 0;
  }

  /* ── Shows vs Movies ────────────────────────────────── */
  .graph-shows-movies {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
    flex: 1;
    justify-content: center;
  }

  .sm-bar-track {
    display: flex;
    height: var(--ni-8);
    border-radius: var(--ni-4);
    overflow: hidden;
  }

  .sm-bar-shows {
    background: var(--purple-500);
    min-width: 2px;
  }

  .sm-bar-movies {
    background: var(--orange-500);
    min-width: 2px;
  }

  .sm-legends {
    display: flex;
    gap: var(--ni-16);
  }

  .sm-legend {
    display: flex;
    align-items: center;
    gap: var(--ni-4);
  }

  .sm-dot {
    width: var(--ni-8);
    height: var(--ni-8);
    border-radius: 50%;
    flex-shrink: 0;
  }

  .sm-dot-shows {
    background: var(--purple-500);
  }

  .sm-dot-movies {
    background: var(--orange-500);
  }

  .sm-legend-text {
    font-size: var(--ni-11);
    color: var(--shade-400);
  }
</style>
