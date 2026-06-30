<script lang="ts">
  import YirTooltip from "./YirTooltip.svelte";
  import YirCompaniesBubbleChart from "./YirCompaniesBubbleChart.svelte";
  import { yirMediaUnit } from "./yirMediaUnit.ts";
  import type { YirCompany } from "$lib/requests/models/YirDetail.ts";

  type YirNetworksChartProps = {
    companies: YirCompany[];
    type?: "shows" | "movies";
  };

  const { companies, type = "shows" }: YirNetworksChartProps = $props();

  function itemLabelFor(count: number): string {
    return yirMediaUnit(type, count);
  }
</script>

<div class="trakt-yir-networks-chart">
  <YirCompaniesBubbleChart {companies}>
    {#snippet tooltip({ company })}
      <YirTooltip
        main={company.name}
        sub="{company.count} {itemLabelFor(company.count)}"
      />
    {/snippet}
  </YirCompaniesBubbleChart>
</div>

<style lang="scss">
  .trakt-yir-networks-chart {
    width: 100%;
    height: var(--height-bubble-chart);
  }
</style>
