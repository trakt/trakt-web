<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PulseGraphData } from "./models/PulseGraphData";
  import type { PulseGraphType } from "./models/PulseGraphType";
  import PulseGraphDailyBars from "./PulseGraphDailyBars.svelte";
  import PulseGraphRatings from "./PulseGraphRatings.svelte";
  import PulseGraphShowsMovies from "./PulseGraphShowsMovies.svelte";
  import PulseGraphWatchClock from "./PulseGraphWatchClock.svelte";
  import PulseGraphWeekTrend from "./PulseGraphWeekTrend.svelte";

  const { kind, data }: { kind: PulseGraphType; data: PulseGraphData } =
    $props();

  const titles: Record<PulseGraphType, string> = {
    dailyBars: m.header_stats_graph_daily(),
    weekTrend: m.header_stats_graph_trend(),
    watchClock: m.header_stats_graph_peak(),
    showsMovies: m.header_stats_graph_shows_movies(),
    ratingsDistribution: m.header_stats_graph_ratings(),
  };

  const title = $derived(titles[kind]);
</script>

<Card
  --width-card="calc(2 * var(--width-pulse-card) + var(--list-gap))"
  --height-card="var(--height-pulse-card)"
>
  <div class="trakt-pulse-graph">
    <p class="trakt-pulse-graph-title">{title}</p>

    {#if kind === "dailyBars"}
      <PulseGraphDailyBars data={data.dailyBars} />
    {:else if kind === "weekTrend"}
      <PulseGraphWeekTrend data={data.weekTrend} />
    {:else if kind === "watchClock"}
      <PulseGraphWatchClock data={data.watchClock} />
    {:else if kind === "showsMovies"}
      <PulseGraphShowsMovies data={data.showsMovies} />
    {:else if kind === "ratingsDistribution"}
      <PulseGraphRatings data={data.ratingsDistribution} />
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
    height: 100%;
    box-sizing: border-box;
  }

  .trakt-pulse-graph-title {
    font-size: var(--ni-11);
    font-weight: 600;
    color: var(--shade-400);
  }
</style>
