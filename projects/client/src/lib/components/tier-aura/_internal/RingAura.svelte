<script lang="ts">
  import type { TierAuraTier } from "../TierAuraTier.ts";

  const { tier }: { tier: Extract<TierAuraTier, "free" | "vip" | "pro"> } =
    $props();
</script>

<span class="aura-slot" data-ring={tier}>
  {#if tier !== "free"}
    <span class="ring-glow"></span>
  {/if}
  {#if tier === "pro"}
    <span class="ring-hairline"></span>
    <span class="ring-glint"></span>
  {/if}
  <span class="ring-band"></span>
  {#if tier !== "free"}
    <span class="ring-specular"></span>
  {/if}
</span>

<style lang="scss">
  @use "./aura" as *;

  .aura-slot {
    @include slot(13);

    --ring-inset: 5;
    --ring-width: calc(var(--u) * 5);
    --ring-light: var(--purple-200);

    &[data-ring="free"] {
      --ring-inset: 8;
      --ring-width: calc(var(--u) * 2);
    }

    &[data-ring="pro"] {
      --ring-width: calc(var(--u) * 6);
      --ring-light: var(--aura-pro-hi);
    }
  }

  .ring-glow {
    @include layer(-18);
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--aura-mid) 40%, transparent) 0%,
      transparent 62%
    );

    [data-ring="pro"] & {
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--aura-mid) 50%, transparent) 0%,
        transparent 62%
      );
    }
  }

  .ring-hairline {
    @include layer(3);
    box-shadow: inset 0 0 0 1px
      color-mix(in srgb, var(--ring-light) 40%, transparent);
  }

  .ring-glint {
    @include layer(2.5);
    @include ring-mask(calc(var(--u) * 2));
    opacity: 0;
    background: conic-gradient(
      from -40deg,
      transparent 0deg,
      color-mix(in srgb, var(--ring-light) 60%, transparent) 24deg,
      var(--aura-white) 40deg,
      color-mix(in srgb, var(--ring-light) 60%, transparent) 56deg,
      transparent 80deg,
      transparent 360deg
    );

    @include motion {
      animation: tier-aura-sweep 7s cubic-bezier(0.45, 0, 0.25, 1) 2.4s infinite;
    }
  }

  .ring-band,
  .ring-specular {
    position: absolute;
    inset: calc(var(--u) * var(--ring-inset));
    border-radius: 50%;
    pointer-events: none;
    @include ring-mask(var(--ring-width));
  }

  .ring-band {
    background: conic-gradient(
      from 210deg,
      var(--ring-light),
      var(--aura-mid) 22%,
      var(--aura-deep) 50%,
      var(--aura-mid) 78%,
      var(--ring-light)
    );

    [data-ring="free"] & {
      background: linear-gradient(
        160deg,
        var(--shade-300),
        var(--shade-700) 55%,
        var(--shade-400)
      );
    }
  }

  .ring-specular {
    mix-blend-mode: overlay;
    background: conic-gradient(
      from -60deg,
      color-mix(in srgb, var(--aura-white) 80%, transparent) 0deg,
      transparent 50deg,
      transparent 180deg,
      color-mix(in srgb, var(--aura-white) 30%, transparent) 215deg,
      transparent 260deg
    );
  }
</style>
