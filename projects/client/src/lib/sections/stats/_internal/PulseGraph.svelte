<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PulseGraphData, PulseGraphType } from "./pulseGraphs";

  const { kind, data }: { kind: PulseGraphType; data: PulseGraphData } = $props();

  const titles: Record<PulseGraphType, string> = {
    dailyBars: m.header_stats_graph_daily(),
    weekTrend: m.header_stats_graph_trend(),
    watchClock: m.header_stats_graph_peak(),
    showsMovies: m.header_stats_graph_shows_movies(),
    ratingsDistribution: m.header_stats_graph_ratings(),
  };

  const title = $derived(titles[kind]);

  // Daily bars derived data
  const dailyMax = $derived(Math.max(...data.dailyBars.days, 1));

  // Week trend SVG layout
  const trendViewboxWidth = 240;
  const trendViewboxHeight = 96;
  const trendPadX = 4;
  const trendPadTop = 16;
  const trendDotRadius = 2.5;
  const trendDotCurrentRadius = 4;

  const trendPoints = $derived.by(() => {
    const weeks = data.weekTrend.weeks;
    const maxPlays = Math.max(...weeks.map((w) => w.plays), 1);
    const width = trendViewboxWidth - trendPadX * 2;
    const height = trendViewboxHeight - trendPadTop;

    return weeks.map((w, i) => ({
      x: trendPadX + (i / Math.max(weeks.length - 1, 1)) * width,
      y: trendPadTop + height - (w.plays / maxPlays) * height,
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
    return `${linePoints} ${last.x},${trendViewboxHeight} ${first.x},${trendViewboxHeight}`;
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

  // Ratings distribution
  const ratingsBuckets = $derived(data.ratingsDistribution.buckets);
  const ratingsMax = $derived(Math.max(...ratingsBuckets, 1));
  const ratingsAvg = $derived(data.ratingsDistribution.average.toFixed(1));

  const ratingColors: readonly string[] = [
    'var(--red-500)',     // 1
    'var(--red-400)',     // 2
    'var(--orange-500)',  // 3
    'var(--orange-400)',  // 4
    'var(--purple-500)',  // 5
    'var(--purple-400)',  // 6
    'var(--green-500)',   // 7
    'var(--green-400)',   // 8
    'var(--blue-500)',    // 9
    'var(--blue-400)',    // 10
  ];
</script>

<Card --height-card="var(--height-pulse-card)">
  <div class="trakt-pulse-graph">
    <p class="trakt-pulse-graph-title">{title}</p>

  {#if kind ==="dailyBars"}
    <div class="graph-daily-bars">
      {#each data.dailyBars.labels as label, i (i)}
        {@const barPct = dailyMax > 0 ? ((data.dailyBars.days[i] ?? 0) / dailyMax) * 100 : 0}
        {@const isToday = label === m.text_stats_today()}
        <div class="daily-bar-col">
          <div class="daily-bar-track">
            <div
              class="daily-bar-fill"
              class:is-today={isToday}
              style:height="{barPct}%"
            ></div>
          </div>
          <span class="daily-bar-label">{label}</span>
        </div>
      {/each}
    </div>
  {:else if kind ==="weekTrend"}
    <div class="graph-week-trend">
      <svg viewBox="0 0 {trendViewboxWidth} {trendViewboxHeight}" preserveAspectRatio="none" class="trend-svg">
        <polygon points={trendPolygon} class="trend-area" />
        <polyline points={trendPolyline} class="trend-line" />
        {#each trendPoints as point, i (i)}
          {@const isLast = i === trendPoints.length - 1}
          <circle
            cx={point.x}
            cy={point.y}
            r={isLast ? trendDotCurrentRadius : trendDotRadius}
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
      <div class="sm-counts">
        <div class="sm-count">
          <span class="sm-count-value sm-color-shows">{data.showsMovies.episodes}</span>
          <span class="sm-count-label">{m.label_stats_episodes()}</span>
        </div>
        <div class="sm-count">
          <span class="sm-count-value sm-color-movies">{data.showsMovies.movies}</span>
          <span class="sm-count-label">{m.label_stats_movies()}</span>
        </div>
      </div>
      <div class="sm-bar-track">
        <div class="sm-bar-shows" style:width="{showsPct}%"></div>
        <div class="sm-bar-movies" style:width="{100 - showsPct}%"></div>
      </div>
    </div>
  {:else if kind === "ratingsDistribution"}
    <div class="graph-ratings-dist">
      <div class="ratings-bars">
        {#each { length: 10 } as _, i (i)}
          {@const score = i + 1}
          {@const count = ratingsBuckets[i] ?? 0}
          {@const isPeak = count === ratingsMax && count > 0}
          <div class="rating-bar-col" class:is-peak={isPeak}>
            <div class="rating-bar-track">
              <div
                class="rating-bar-fill"
                style:height="{ratingsMax > 0 ? (count / ratingsMax) * 100 : 0}%"
                style:background={ratingColors[i]}
              ></div>
            </div>
            <span class="rating-score">{score}</span>
          </div>
        {/each}
      </div>
      <div class="ratings-avg">
        <span class="ratings-avg-label">{m.label_stats_average()}</span>
        <span class="ratings-avg-value">{ratingsAvg} ★</span>
      </div>
    </div>
  {/if}
  </div>
</Card>

<style lang="scss">
  .trakt-pulse-graph {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    padding: var(--ni-16);
    overflow: hidden;
    position: relative;
    height: 100%;
    box-sizing: border-box;
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
    gap: var(--ni-8);
    flex: 1;
  }

  .daily-bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-4);
    flex: 1;
    justify-content: flex-end;
  }

  .daily-bar-track {
    position: relative;
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .daily-bar-fill {
    position: absolute;
    bottom: 0;
    left: 15%;
    right: 15%;
    background: var(--purple-500);
    border-radius: var(--ni-2);
    min-height: 1px;

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
    justify-content: flex-end;
    min-height: 0;
  }

  .trend-svg {
    width: 100%;
    flex: 1;
    min-height: 0;
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
    flex: 1;
    justify-content: flex-end;
    gap: var(--ni-12);
  }

  .sm-counts {
    display: flex;
    gap: var(--ni-24);
    flex: 1;
    align-items: center;
  }

  .sm-count {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }

  .sm-count-value {
    font-size: var(--ni-32);
    font-weight: 700;
    line-height: 1;
  }

  .sm-count-label {
    font-size: var(--ni-13);
    color: var(--shade-400);
  }

  .sm-color-shows {
    color: var(--purple-400);
  }

  .sm-color-movies {
    color: var(--orange-400);
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

  /* ── Ratings Distribution ────────────────────────── */
  .graph-ratings-dist {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    flex: 1;
  }

  .ratings-avg {
    position: absolute;
    top: var(--ni-16);
    right: var(--ni-16);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1;
  }

  .ratings-avg-label {
    font-size: var(--ni-10);
    color: var(--shade-600);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .ratings-avg-value {
    font-size: var(--ni-14);
    color: var(--shade-300);
    font-weight: 600;
  }

  .ratings-bars {
    display: flex;
    gap: var(--ni-4);
    flex: 1;
    margin-top: var(--ni-20);
  }

  .rating-bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-4);
    flex: 1;
    justify-content: flex-end;
  }

  .rating-bar-track {
    width: 100%;
    flex: 1;
    position: relative;
    border-radius: var(--ni-2);
  }

  .rating-bar-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: var(--ni-2);
    min-height: 1px;
  }

  .rating-score {
    font-size: var(--ni-10);
    color: var(--shade-500);
    line-height: 1;
  }

  .rating-bar-col.is-peak .rating-score {
    color: var(--shade-200);
    font-weight: 600;
  }
</style>
