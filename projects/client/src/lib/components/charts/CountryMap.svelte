<script module lang="ts">
  import type { ChoroplethChartOptions } from "@carbon/charts-svelte";

  type GeoData = ChoroplethChartOptions["geoData"];

  // Shared across CountryMap instances (e.g. the shows + movies maps on the
  // same page) so the topology is fetched once per URL, not per instance.
  const geoCache: Record<string, Promise<GeoData>> = {};

  function loadGeo(url: string): Promise<GeoData> {
    const cached = geoCache[url];
    if (cached) return cached;
    const pending = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch map geometry: ${response.statusText}`);
        }
        return response.json() as Promise<GeoData>;
      })
      .catch((error) => {
        // Drop the rejected promise so a remount can retry instead of
        // permanently serving the cached failure.
        delete geoCache[url];
        throw error;
      });
    geoCache[url] = pending;
    return pending;
  }
</script>

<script lang="ts">
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver.ts";
  import { ChoroplethChart } from "@carbon/charts-svelte";
  import "@carbon/charts-svelte/styles.css";
  import { flushSync } from "svelte";
  import type {
    CountryMapProps,
    CountryMapTooltipArgs,
  } from "./models/CountryMapProps.ts";

  // Graduated red stops; Carbon quantizes the watched values across them
  // (deeper for the long tail, vivid for the most-watched).
  const colorStops = [
    "color-mix(in srgb, var(--red-500) 45%, var(--shade-900))",
    "color-mix(in srgb, var(--red-500) 52%, var(--shade-900))",
    "color-mix(in srgb, var(--red-500) 59%, var(--shade-900))",
    "color-mix(in srgb, var(--red-500) 66%, var(--shade-900))",
    "color-mix(in srgb, var(--red-500) 73%, var(--shade-900))",
    "color-mix(in srgb, var(--red-500) 80%, var(--shade-900))",
    "color-mix(in srgb, var(--red-500) 88%, var(--shade-900))",
  ];

  const {
    data,
    geoUrl = "/geo/world-countries-50m.topojson",
    tooltip,
  }: CountryMapProps = $props();

  let geoData = $state<GeoData | null>(null);

  $effect(() => {
    let cancelled = false;
    loadGeo(geoUrl)
      .then((topology) => {
        if (!cancelled) geoData = topology;
      })
      .catch((error) => {
        console.error("Failed to load country map geometry:", error);
      });
    return () => {
      cancelled = true;
    };
  });

  // Carbon joins each row to a geometry by `name` ↔ feature.properties.NAME,
  // which the topology keys to lowercase alpha-2 codes.
  const carbonData = $derived(
    data.map((datum) => ({
      name: datum.code.toLowerCase(),
      value: datum.value,
    })),
  );

  const { observedDimension: observedWidth, observeDimension: observeWidth } =
    useDimensionObserver("width");
  const { observedDimension: observedHeight, observeDimension: observeHeight } =
    useDimensionObserver("height");

  // Carbon tooltips are HTML strings, so render the consumer snippet to a
  // hidden container and hand Carbon its markup (mirrors AreaChart's bridge).
  let tooltipContainer: HTMLDivElement | undefined = $state();
  let tooltipArgs: CountryMapTooltipArgs | null = $state(null);

  const customHTML = $derived(
    (items: Array<{ label: string; value: number }>) => {
      if (!tooltip || !tooltipContainer || !items?.length) return "";
      const item = items[0];
      tooltipArgs = { code: String(item.label), value: item.value };
      flushSync();
      return tooltipContainer.innerHTML;
    },
  );

  const options: ChoroplethChartOptions | undefined = $derived(
    geoData
      ? {
        geoData,
        thematic: { projection: "geoNaturalEarth1" },
        color: { gradient: { colors: colorStops } },
        legend: { enabled: false },
        toolbar: { enabled: false },
        tooltip: { enabled: tooltip != null, customHTML },
        resizable: false,
        width: `${$observedWidth}px`,
        height: `${$observedHeight}px`,
      }
      : undefined,
  );
</script>

<div class="country-map" use:observeWidth use:observeHeight>
  {#if options && $observedWidth > 0 && $observedHeight > 0}
    <ChoroplethChart data={carbonData} {options} />
  {/if}

  <!--
    Carbon has no snippet-tooltip API, so render the snippet to a hidden
    container and pull its HTML into Carbon's customHTML renderer.
  -->
  <div bind:this={tooltipContainer} style="display:none" aria-hidden="true">
    {#if tooltip && tooltipArgs}
      {@render tooltip(tooltipArgs)}
    {/if}
  </div>
</div>

<style lang="scss">
  .country-map {
    position: relative;
    width: 100%;
    height: 100%;

    :global(.cds--chart-holder) {
      width: 100%;
      height: 100%;
      background: transparent;
    }

    // Watched countries — hairline dark borders, brighten on hover. Fill comes
    // from Carbon's quantized color scale (inline style), so it's left alone.
    :global(g.geo path) {
      stroke: var(--shade-950);
      stroke-width: 0.5;
      vector-effect: non-scaling-stroke;
      cursor: pointer;
      transition: filter var(--transition-increment) ease;
    }

    :global(g.geo path:hover) {
      filter: brightness(1.4);
      stroke: var(--shade-10);
      stroke-width: 1;
    }

    // Unwatched countries are merged into one shape — fill a solid base shade
    // instead of Carbon's striped "missing data" pattern.
    :global(g.missing-data path) {
      fill: var(--shade-800) !important;
      stroke: var(--shade-950);
      stroke-width: 0.5;
      vector-effect: non-scaling-stroke;
    }
  }

  // Carbon mounts the tooltip outside the chart holder; flatten its wrapper so
  // the consumer snippet's styling shows through cleanly (mirrors AreaChart).
  :global(.cds--cc--tooltip) {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
  }
</style>
