<!-- Veteran: a faceted emerald band that turns slowly, with a passing glint. -->
<span class="aura-slot">
  <span class="veteran-glow"></span>
  <span class="veteran-hairline"></span>
  <span class="veteran-glint"></span>
  <span class="veteran-band"></span>
  <span class="veteran-specular"></span>
</span>

<style lang="scss">
  @use "./aura" as *;

  .aura-slot {
    @include slot(13);
  }

  .veteran-glow {
    @include layer(-20);
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--aura-mid) 55%, transparent) 0%,
      transparent 62%
    );

    @include motion {
      animation: tier-aura-breathe 5s ease-in-out infinite;
    }
  }

  .veteran-hairline {
    @include layer(2);
    box-shadow: inset 0 0 0 1px
      color-mix(in srgb, var(--aura-light) 40%, transparent);
  }

  .veteran-glint {
    @include layer(1.5);
    @include ring-mask(calc(var(--u) * 2));
    opacity: 0;
    background: conic-gradient(
      from -40deg,
      transparent 0deg,
      color-mix(in srgb, var(--aura-light) 60%, transparent) 24deg,
      var(--aura-white) 40deg,
      color-mix(in srgb, var(--aura-light) 60%, transparent) 56deg,
      transparent 80deg,
      transparent 360deg
    );

    @include motion {
      animation: tier-aura-sweep 7s cubic-bezier(0.45, 0, 0.25, 1) 4.7s infinite;
    }
  }

  .veteran-band,
  .veteran-specular {
    @include layer(4);
    @include ring-mask(calc(var(--u) * 7));
  }

  .veteran-band {
    background: conic-gradient(
      from 0deg,
      var(--aura-deep),
      var(--aura-mid),
      var(--aura-light),
      var(--aura-mid),
      var(--aura-deep),
      var(--aura-mid),
      var(--aura-light),
      var(--aura-deep)
    );

    @include motion {
      animation: tier-aura-spin 14s linear infinite;
    }
  }

  .veteran-specular {
    mix-blend-mode: overlay;
    background: conic-gradient(
      from -60deg,
      color-mix(in srgb, var(--aura-white) 85%, transparent) 0deg,
      transparent 50deg,
      transparent 180deg,
      color-mix(in srgb, var(--aura-white) 35%, transparent) 215deg,
      transparent 260deg,
      transparent 360deg
    );
  }
</style>
