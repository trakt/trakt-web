<script lang="ts">
  import BubbleChart from "$lib/components/charts/BubbleChart.svelte";
  import type { YirCompany } from "$lib/requests/models/YirDetail.ts";
  import type { Snippet } from "svelte";

  type CompanyTooltipArgs = {
    company: YirCompany;
  };

  type YirCompaniesBubbleChartProps = {
    companies: YirCompany[];
    /**
     * Receives the resolved company so consumers can format the tooltip
     * (label + plural unit) however they need without re-implementing the
     * lookup back from BubbleChart's generic item shape.
     */
    tooltip: Snippet<[CompanyTooltipArgs]>;
  };

  const {
    companies,
    tooltip: tooltipSnippet,
  }: YirCompaniesBubbleChartProps = $props();

  // Companies with no brand color or with a pure-black brand color would
  // collapse onto the panel background; fall back to a neutral semantic
  // gray that reads on both the light and dark YIR surface. Carbon writes
  // the value as an inline SVG fill, so `var(...)` strings resolve at
  // render time at the SVG node.
  const fallbackColor = "var(--color-yir-text-muted)";
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

  const companyById = $derived(
    new Map(companies.map((c) => [c.id, c] as const)),
  );
</script>

<BubbleChart {items}>
  {#snippet tooltip({ item })}
    {@const company = companyById.get(item.id)}
    {#if company}
      {@render tooltipSnippet({ company })}
    {/if}
  {/snippet}
</BubbleChart>
