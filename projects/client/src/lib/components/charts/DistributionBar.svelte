<script lang="ts">
  import { clamp } from "$lib/utils/number/clamp.ts";
  import { vizSeriesSlot } from "./vizSeriesSlot.ts";
  import type { DistributionBarProps } from "./models/DistributionBarProps.ts";

  // SOT meter bar: the single-fill building block every non-axis bar viz
  // composes (distribution rows, peak-hour bars, daily columns, usage meters).
  // One DS treatment - gradient fade, gloss, active glow, HC hatch, crisp
  // rounded ends - so a "bar" looks identical everywhere it appears.
  const {
    fraction,
    orientation = "horizontal",
    seriesIndex = 0,
    color,
    active = false,
    track = true,
    rounded = true,
    minVisible = 0,
    index = 0,
    label,
  }: DistributionBarProps = $props();

  const slot = $derived(vizSeriesSlot(seriesIndex));
  const seriesColor = $derived(color ?? `var(--viz-${slot})`);

  const clamped = $derived(clamp({ value: fraction, min: 0, max: 1 }));
  // Floor a non-zero value to `minVisible` so it never disappears.
  const shown = $derived(
    clamped > 0 ? Math.max(clamped, minVisible) : clamped,
  );
  const percent = $derived(`${shown * 100}%`);
</script>

<div
  class="trakt-distribution-bar"
  data-orientation={orientation}
  class:is-active={active}
  class:has-track={track}
  class:is-rounded={rounded}
  role="progressbar"
  aria-valuenow={Math.round(clamped * 100)}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={label}
  style="--viz-series: {seriesColor}; --viz-fill: {percent}; --i: {index};"
>
  <div class="distribution-bar-fill"></div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-distribution-bar {
    // Cross-axis size; override per consumer via the
    // `--distribution-bar-thickness` custom property (e.g. wide daily columns).
    position: relative;
    overflow: hidden;
    color: var(--viz-series);

    &.is-rounded {
      border-radius: var(--viz-bar-radius);
    }

    &.has-track {
      // Track tint; override per consumer via `--distribution-bar-track`.
      background: var(--distribution-bar-track, var(--viz-track));
    }

    &[data-orientation="horizontal"] {
      width: 100%;
      height: var(--distribution-bar-thickness, var(--ni-8));
    }

    &[data-orientation="vertical"] {
      width: var(--distribution-bar-thickness, var(--ni-8));
      height: 100%;
    }
  }

  .distribution-bar-fill {
    position: absolute;
    // Width/height (not scale) keeps the rounded end crisp at any fill level;
    // the entrance grow uses transform for a one-shot juicy reveal only.
    border-radius: inherit;
    // Opaque sheen -> full hue. Staying opaque (no fade to transparent) keeps the
    // track from bleeding through and muddying the fill; the white-mix start is a
    // glossy highlight, the full hue carries the saturation.
    background: linear-gradient(
      var(--fill-angle),
      color-mix(in srgb, var(--viz-series) 78%, white) 0%,
      var(--viz-series) 70%
    );
  }

  // High-contrast hatch overlay (shape encoding); invisible until a HC mode
  // sets --viz-pattern-opacity to 1.
  .distribution-bar-fill::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: var(--viz-pattern-opacity);
    background: repeating-linear-gradient(
      45deg,
      transparent 0,
      transparent 3px,
      currentColor 3px,
      currentColor 4.5px
    );
  }

  .trakt-distribution-bar[data-orientation="horizontal"] .distribution-bar-fill {
    --fill-angle: 90deg;
    top: 0;
    bottom: 0;
    // Anchor + grow from the inline-start edge so the fill mirrors under RTL.
    inset-inline-start: 0;
    width: var(--viz-fill);
    // transform-origin has no logical keyword; physical left only affects the
    // brief one-shot entrance scale, so RTL impact is negligible.
    transform-origin: left center;
    transition:
      width var(--viz-morph-duration) ease,
      filter var(--transition-increment) ease;
    animation: distribution-bar-grow-x var(--viz-enter-duration, 720ms)
      var(--viz-enter-ease, cubic-bezier(0.16, 1, 0.3, 1)) calc(var(--i) * 60ms)
      both;
  }

  .trakt-distribution-bar[data-orientation="vertical"] .distribution-bar-fill {
    --fill-angle: 0deg;
    left: 0;
    right: 0;
    bottom: 0;
    height: var(--viz-fill);
    transform-origin: center bottom;
    transition:
      height var(--viz-morph-duration) ease,
      filter var(--transition-increment) ease;
    animation: distribution-bar-grow-y var(--viz-enter-duration, 720ms)
      var(--viz-enter-ease, cubic-bezier(0.16, 1, 0.3, 1)) calc(var(--i) * 60ms)
      both;
  }

  // Spotlight the active bar via the selectable hover treatment.
  .trakt-distribution-bar.is-active .distribution-bar-fill {
    @include viz-hover-active;
  }

  @keyframes distribution-bar-grow-x {
    from {
      transform: scaleX(0);
      opacity: 0;
    }
    to {
      transform: scaleX(1);
      opacity: 1;
    }
  }

  @keyframes distribution-bar-grow-y {
    from {
      transform: scaleY(0);
      opacity: 0;
    }
    to {
      transform: scaleY(1);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .distribution-bar-fill {
      animation: none;
    }
  }
</style>
