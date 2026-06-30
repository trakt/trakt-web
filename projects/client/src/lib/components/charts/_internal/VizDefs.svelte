<script lang="ts">
  // Shared SVG <defs> for every chart primitive: per-slot vertical fade
  // gradients (the "juicy" top-bright -> bottom-faded look), a generic
  // currentColor area gradient for lines/areas, and the high-contrast hatch
  // patterns. Ids are namespaced by `prefix` so charts never collide.
  //
  // stop-color/stop-opacity are CSS properties, so they resolve the --viz-*
  // tokens directly - no hardcoded colors leak in here.
  const { prefix }: { prefix: string } = $props();

  const slots = [1, 2, 3, 4, 5, 6, 7, 8];
  // Distinct hatch angle per slot for high-contrast shape encoding.
  const patternAngles = [0, 45, 90, 135, 22.5, 67.5, 112.5, 157.5];
  const patternSize = 6;
</script>

<defs>
  {#each slots as slot (slot)}
    <!--
      Bar/column fill: glossy lighter crest -> full saturated hue, fully opaque.
      Staying opaque (no fade toward transparent) stops the background bleeding
      through and keeps the fill rich instead of washed-out/cheap.
    -->
    <linearGradient id={`${prefix}-fill-${slot}`} x1="0" y1="0" x2="0" y2="1">
      <stop
        offset="0%"
        style={`stop-color: color-mix(in srgb, var(--viz-${slot}) 78%, white); stop-opacity: 1;`}
      />
      <stop
        offset="100%"
        style={`stop-color: var(--viz-${slot}); stop-opacity: 1;`}
      />
    </linearGradient>

    <pattern
      id={`${prefix}-pattern-${slot}`}
      width={patternSize}
      height={patternSize}
      patternUnits="userSpaceOnUse"
      patternTransform={`rotate(${patternAngles[slot - 1]})`}
    >
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={patternSize}
        stroke="currentColor"
        style="stroke-width: var(--viz-pattern-stroke-width);"
      />
    </pattern>
  {/each}

  <!-- Single top-down sheen, overlaid once across a whole stacked column so it
       reads as one lit unit rather than per-segment self-lit slices. -->
  <linearGradient id={`${prefix}-sheen`} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" style="stop-color: #fff; stop-opacity: 0.22;" />
    <stop offset="45%" style="stop-color: #fff; stop-opacity: 0.04;" />
    <stop offset="100%" style="stop-color: #fff; stop-opacity: 0;" />
  </linearGradient>

  <!-- Generic area fade keyed off the referencing element's `color`. -->
  <linearGradient id={`${prefix}-area`} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" style="stop-color: currentColor; stop-opacity: 0.55;" />
    <stop offset="60%" style="stop-color: currentColor; stop-opacity: 0.2;" />
    <stop
      offset="100%"
      style="stop-color: currentColor; stop-opacity: var(--viz-fade-floor);"
    />
  </linearGradient>
</defs>
