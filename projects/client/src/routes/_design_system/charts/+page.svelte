<script lang="ts">
  import AreaChart from "$lib/components/charts/AreaChart.svelte";
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import BubbleChart from "$lib/components/charts/BubbleChart.svelte";
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import KpiTile from "$lib/components/kpi/KpiTile.svelte";
  import LineChart from "$lib/components/charts/LineChart.svelte";
  import SegmentedBar from "$lib/components/charts/SegmentedBar.svelte";
  import Sparkline from "$lib/components/charts/Sparkline.svelte";
  import StackedBarChart from "$lib/components/charts/StackedBarChart.svelte";

  // One dataset, reshaped per primitive - proof the VizPoint contract is
  // interchangeable across charts.
  const series = [4, 8, 6, 12, 9, 16, 13, 20, 18, 24, 21, 27].map(
    (value, i) => ({ value, label: `D${i + 1}` }),
  );
  const distribution = [320, 540, 2100, 6800, 4300].map((value, i) => ({
    value,
    label: `${i + 1}`,
  }));
  const stacked = Array.from({ length: 7 }, (_, i) => ({
    label: `W${i + 1}`,
    values: [4 + i, 7, 9 - (i % 4), 5],
  }));
  const spark = [3, 5, 4, 8, 6, 11, 9, 14, 10, 17, 15, 21];
  const bubbles = [
    { id: 1, label: "Drama", value: 80, color: "var(--viz-1)" },
    { id: 2, label: "Comedy", value: 55, color: "var(--viz-2)" },
    { id: 3, label: "Sci-Fi", value: 40, color: "var(--viz-3)" },
    { id: 4, label: "Action", value: 30, color: "var(--viz-4)" },
    { id: 5, label: "Horror", value: 18, color: "var(--viz-5)" },
  ];
  const peak = [
    { label: "Morning", fraction: 0.1 },
    { label: "Afternoon", fraction: 0.35 },
    { label: "Evening", fraction: 1 },
    { label: "Night", fraction: 0.2 },
  ];
  const genres = [
    { label: "Fantasy", value: 15 },
    { label: "Sci-Fi", value: 14 },
    { label: "Drama", value: 13 },
    { label: "Action", value: 12 },
    { label: "Adventure", value: 12 },
    { label: "Animation", value: 7 },
    { label: "Crime", value: 7 },
    { label: "Comedy", value: 6 },
    { label: "Mystery", value: 6 },
    { label: "Anime", value: 4 },
  ].map((g) => ({ ...g, sublabel: `${g.value} shows` }));
</script>

<main>
  <section>
    <h2>Line</h2>
    <p class="caption tag secondary">
      Smooth monotone line, morphs on data change, glow + draw-in.
    </p>
    <div class="demo card"><LineChart data={series} /></div>
  </section>

  <section>
    <h2>Area</h2>
    <p class="caption tag secondary">Line primitive with the floor filled.</p>
    <div class="demo card"><AreaChart data={series} seriesIndex={2} /></div>
  </section>

  <section>
    <h2>Bar</h2>
    <p class="caption tag secondary">
      Peak-highlighted (left) vs evenly weighted (right).
    </p>
    <div class="row">
      <div class="demo card"><BarChart data={distribution} /></div>
      <div class="demo card">
        <BarChart data={distribution} highlightPeak={false} seriesIndex={1} />
      </div>
    </div>
  </section>

  <section>
    <h2>Stacked Bar</h2>
    <p class="caption tag secondary">Multi-series, one color slot per series.</p>
    <div class="demo card">
      <StackedBarChart
        data={stacked}
        seriesLabels={["Movies", "Shows", "Episodes", "Other"]}
      />
    </div>
  </section>

  <section>
    <h2>Sparkline</h2>
    <p class="caption tag secondary">Minimal trend, no axes or interaction.</p>
    <div class="row">
      <div class="demo card short"><Sparkline values={spark} showArea /></div>
      <div class="demo card short">
        <Sparkline values={spark} seriesIndex={4} />
      </div>
    </div>
  </section>

  <section>
    <h2>Distribution Bar</h2>
    <p class="caption tag secondary">
      SOT meter base - shared by peak-hours, daily, usage. Horizontal + vertical.
    </p>
    <div class="card meter-card">
      {#each peak as row, i (row.label)}
        <div class="meter-row">
          <span class="meter-label tag">{row.label}</span>
          <div class="meter-bar">
            <DistributionBar
              fraction={row.fraction}
              index={i}
              active={row.fraction === 1}
            />
          </div>
        </div>
      {/each}
    </div>
    <div class="card vbar-card">
      {#each distribution as point, i (point.label)}
        <div class="vbar-col">
          <DistributionBar
            orientation="vertical"
            fraction={point.value / 6800}
            index={i}
            --distribution-bar-thickness="60%"
          />
        </div>
      {/each}
    </div>
  </section>

  <section>
    <h2>Segmented Bar</h2>
    <p class="caption tag secondary">
      One proportional bar split by category (e.g. genres) - shared gloss,
      outer-corner rounding, alternating labels.
    </p>
    <div class="card"><SegmentedBar items={genres} label="Genres" /></div>
  </section>

  <section>
    <h2>KPI Tile</h2>
    <p class="caption tag secondary">
      SOT headline metric - caption + value (+ optional delta/icon). Normal and
      large.
    </p>
    <div class="kpi-row">
      <div class="card kpi-demo">
        <KpiTile label="Daily Average">
          2h 11m
          {#snippet delta()}
            <span class="delta-up bold tag">-18h 8m</span>
          {/snippet}
        </KpiTile>
      </div>
      <div class="card kpi-demo">
        <KpiTile label="Waking Hours">
          2%
          {#snippet delta()}
            <span class="delta-down bold tag">-34%</span>
          {/snippet}
        </KpiTile>
      </div>
      <div class="card kpi-demo">
        <KpiTile label="Trakt Rating" size="large">75%</KpiTile>
      </div>
    </div>
  </section>

  <section>
    <h2>Bubble</h2>
    <p class="caption tag secondary">Circle-pack by value.</p>
    <div class="demo card bubble"><BubbleChart items={bubbles} /></div>
  </section>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    padding: var(--ni-32) var(--ni-16);
    max-width: var(--ni-960);
  }

  section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  h2 {
    margin: 0;
  }

  .caption {
    margin: 0;
  }

  .card {
    background: var(--color-card-background);
    border-radius: var(--border-radius-l);
    padding: var(--ni-16);
  }

  .demo {
    height: var(--ni-180);
  }

  .demo.short {
    height: var(--ni-56);
  }

  .demo.bubble {
    height: var(--ni-320);
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-m);
  }

  .meter-card {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
  }

  .meter-row {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
  }

  .meter-label {
    width: var(--ni-80);
    flex-shrink: 0;
  }

  .meter-bar {
    flex: 1;
  }

  .vbar-card {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    gap: var(--ni-8);
    height: var(--ni-160);
  }

  .vbar-col {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
  }

  .kpi-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--gap-m);
  }

  .kpi-demo {
    height: var(--ni-120);
  }

  .delta-up {
    color: var(--color-background-trend-up-background-tag);
  }

  .delta-down {
    color: var(--color-background-trend-down-background-tag);
  }
</style>
