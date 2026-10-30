<span class="trakt-user-tier-shine" aria-hidden="true">
  <span class="shine-ring" data-shine="ring"></span>
  <span class="shine-face">
    <span class="shine-band" data-shine="band"></span>
  </span>
</span>
<svg class="shine-sparks" data-shine="sparks" aria-hidden="true"></svg>

<style lang="scss">
  @use "./ringMask" as *;

  .trakt-user-tier-shine {
    position: absolute;
    inset: 0;
    overflow: clip;
    pointer-events: none;
  }

  .shine-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    opacity: 0;
    @include ring-mask(var(--shine-width, var(--ring-width)));
  }

  .shine-face {
    position: absolute;
    inset: calc(var(--ring-width) + var(--ring-gap));
    border-radius: 50%;
    overflow: hidden;
  }

  .shine-band {
    position: absolute;
    inset-block-start: -50%;
    inset-inline-start: -50%;
    inline-size: 200%;
    block-size: 200%;
    opacity: 0;
    background: linear-gradient(
      90deg,
      transparent 40%,
      color-mix(in srgb, var(--shade-10) 10%, transparent) 46%,
      color-mix(in srgb, var(--shade-10) 45%, transparent) 49.4%,
      color-mix(in srgb, var(--shade-10) 70%, transparent) 50%,
      color-mix(in srgb, var(--shade-10) 25%, transparent) 51.5%,
      color-mix(in srgb, var(--shade-10) 6%, transparent) 55%,
      transparent 60%
    );
  }

  .shine-sparks {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    overflow: visible;
    pointer-events: none;

    :global(.shine-spark) {
      opacity: 0;
      fill: var(--tier-sheen);
    }
  }
</style>
