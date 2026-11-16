<script lang="ts">
  import type { Attachment } from "svelte/attachments";
  import { composeLivingPosterStack } from "../../_internal/composeLivingPosterStack";
  import { createLivingPosterMotion } from "../../_internal/createLivingPosterMotion";
  import { particleCanvas } from "../../_internal/particleCanvas";
  import type { LivingPoster } from "../../models/LivingPoster";
  import LivingPosterEffectLayer from "./LivingPosterEffectLayer.svelte";

  const {
    poster,
    onsettledchange,
  }: {
    poster: LivingPoster;
    onsettledchange?: (isSettled: boolean) => void;
  } = $props();

  const stack = $derived(composeLivingPosterStack(poster));
  const motion = createLivingPosterMotion();

  let isRevealed = $state(false);

  const reveal: Attachment<HTMLElement> = (root) => {
    const frames = { first: 0, second: 0 };
    let isCancelled = false;

    frames.first = requestAnimationFrame(async () => {
      const layers = root.querySelectorAll<HTMLImageElement>(
        "img.living-poster-layer",
      );
      const decoded = await Promise.all(
        Array.from(layers, (layer) =>
          layer.decode().then(
            () => layer.naturalWidth > 0,
            () => false,
          ),
        ),
      );
      if (isCancelled || !decoded.every(Boolean)) return;

      frames.second = requestAnimationFrame(() => (isRevealed = true));
    });

    return () => {
      isCancelled = true;
      cancelAnimationFrame(frames.first);
      cancelAnimationFrame(frames.second);
    };
  };

  const resetOnDestroy: Attachment<HTMLElement> = () => () =>
    onsettledchange?.(false);

  const ontransitionend = (event: TransitionEvent) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "opacity") return;

    onsettledchange?.(true);
  };
</script>

<div
  class="trakt-living-poster"
  class:is-revealed={isRevealed}
  aria-hidden="true"
  {@attach motion.root}
  {@attach reveal}
  {@attach resetOnDestroy}
  {ontransitionend}
>
  <div class="living-poster-tilt">
    <div class="living-poster-lift-shadow"></div>
    <div class="living-poster-card">
      <div class="living-poster-plane">
        {#each stack as item (item.key)}
          {#if item.type === "layer"}
            <img
              class="living-poster-layer"
              class:is-cutout={item.isCutout}
              src={item.src}
              alt=""
              draggable="false"
              style:--s={item.shift}
            />
          {:else if item.type === "particles"}
            <canvas
              class="living-poster-particles"
              style:--s={item.shift}
              {@attach particleCanvas({
                effects: item.effects,
                addPainter: motion.addPainter,
              })}
            ></canvas>
          {:else}
            <LivingPosterEffectLayer
              effect={item.effect}
              shift={item.shift}
              mask={item.mask}
            />
          {/if}
        {/each}
        <div class="living-poster-vignette"></div>
      </div>
      <div class="living-poster-glare"></div>
    </div>
  </div>
</div>

<style>
  .trakt-living-poster {
    --rx: 0;
    --ry: 0;
    --lift: 0;

    position: absolute;
    top: 0;
    inset-inline: 0;
    z-index: var(--layer-base);
    aspect-ratio: var(--poster-aspect-ratio, 2 / 3);
    perspective: 900px;
    pointer-events: none;
    user-select: none;

    opacity: 0;
    transition: opacity calc(var(--transition-increment) * 4) ease-out;

    &.is-revealed {
      opacity: 1;
    }

    &:global([data-paused="true"]) :global(*),
    &:global([data-paused="true"]) :global(*::before) {
      animation-play-state: paused;
    }
  }

  .living-poster-tilt {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    transform: rotateX(calc(var(--ry) * -7deg)) rotateY(calc(var(--rx) * 9deg))
      translateZ(calc(var(--lift) * 18px));
  }

  .living-poster-lift-shadow {
    position: absolute;
    inset: 0;
    border-radius: var(--border-radius-xxl);
    box-shadow: 0 var(--ni-32) var(--ni-64) calc(-1 * var(--ni-12))
      color-mix(in srgb, var(--color-shadow) 85%, transparent);
    opacity: var(--lift);
  }

  .living-poster-card {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: var(--border-radius-xxl);
    box-shadow: var(--shadow-raised);
    background: var(--shade-900, black);
  }

  .living-poster-plane {
    position: absolute;
    inset: 0;
    transform: scale(1.06);
  }

  .living-poster-layer,
  .living-poster-particles {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    transform: translate3d(
      calc(var(--rx) * var(--s) * -1.9%),
      calc(var(--ry) * var(--s) * -1.9%),
      0
    );
  }

  .living-poster-layer {
    object-fit: cover;

    &.is-cutout {
      filter: drop-shadow(0 var(--ni-8) var(--ni-12) rgba(0, 0, 0, 0.35));
    }
  }

  .living-poster-particles {
    mix-blend-mode: screen;
  }

  .trakt-living-poster:global([data-paused="false"]) .living-poster-layer {
    will-change: transform;
  }

  .living-poster-vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      120% 90% at 50% 40%,
      transparent 55%,
      rgba(0, 0, 0, 0.45)
    );
  }

  .living-poster-glare {
    position: absolute;
    inset: -20%;
    pointer-events: none;
    mix-blend-mode: soft-light;
    background: radial-gradient(circle, white, transparent 42%);
    opacity: calc(0.18 + var(--lift) * 0.42);
    transform: translate3d(calc(var(--rx) * 45%), calc(var(--ry) * 45%), 0);
  }
</style>
