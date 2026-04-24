<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";

  const { data }: { data: number[] } = $props();

  const labels = $derived.by(() => {
    const locale = languageTag();
    return Array.from({ length: 12 }, (_, i) =>
      toHumanMonth(new Date(2021, i, 1), locale, "short"),
    );
  });

  function tooltipHTML({ value, label }: { value: number; label: string }) {
    return `
      <div class="bar-chart-tooltip">
        <div class="bar-chart-tooltip-primary">${value} ${value === 1 ? "play" : "plays"}</div>
        <div class="bar-chart-tooltip-secondary">${label}</div>
      </div>
    `;
  }
</script>

<BarChart {data} {labels} {tooltipHTML} axisInset={50} />
