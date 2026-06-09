<script module lang="ts">
  // GeoJSON types come from d3 (re-exported from @types/d3-geo) — a bare
  // "geojson" import isn't a resolvable specifier in this project.
  import type { ExtendedFeatureCollection } from "d3";

  // Shared across CountryMap instances (e.g. the shows + movies maps on the
  // same page) so the geo asset is fetched once per URL, not per instance.
  const geoCache: Record<string, Promise<ExtendedFeatureCollection>> = {};

  function loadGeo(url: string): Promise<ExtendedFeatureCollection> {
    const cached = geoCache[url];
    if (cached) return cached;
    const pending = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch map geometry: ${response.statusText}`);
        }
        return response.json() as Promise<ExtendedFeatureCollection>;
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
  import { type ExtendedFeature, geoNaturalEarth1, geoPath } from "d3";
  import type { CountryMapProps } from "./models/CountryMapProps.ts";

  // Graduated red: deeper for the long tail, vivid for the most-watched.
  function defaultColorFor(value: number, max: number): string {
    const t = max > 1 ? (value - 1) / (max - 1) : 1;
    const pct = 45 + Math.round(t * 40);
    return `color-mix(in srgb, var(--red-500) ${pct}%, var(--shade-900))`;
  }

  const {
    data,
    geoUrl = "/geo/world-countries-50m.geojson",
    colorFor = defaultColorFor,
    tooltip,
  }: CountryMapProps = $props();

  let features = $state<ExtendedFeature[]>([]);

  $effect(() => {
    let cancelled = false;
    loadGeo(geoUrl)
      .then((collection) => {
        if (!cancelled) features = collection.features;
      })
      .catch((error) => {
        console.error("Failed to load country map geometry:", error);
      });
    return () => {
      cancelled = true;
    };
  });

  // Width and height both come from the container so consumers size the map
  // however they like; the projection refits whenever either changes.
  const { observedDimension: observedWidth, observeDimension: observeWidth } =
    useDimensionObserver("width");
  const { observedDimension: observedHeight, observeDimension: observeHeight } =
    useDimensionObserver("height");

  // Normalize codes to lowercase on both sides so a mixed-case API value
  // still matches the geo asset's lowercase feature codes.
  const valueByCode = $derived(
    new Map(
      data.map((datum) => [datum.code.toLowerCase(), datum.value] as const),
    ),
  );
  const maxValue = $derived(Math.max(1, ...data.map((datum) => datum.value)));

  const pathGenerator = $derived.by(() => {
    const width = $observedWidth;
    const height = $observedHeight;
    if (features.length === 0 || width === 0 || height === 0) return null;

    const projection = geoNaturalEarth1().fitSize([width, height], {
      type: "FeatureCollection",
      features,
    });
    return geoPath(projection);
  });

  // `d` strings depend only on the projection (size), so hovering never
  // recomputes them — only the cheap fill/class bindings re-run.
  const geoPaths = $derived.by(() => {
    const generate = pathGenerator;
    if (!generate) return [];
    return features.map((feature, index) => ({
      index,
      code: (feature.properties?.code as string | undefined)?.toLowerCase() ??
        null,
      d: generate(feature) ?? "",
    }));
  });

  let hoveredCode = $state<string | null>(null);
  let pointer = $state({ x: 0, y: 0 });

  const hoveredValue = $derived(
    hoveredCode ? valueByCode.get(hoveredCode) : undefined,
  );

  function handleEnter(code: string | null, event: PointerEvent) {
    if (code === null) return;
    hoveredCode = code;
    pointer = { x: event.clientX, y: event.clientY };
  }

  function handleMove(event: PointerEvent) {
    if (hoveredCode === null) return;
    pointer = { x: event.clientX, y: event.clientY };
  }

  function handleLeave() {
    hoveredCode = null;
  }
</script>

<div
  class="country-map"
  use:observeWidth
  use:observeHeight
  onpointermove={handleMove}
  onpointerleave={handleLeave}
  role="presentation"
>
  <svg
    width={$observedWidth}
    height={$observedHeight}
    role="group"
    aria-label="World map"
  >
    {#each geoPaths as country (country.index)}
      {@const value = country.code ? valueByCode.get(country.code) : undefined}
      <path
        d={country.d}
        class="country"
        class:watched={value !== undefined}
        class:hovered={value !== undefined && country.code === hoveredCode}
        style:fill={value !== undefined ? colorFor(value, maxValue) : null}
        onpointerenter={value !== undefined
          ? (event) => handleEnter(country.code, event)
          : null}
        onpointerleave={value !== undefined ? handleLeave : null}
        role={value !== undefined ? "img" : null}
        aria-label={value !== undefined ? country.code : null}
      />
    {/each}
  </svg>

  {#if tooltip && hoveredCode && hoveredValue !== undefined}
    <div
      class="country-map-tooltip"
      style:left="{pointer.x}px"
      style:top="{pointer.y}px"
    >
      {@render tooltip({ code: hoveredCode, value: hoveredValue })}
    </div>
  {/if}
</div>

<style lang="scss">
  .country-map {
    position: relative;
    width: 100%;
    height: 100%;

    svg {
      display: block;
    }
  }

  .country {
    fill: var(--shade-800);
    stroke: var(--shade-950);
    stroke-width: 0.5;
    // Keep borders hairline-thin regardless of how far the projection scales
    // the geometry up to fill the container.
    vector-effect: non-scaling-stroke;
  }

  .country.watched {
    cursor: pointer;
    transition: filter var(--transition-increment) ease;
  }

  .country.watched.hovered {
    filter: brightness(1.4);
    stroke: var(--shade-10);
    stroke-width: 1;
  }

  .country-map-tooltip {
    position: fixed;
    pointer-events: none;
    transform: translate(-50%, calc(-100% - var(--ni-12)));
    z-index: var(--layer-top);
  }
</style>
