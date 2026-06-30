<script lang="ts">
  import LineChart from "./LineChart.svelte";
  import type { AreaChartProps } from "./models/AreaChartProps.ts";

  // Compose, don't fork: an area chart is a LineChart with the floor filled in.
  // The legacy color props are preserved so existing consumers stay drop-in;
  // omit them to fall back to the seriesIndex-driven --viz-* tokens (which also
  // gives the gradient fade + glow for free).
  const {
    data,
    tooltip,
    seriesIndex = 0,
    lineColor,
    fillColor,
    dotColor,
    dotHaloColor,
    label = "Area chart",
    height = "var(--height-area-chart)",
  }: AreaChartProps = $props();
</script>

<LineChart
  {data}
  {tooltip}
  {seriesIndex}
  {dotHaloColor}
  {label}
  {height}
  showArea
  color={lineColor}
  {fillColor}
  {dotColor}
/>
