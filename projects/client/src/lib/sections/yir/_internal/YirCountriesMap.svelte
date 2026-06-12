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
  };

  const { countries, tooltip: tooltipSnippet }: YirCountriesMapProps = $props();

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
  --color-map-chart-background="var(--shade-900)"
  --color-map-chart-highlight="var(--red-500)"
>
  {#snippet tooltip({ code })}
    {@const country = countryByCode.get(code)}
    {#if country}
      {@render tooltipSnippet({ country })}
    {/if}
  {/snippet}
</CountryMap>
