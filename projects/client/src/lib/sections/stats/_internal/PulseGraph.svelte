<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PulseGraphItem } from "./models/PulseGraphItem";
  import type { PulseGraphType } from "./models/PulseGraphType";
  import PulseGraphPeakHours from "./PulseGraphPeakHours.svelte";
  import PulseGraphScreenTimeDaily from "./PulseGraphScreenTimeDaily.svelte";

  const { item }: { item: PulseGraphItem } = $props();

  const titles: Record<PulseGraphType, string> = {
    peakHours: m.header_stats_graph_peak(),
    screenTimeDaily: m.header_stats_graph_screen_time_daily(),
  };

  const title = $derived(titles[item.kind]);
</script>

<Card
  --width-card="calc(2 * var(--width-pulse-card) + var(--list-gap))"
  --height-card="var(--height-pulse-card)"
>
  <div class="trakt-pulse-graph">
    <p>{title}</p>

    {#if item.kind === "peakHours"}
      <PulseGraphPeakHours data={item.data} />
    {:else if item.kind === "screenTimeDaily"}
      <PulseGraphScreenTimeDaily data={item.data} />
    {/if}
  </div>
</Card>

<style lang="scss">
  .trakt-pulse-graph {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    padding: var(--ni-16);
    overflow: hidden;
    height: 100%;
    box-sizing: border-box;
  }
</style>
