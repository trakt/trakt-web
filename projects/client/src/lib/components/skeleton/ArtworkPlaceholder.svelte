<script lang="ts">
  type ArtworkPlaceholderProps = {
    /**
     * The artwork's two dominant colours, straight off the API. Given them,
     * the placeholder is the title's own palette rather than a grey box - so
     * the image resolves INTO what was already standing there instead of
     * replacing something unrelated.
     */
    colors?: [string, string] | Nil;
    radius?: string;
  };

  const { colors, radius }: ArtworkPlaceholderProps = $props();

  const [from, to] = $derived(colors ?? []);
</script>

<span
  class="trakt-artwork-placeholder"
  class:has-colors={Boolean(colors)}
  style:--placeholder-from={from}
  style:--placeholder-to={to}
  style:--placeholder-radius={radius}
  aria-hidden="true"
></span>

<style lang="scss">
  .trakt-artwork-placeholder {
    position: relative;
    display: block;
    overflow: hidden;

    width: 100%;
    height: 100%;

    border-radius: var(--placeholder-radius, var(--border-radius-s));

    /*
      The colourless case leans on the FOREGROUND rather than a card surface.
      The card tokens are near-white in the light theme, which made an
      untinted placeholder invisible on a light page - a mix against the
      foreground darkens on light and lightens on dark, so it reads either
      way without needing a value per theme.
    */
    --placeholder-neutral: color-mix(
      in srgb,
      var(--color-foreground) 9%,
      transparent
    );
    --placeholder-neutral-deep: color-mix(
      in srgb,
      var(--color-foreground) 14%,
      transparent
    );

    background:
      radial-gradient(
        120% 100% at 15% 0%,
        var(--placeholder-from, var(--placeholder-neutral-deep)) 0%,
        transparent 70%
      ),
      linear-gradient(
        160deg,
        var(--placeholder-from, var(--placeholder-neutral-deep)) 0%,
        var(--placeholder-to, var(--placeholder-neutral)) 100%
      );
  }

  /*
    A sheen crossing the surface, not a brightness pulse. A pulse says "this
    box is empty"; a pass of light says "something is coming" - and at this
    size a pulse over the title's own colours reads as flicker.
  */
  .trakt-artwork-placeholder::after {
    content: "";

    position: absolute;
    inset: 0;

    background: linear-gradient(
      105deg,
      transparent 35%,
      color-mix(in srgb, var(--color-text-primary) 10%, transparent) 50%,
      transparent 65%
    );

    transform: translateX(-100%);
    animation: artwork-placeholder-sheen 1600ms ease-in-out infinite;
  }

  /*
    Dimmed where the colours are the title's own: full-strength light over a
    saturated ground reads as a glare rather than a sweep.
  */
  .trakt-artwork-placeholder.has-colors::after {
    opacity: 0.6;
  }

  @keyframes artwork-placeholder-sheen {
    /* Holds off screen for the back half, so the sweeps read as separate
       passes rather than one strobing band. */
    0% {
      transform: translateX(-100%);
    }
    55%,
    100% {
      transform: translateX(100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-artwork-placeholder::after {
      animation: none;
    }
  }
</style>
