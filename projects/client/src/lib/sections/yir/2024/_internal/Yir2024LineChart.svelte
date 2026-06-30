<script lang="ts">
  import AreaChart from "$lib/components/charts/AreaChart.svelte";
  import type { AreaChartProps } from "$lib/components/charts/models/AreaChartProps";

  const { data, tooltip }: AreaChartProps = $props();
</script>

<div class="trakt-yir-2024-line-chart">
  <!-- Renders through the shared --viz-* palette (theme-aware) like the rest
       of the chart SOT. -->
  <AreaChart {data} {tooltip} />
</div>

<style lang="scss">
  .trakt-yir-2024-line-chart {
    width: 100%;
    height: 100%;

    // Match the 2024 template's body font; the shared AreaChart wrapper
    // defaults to whatever Carbon picks otherwise.
    :global(.cds--chart-holder) {
      --cds-charts-font-family: "Spline Sans", Helvetica, Arial, sans-serif;
      --cds-charts-font-family-condensed:
        "Spline Sans", Helvetica, Arial, sans-serif;
    }
  }
</style>
