<script lang="ts">
  /**
   * A shimmering stand-in pinned to the box of the thing it is waiting for.
   *
   * THE WHOLE TRICK (design 48a): this is not a skeleton screen. It is an
   * overlay absolutely positioned inside the real element's own box, so the
   * placeholder and the content it replaces are the same rectangle by
   * construction and cannot drift apart. Give the host `position: relative`
   * and drop this inside it.
   *
   * The sweep is a translated layer rather than an animated
   * `background-position`. The reference animates the position, which repaints
   * the whole bar every frame; `transform` runs on the compositor, and this
   * repo's perf rules only allow `transform` and `opacity` to be animated. The
   * two look the same.
   */
  const {
    radius = "var(--border-radius-s)",
    inset = "0",
  }: {
    /** Match the host's own corner, or the stand-in will not sit in its box. */
    radius?: string;
    /** Shrink or grow the overlay against the host box, e.g. text leading. */
    inset?: string;
  } = $props();
</script>

<span
  class="trakt-skeleton-shimmer"
  style:--shimmer-radius={radius}
  style:--shimmer-inset={inset}
  aria-hidden="true"
></span>

<style lang="scss">
  .trakt-skeleton-shimmer {
    /*
      Neutral mixed from the foreground rather than a card token: the card
      surfaces are near-white in the light theme, so a card-coloured bar is
      invisible against the page it sits on.
    */
    --shimmer-base: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    /* The highlight is the brand purple the reference names, kept as a token
       so a tier theme carries it (gold for DIRECTOR, neutral for FREE). */
    --shimmer-highlight: color-mix(
      in srgb,
      var(--purple-400) 16%,
      transparent
    );

    position: absolute;
    inset: var(--shimmer-inset);

    border-radius: var(--shimmer-radius);
    background-color: var(--shimmer-base);

    /* Clips the sweep to the bar's own corners. */
    overflow: hidden;
    pointer-events: none;

    &::after {
      content: "";

      position: absolute;
      inset-block: 0;
      inset-inline: 0;

      background-image: linear-gradient(
        100deg,
        transparent 20%,
        var(--shimmer-highlight) 50%,
        transparent 80%
      );

      animation: skeleton-sweep 1800ms linear infinite;
    }
  }

  /* Travels its own width, so the highlight enters one edge and leaves the
     other. `--rtl-sign` flips it with the reading direction. */
  @keyframes skeleton-sweep {
    from {
      transform: translateX(calc(var(--rtl-sign, 1) * -100%));
    }
    to {
      transform: translateX(calc(var(--rtl-sign, 1) * 100%));
    }
  }

  /* A static tint still says "not yet", without anything moving. */
  @media (prefers-reduced-motion: reduce) {
    .trakt-skeleton-shimmer::after {
      animation: none;
      background-image: none;
    }
  }
</style>
