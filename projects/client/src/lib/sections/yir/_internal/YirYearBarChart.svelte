<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import type { TooltipArgs } from "$lib/components/charts/models/BarChartProps";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import type { Snippet } from "svelte";

  const {
    data,
    tooltip: tooltipSnippet,
  }: {
    data: Array<{ label: string; value: number }>;
    tooltip: Snippet<[TooltipArgs]>;
  } = $props();

  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const isTabletLarge = useMedia(WellKnownMediaQuery.tabletLarge);
  const isTabletSmall = useMedia(WellKnownMediaQuery.tabletSmall);

  // A user's history can span 50+ years, so thin tick labels by viewport and
  // length to keep the axis legible (mirrors YirWeeklyPlaysChart's approach).
  const tickStep = $derived.by(() => {
    const base = $isDesktop ? 1 : $isTabletLarge ? 2 : $isTabletSmall ? 4 : 6;
    const maxLabels = $isDesktop ? 25 : 12;
    return Math.max(base, Math.ceil(data.length / maxLabels));
  });

  const tickLabels = $derived(
    data.map((d, i) => (i % tickStep === 0 ? d.label : "")),
  );
</script>

<BarChart {data} {tickLabels}>
  {#snippet tooltip(args)}
    {@render tooltipSnippet(args)}
  {/snippet}
</BarChart>
