<script lang="ts">
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { geoNaturalEarth1, geoPath } from "d3";
  import { onMount } from "svelte";
  import { createMapInteraction } from "./_internal/createMapInteraction.svelte.ts";
  import {
    type CountryFeature,
    loadCountryFeatures,
  } from "./_internal/loadCountryFeatures.ts";
  import type {
    CountryMapProps,
    CountryMapTooltipArgs,
  } from "./models/CountryMapProps.ts";

  const { data, tooltip, label = "Country map" }: CountryMapProps = $props();

  // When the pointer is within this many px of the map's top edge, flip the
  // tooltip below the pointer so it isn't clipped by the map's container.
  const TOOLTIP_FLIP_THRESHOLD = 56;
  // When the pointer is within this many px of a horizontal edge, anchor the
  // tooltip by its near side so a wide tooltip grows inward instead of spilling
  // past the (overflow-hidden) container.
  const TOOLTIP_EDGE_THRESHOLD = 90;

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

  // World geometry is static and loaded once; onMount (not $effect) since there
  // are no reactive deps, just a mount-time fetch. The guard drops a late
  // resolution if we unmount first. loadCountryFeatures caches across instances.
  let features = $state<CountryFeature[]>([]);
  onMount(() => {
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
    // Projected centroid in svg-local px (viewBox is 1:1 with pixels), used to
    // anchor the keyboard tooltip to the shape so it tracks the chart on scroll.
    cx: number;
    cy: number;
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
      const [cx, cy] = toPath.centroid(feature);
      return {
        code,
        value,
        interactive,
        cx,
        cy,
        path: toPath(feature) ?? "",
        fill: interactive ? fillFor(value) : "var(--color-map-chart-missing)",
      };
    });
  });

  // Keyboard traversal stops: one per watched country, most-watched first, so
  // arrows read the map the way users do rather than the asset's arbitrary
  // geometry order. Deduped by code because some countries (e.g. Australia)
  // ship as several geometries, and arrow nav should treat them as one stop.
  const interactiveCountries = $derived(
    [
      ...new Map(
        rendered
          .filter((country) => country.interactive)
          .map((country) => [country.code, country]),
      ).values(),
    ].toSorted((a, b) => (b.value ?? 0) - (a.value ?? 0)),
  );

  const interaction = createMapInteraction({
    stops: () => interactiveCountries,
    resolvePointer: (event) => {
      const target = event.target;
      if (!(target instanceof SVGPathElement)) return null;
      const country = rendered.at(Number(target.dataset.index));
      return country?.interactive ? country.code : null;
    },
    // Anchor keyboard tooltips at the country's projected centroid (svg-local,
    // same space the pointer path resolves to).
    centreOf: (code) => {
      const country = rendered.find((entry) => entry.code === code);
      return country ? { x: country.cx, y: country.cy } : null;
    },
  });

  const activeCountry = $derived(
    interaction.activeCode != null
      ? rendered.find((country) => country.code === interaction.activeCode)
      : undefined,
  );

  const tooltipArgs = $derived<CountryMapTooltipArgs | null>(
    activeCountry
      ? { code: activeCountry.code, value: activeCountry.value ?? 0 }
      : null,
  );

  // Visually-hidden readout for screen readers tracking the active country
  // (mirrors BarChart's aria-live activeReadout).
  const activeReadout = $derived(
    activeCountry
      ? `${activeCountry.code.toUpperCase()}: ${activeCountry.value ?? 0}`
      : "",
  );
</script>

<figure
  class="trakt-country-map"
  use:observeWidth
  use:observeHeight
  onpointerover={interaction.handlers.pointerover}
  onpointerdown={interaction.handlers.pointerdown}
  onpointermove={interaction.handlers.pointermove}
  onpointerleave={interaction.handlers.pointerleave}
  role="presentation"
>
  <figcaption class="viz-caption">{label}</figcaption>
  <div class="viz-caption" aria-live="polite">{activeReadout}</div>

  <!--
    The map is one keyboard widget: the <svg> is focusable and arrow keys / Home
    / End scrub between watched countries, reaching the same tooltip as pointer
    users (nested <path>s aren't reliably tabbable).
  -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <svg
    width={$observedWidth}
    height={$observedHeight}
    viewBox={`0 0 ${$observedWidth} ${$observedHeight}`}
    role="img"
    aria-label={label}
    tabindex="0"
    onkeydown={interaction.handlers.keydown}
    onblur={interaction.handlers.blur}
  >
    {#each rendered as country, index (index)}
      <path
        class="country"
        class:is-interactive={country.interactive}
        class:is-active={country.code === interaction.activeCode}
        data-index={index}
        d={country.path}
        style:fill={country.fill}
      />
    {/each}
  </svg>

  {#if tooltip && tooltipArgs}
    <div
      class="country-map-tooltip"
      class:is-below={(interaction.pointer?.y ?? 0) < TOOLTIP_FLIP_THRESHOLD}
      class:is-start={(interaction.pointer?.x ?? 0) < TOOLTIP_EDGE_THRESHOLD}
      class:is-end={$observedWidth - (interaction.pointer?.x ?? 0) <
        TOOLTIP_EDGE_THRESHOLD}
      style:left="{interaction.pointer?.x ?? 0}px"
      style:top="{interaction.pointer?.y ?? 0}px"
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
      outline: none;
    }

    svg:focus-visible {
      @include viz-focus-ring;
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

    .country.is-active {
      filter: brightness(1.4);
    }

    .viz-caption {
      @include visually-hidden;
    }
  }

  .country-map-tooltip {
    position: absolute;
    pointer-events: none;
    transform: translate(
      var(--tt-x, -50%),
      var(--tt-y, calc(-100% - var(--ni-12)))
    );
    z-index: var(--layer-top);

    // Pointer near the top edge: drop the tooltip below it so it stays inside
    // the map's clipped container.
    &.is-below {
      --tt-y: var(--ni-12);
    }

    // Pointer near a horizontal edge: anchor the tooltip by its near side so it
    // grows inward instead of spilling past the container.
    &.is-start {
      --tt-x: 0;
    }

    &.is-end {
      --tt-x: -100%;
    }
  }
</style>
