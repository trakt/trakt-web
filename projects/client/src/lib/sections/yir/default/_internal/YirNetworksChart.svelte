<script lang="ts">
  import BubbleChart from "$lib/components/charts/BubbleChart.svelte";
  import type { YirCompany } from "$lib/requests/models/YirDetail";
  import YirTooltip from "../../_internal/YirTooltip.svelte";

  const {
    companies,
    type = "shows",
  }: {
    companies: YirCompany[];
    type?: "shows" | "movies";
  } = $props();

  const fallbackColor = "#333";
  const blackPattern = /^#0{3}(?:0{3})?$/i;

  function colorFor(company: YirCompany): string {
    const raw = (company.color ?? "").toLowerCase();
    if (!raw || blackPattern.test(raw)) return fallbackColor;
    return company.color ?? fallbackColor;
  }

  const items = $derived(
    companies.map((c) => ({
      id: c.id,
      label: c.name,
      value: c.count,
      imageUrl: c.imageUrl,
      color: colorFor(c),
    })),
  );

  function itemLabelFor(count: number): string {
    if (type === "movies") return count === 1 ? "movie" : "movies";
    return count === 1 ? "show" : "shows";
  }
</script>

<div class="yir-networks-chart">
  <BubbleChart {items}>
    {#snippet tooltip({ item })}
      <YirTooltip
        main={item.label}
        sub="{item.value} {itemLabelFor(item.value)}"
      />
    {/snippet}
  </BubbleChart>
</div>

<style lang="scss">
  .yir-networks-chart {
    width: 100%;
    height: var(--height-bubble-chart);
  }
</style>
