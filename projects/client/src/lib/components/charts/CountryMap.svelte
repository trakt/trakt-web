<script lang="ts">
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { geoNaturalEarth1, geoPath } from "d3";
  import {
    type CountryFeature,
    loadCountryFeatures,
  } from "./_internal/loadCountryFeatures.ts";
  import type {
    CountryMapProps,
    CountryMapTooltipArgs,
  } from "./models/CountryMapProps.ts";

  const { data, tooltip, label = "Country map" }: CountryMapProps = $props();

  const valueByCode = $derived(
    new Map(data.map((datum) => [datum.code.toLowerCase(), datum.value])),
  );
  const values = $derived(data.map((datum) => datum.value));
  const maxValue = $derived(values.length > 0 ? Math.max(...values) : 0);
  const minValue = $derived(values.length > 0 ? Math.min(...values) : 0);

  const { observedDimension: observedWidth, observeDimension: observeWidth } =
    useDimensionObserver("width");
  const { observedDimension: observedHeight, observeDimension: observeHeight } =
    useDimensionObserver("height");

  let features = $state<CountryFeature[]>([]);
  $effect(() => {
    let active = true;
    loadCountryFeatures()
      .then((collection) => {
        if (active) features = collection.features;
      })
      .catch(() => {/* loadCountryFeatures already logs the failure */});
    return () => {
      active = false;
    };
  });

  type RenderedCountry = {
    code: string;
    path: string;
    fill: string;
    value: number | undefined;
    interactive: boolean;
  };

  // Tint a watched country across the same 30%→90% highlight band the Carbon
  // scale used, so a single play stays visible and the most-watched country
  // reads as the strongest.
  function fillFor(value: number): string {
    const range = maxValue - minValue;
    const ratio = range > 0 ? (value - minValue) / range : 1;
    const percentage = 30 + ratio * 60;
    return `color-mix(in srgb, var(--color-map-chart-highlight) ${percentage}%, var(--color-map-chart-background))`;
  }

  // Fit the projection to the WHOLE world, not just the watched countries, so
  // the map is always centred regardless of where the user's countries cluster
  // (a northern-only set would otherwise push the globe off-centre and clip).
  const rendered = $derived.by<RenderedCountry[]>(() => {
    const width = $observedWidth;
    const height = $observedHeight;
    if (width === 0 || height === 0 || features.length === 0) return [];

    const projection = geoNaturalEarth1().fitSize([width, height], {
      type: "FeatureCollection",
      features,
    });
    const toPath = geoPath(projection);

    return features.map((feature) => {
      const code = feature.properties.code;
      const value = valueByCode.get(code);
      const interactive = value != null;
      return {
        code,
        value,
        interactive,
        path: toPath(feature) ?? "",
        fill: interactive ? fillFor(value) : "var(--color-map-chart-missing)",
      };
    });
  });

  let hovered = $state<RenderedCountry | null>(null);
  let pointer = $state({ x: 0, y: 0 });

  // Delegated from the figure so individual countries stay plain (non-focusable,
  // non-interactive) SVG paths; only watched countries surface a tooltip.
  function resolveCountry(event: PointerEvent): RenderedCountry | null {
    const target = event.target;
    if (!(target instanceof SVGPathElement)) return null;
    const index = Number(target.dataset.index);
    const country = rendered[index];
    return country?.interactive ? country : null;
  }

  function trackPointer(event: PointerEvent) {
    const country = resolveCountry(event);
    if (!country) {
      // Over a gap, the map background, or an unwatched country — drop the
      // tooltip. Safe to always clear since the tooltip is pointer-events: none.
      hovered = null;
      return;
    }
    hovered = country;
    pointer = { x: event.clientX, y: event.clientY };
  }

  function movePointer(event: PointerEvent) {
    if (hovered) pointer = { x: event.clientX, y: event.clientY };
  }

  function clearPointer(event: PointerEvent) {
    // Touch fires a synthetic leave right after a tap; keep the tooltip pinned
    // there (mirrors the other charts' interaction).
    if (event.pointerType !== "mouse") return;
    hovered = null;
  }

  const tooltipArgs = $derived<CountryMapTooltipArgs | null>(
    hovered ? { code: hovered.code, value: hovered.value ?? 0 } : null,
  );
</script>

<figure
  class="trakt-country-map"
  use:observeWidth
  use:observeHeight
  onpointerover={trackPointer}
  onpointerdown={trackPointer}
  onpointermove={movePointer}
  onpointerleave={clearPointer}
  role="presentation"
>
  <figcaption class="viz-caption">{label}</figcaption>

  <svg
    width={$observedWidth}
    height={$observedHeight}
    viewBox={`0 0 ${$observedWidth} ${$observedHeight}`}
    role="img"
    aria-label={label}
  >
    {#each rendered as country, index (index)}
      <path
        class="country"
        class:is-interactive={country.interactive}
        data-index={index}
        d={country.path}
        style:fill={country.fill}
      />
    {/each}
  </svg>

  {#if tooltip && tooltipArgs && hovered}
    <div
      class="country-map-tooltip"
      style:left="{pointer.x}px"
      style:top="{pointer.y}px"
    >
      {@render tooltip(tooltipArgs)}
    </div>
  {/if}
</figure>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-country-map {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;

    svg {
      display: block;
    }

    .country {
      stroke: var(--color-map-chart-border);
      stroke-width: 0.5;
      vector-effect: non-scaling-stroke;
      transition: filter var(--transition-increment) ease;
    }

    .country.is-interactive {
      cursor: pointer;
    }

    @include for-mouse {
      .country.is-interactive:hover {
        filter: brightness(1.4);
      }
    }

    .viz-caption {
      @include visually-hidden;
    }
  }

  .country-map-tooltip {
    position: fixed;
    pointer-events: none;
    transform: translate(-50%, calc(-100% - var(--ni-12)));
    z-index: var(--layer-top);
  }
</style>
