<script lang="ts">
  import YirTooltip from "../../_internal/YirTooltip.svelte";
  import YirCompaniesBubbleChart from "../../_internal/YirCompaniesBubbleChart.svelte";
  import type { YirCompany } from "$lib/requests/models/YirDetail.ts";

  type YirNetworksChartProps = {
    companies: YirCompany[];
    type?: "shows" | "movies";
  };

  const { companies, type = "shows" }: YirNetworksChartProps = $props();

  function itemLabelFor(count: number): string {
    if (type === "movies") return count === 1 ? "movie" : "movies";
    return count === 1 ? "show" : "shows";
  }
</script>

<div class="yir-networks-chart">
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
  .yir-networks-chart {
    width: 100%;
    height: var(--height-bubble-chart);
  }
</style>
