<script lang="ts">
  import BubbleChart from "$lib/components/charts/BubbleChart.svelte";
  import { useQuery } from "$lib/features/query/useQuery";
  import type { YirStreamingService } from "$lib/requests/models/YirDetail.ts";
  import { streamingSourcesQuery } from "$lib/requests/queries/services/streamingSourcesQuery.ts";
  import { map } from "rxjs";
  import type { Snippet } from "svelte";

  type ServiceTooltipArgs = {
    service: YirStreamingService;
  };

  type YirStreamingBubbleChartProps = {
    services: YirStreamingService[];
    /** ISO 3166-1 alpha-2 country whose source catalog provides the logos. */
    country: string;
    tooltip: Snippet<[ServiceTooltipArgs]>;
  };

  const {
    services,
    country,
    tooltip: tooltipSnippet,
  }: YirStreamingBubbleChartProps = $props();

  // Services without a brand color fall back to a neutral semantic gray that
  // reads on both the light and dark YIR surface.
  const fallbackColor = "var(--color-yir-text-muted)";

  const sourcesQuery = useQuery(streamingSourcesQuery({}));
  const sources = sourcesQuery.pipe(map(($query) => $query.data));

  // Resolve each service's brand logo + color from the watchnow source catalog
  // (keyed by country, with an all-country fallback) so bubbles render real
  // logos rather than bare labels. `id` is the index, used to map back to the
  // service in the tooltip.
  const items = $derived.by(() => {
    const byCountry = $sources;
    const inCountry = byCountry?.get(country) ?? [];
    const everywhere = byCountry ? Array.from(byCountry.values()).flat() : [];

    return services.map((service, index) => {
      const match = inCountry.find((source) => source.source === service.source) ??
        everywhere.find((source) => source.source === service.source);

      return {
        id: index,
        label: service.name,
        value: service.all,
        imageUrl: match?.logoUrl,
        color: match?.color ?? fallbackColor,
      };
    });
  });

  const serviceByIndex = $derived(
    new Map(services.map((service, index) => [index, service] as const)),
  );
</script>

<BubbleChart {items}>
  {#snippet tooltip({ item })}
    {@const service = serviceByIndex.get(item.id)}
    {#if service}
      {@render tooltipSnippet({ service })}
    {/if}
  {/snippet}
</BubbleChart>
