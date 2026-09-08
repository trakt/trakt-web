<script lang="ts">
  const { fill }: { fill: "none" | "half" | "full" } = $props();

  const STAR_PATH =
    "M12 2L14.8214 8.11672L21.5106 8.90983L16.5651 13.4833L17.8779 20.0902L12 16.8L6.12215 20.0902L7.43493 13.4833L2.48944 8.90983L9.17863 8.11672L12 2Z";

  const fillWidth = $derived.by(() => {
    switch (fill) {
      case "none":
        return "0";
      case "half":
        return "50%";
      case "full":
        return "100%";
    }
  });

  const clipId = `starFill-${crypto.randomUUID()}`;
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <clipPath id={clipId}>
      <path d={STAR_PATH} />
    </clipPath>
  </defs>
  <!--
    The empty star is the outline; the fill is painted over it in the same
    colour, so a fully rated star reads as one solid shape and both states
    share an outer extent. The join is left to default (miter) rather than
    bevel - bevel chops all five points flat, and those hard straight edges
    are exactly what the fill exposes on the active or hovered star.
  -->
  <path d={STAR_PATH} stroke="currentColor" stroke-width="2" fill="none" />
  <rect
    class="trakt-star-fill"
    x="0"
    y="0"
    height="24"
    width={fillWidth}
    fill="currentColor"
    clip-path={`url(#${clipId})`}
  />
</svg>

<style>
  .trakt-star-fill {
    transition: width var(--transition-increment) ease-in-out;
  }

  /**
   * In RTL layouts the star row is visually reversed, but the SVG fill rect
   * still grows from x=0 (left). Mirror the rect about the SVG center so
   * the partial fill faces toward the full stars — the correct reading
   * direction. RTL-generic; no locale-specific code.
   */
  :global([dir="rtl"]) .trakt-star-fill {
    transform: scaleX(-1);
    transform-origin: center;
  }
</style>
