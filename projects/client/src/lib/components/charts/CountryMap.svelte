<script lang="ts">
  import "@carbon/charts-svelte/styles.css";
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver.ts";
  import { ChoroplethChart } from "@carbon/charts-svelte";
  import { flushSync } from "svelte";
  import { loadGeo } from "./_internal/loadGeo.ts";
  import type {
    CountryMapProps,
    CountryMapTooltipArgs,
  } from "./models/CountryMapProps.ts";

  const { data, tooltip }: CountryMapProps = $props();

  function buildGradientStops(from: string, to: string): string[] {
    return [30, 40, 50, 60, 70, 80, 90].map(
      (p) => `color-mix(in srgb, ${from} ${p}%, ${to})`,
    );
  }

  const colorStops = $derived(
    buildGradientStops(
      "var(--color-map-chart-highlight)",
      "var(--color-map-chart-background)",
    ),
  );

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
  // hidden container and hand Carbon its markup.
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
</script>

<div class="trakt-country-map" use:observeWidth use:observeHeight>
  {#await loadGeo() then geoData}
    {#if $observedWidth > 0 && $observedHeight > 0}
      <ChoroplethChart
        data={carbonData}
        options={{
          geoData,
          thematic: { projection: "geoNaturalEarth1" },
          color: { gradient: { colors: colorStops } },
          legend: { enabled: false },
          toolbar: { enabled: false },
          tooltip: { enabled: tooltip != null, customHTML },
          resizable: false,
          width: `${$observedWidth}px`,
          height: `${$observedHeight}px`,
        }}
      />
    {/if}
  {/await}

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
  @use "$style/scss/mixins/index" as *;

  .trakt-country-map {
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
      stroke: var(--color-map-chart-border);
      stroke-width: 0.5;
      vector-effect: non-scaling-stroke;
      cursor: pointer;
      transition: filter var(--transition-increment) ease;
    }

    // Unwatched countries are merged into one shape, carbon inlines the fill color,
    // and the only way to change it is via an !important rule.
    :global(g.missing-data path) {
      fill: var(--color-map-chart-missing) !important;
      stroke: var(--color-map-chart-border);
      stroke-width: 0.5;
      vector-effect: non-scaling-stroke;
    }

    @include for-mouse {
      :global(g.geo path:hover) {
        filter: brightness(1.4);
      }
    }
  }

  // Carbon mounts the tooltip outside the chart holder; flatten its wrapper so
  // the consumer snippet's styling shows through cleanly.
  :global(.cds--cc--tooltip) {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
  }
</style>
