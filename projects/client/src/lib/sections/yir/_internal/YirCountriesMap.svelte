<script lang="ts">
  import CountryMap from "$lib/components/charts/CountryMap.svelte";
  import type { YirCountry } from "$lib/requests/models/YirDetail.ts";
  import type { Snippet } from "svelte";

  type CountryTooltipArgs = {
    country: YirCountry;
  };

  type YirCountriesMapProps = {
    countries: YirCountry[];
    /**
     * Receives the resolved country so consumers format the tooltip (localized
     * name + plural unit) without re-deriving it from the map's code/value.
     */
    tooltip: Snippet<[CountryTooltipArgs]>;
    /** CSS color token tinting watched countries; overridable per template. */
    highlight?: string;
  };

  const {
    countries,
    tooltip: tooltipSnippet,
    // Default to the primary viz purple so every YIR map matches the charts
    // (e.g. the release-years bars); a template can still override it.
    highlight = "var(--viz-1)",
  }: YirCountriesMapProps = $props();

  const data = $derived(
    countries.map((country) => ({ code: country.code, value: country.count })),
  );

  const countryByCode = $derived(
    new Map(
      countries.map(
        (country) => [country.code.toLowerCase(), country] as const,
      ),
    ),
  );
</script>

<CountryMap
  {data}
  --color-map-chart-background="var(--color-yir-surface-raised)"
  --color-map-chart-highlight={highlight}
>
  {#snippet tooltip({ code })}
    {@const country = countryByCode.get(code)}
    {#if country}
      {@render tooltipSnippet({ country })}
    {/if}
  {/snippet}
</CountryMap>
