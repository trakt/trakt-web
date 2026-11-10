<script lang="ts">
  const {
    weight,
    intensity,
    opacity,
    color = "vip",
  }: {
    color?: "vip" | "gold";
    weight?: string;
    intensity?: number;
    opacity?: number;
  } = $props();
</script>

<span
  class="trakt-thread-ring"
  aria-hidden="true"
  data-color={color}
  style:--thread-ring-weight={weight}
  style:--thread-ring-intensity={intensity}
  style:--thread-ring-opacity={opacity}
>
  <span class="ring-spin"><span class="ring-sweep"></span></span>
</span>

<style lang="scss">
  .trakt-thread-ring {
    --thread-ring-base: var(--color-vip-thread-base);
    --thread-ring-mid: var(--color-vip-thread-mid);
    --thread-ring-glint: var(--color-vip-thread-glint);
    --thread-ring-glint-faint: var(--color-vip-thread-glint-faint);

    position: absolute;
    inset: 0;
    overflow: hidden;

    padding: var(--thread-ring-weight, var(--ni-1));
    border-radius: inherit;
    opacity: var(--thread-ring-opacity, 1);

    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    mask-composite: exclude;

    pointer-events: none;

    &[data-color="gold"] {
      --thread-ring-base: var(--color-gold-thread-base);
      --thread-ring-mid: var(--color-gold-thread-mid);
      --thread-ring-glint: var(--color-gold-thread-glint);
      --thread-ring-glint-faint: var(--color-gold-thread-glint-faint);
    }
  }

  .ring-spin {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 260%;
    aspect-ratio: 1;

    transform: translate(-50%, -50%);

    animation: vip-thread-boost 3s linear infinite;
    animation-play-state: var(--thread-ring-boost, paused);
  }

  .ring-sweep {
    display: block;
    position: absolute;
    inset: 0;
    border-radius: 50%;

    background: conic-gradient(
      from 0deg,
      var(--thread-ring-base) 0deg,
      var(--thread-ring-mid) 55deg,
      var(--thread-ring-glint) 90deg,
      var(--thread-ring-mid) 125deg,
      var(--thread-ring-base) 180deg,
      var(--thread-ring-mid) 235deg,
      var(--thread-ring-glint-faint) 270deg,
      var(--thread-ring-mid) 305deg,
      var(--thread-ring-base) 360deg
    );

    animation: vip-thread-sweep 6s linear infinite;

    filter: contrast(var(--thread-ring-intensity, 1));
  }

  :global(.is-hidden) .trakt-thread-ring {
    --thread-ring-boost: paused;

    .ring-sweep {
      animation-play-state: paused;
    }
  }

  @keyframes vip-thread-sweep {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes vip-thread-boost {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }

    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ring-sweep,
    .ring-spin {
      animation: none;
    }
  }
</style>
