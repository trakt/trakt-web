<script lang="ts">
  import AreaChart from "$lib/components/charts/AreaChart.svelte";
  import type { AreaChartProps } from "$lib/components/charts/models/AreaChartProps";

  const { data, tooltip }: AreaChartProps = $props();
</script>

<div class="yir-2024-line-chart">
  <!--
    2024 palette: white line, dark fill (~v2's #222 → shade-920), and a
    purple-500 hover pin with a faint white halo. Colors are passed as props
    (rather than via CSS vars on the wrapper) because Carbon resolves
    `color.scale.value` at chart-init context, where Svelte-scoped wrapper
    vars aren't accessible.
  -->
  <AreaChart
    {data}
    {tooltip}
    lineColor="var(--shade-10)"
    fillColor="var(--shade-920)"
    dotColor="var(--purple-500)"
    dotHaloColor="var(--shade-10)"
  />
</div>

<style lang="scss">
  .yir-2024-line-chart {
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
