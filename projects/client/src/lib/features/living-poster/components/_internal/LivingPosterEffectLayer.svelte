<script lang="ts">
  import type { LivingPosterEffect } from "../../models/LivingPosterEffect";

  const {
    effect,
    shift,
    mask,
  }: {
    effect: LivingPosterEffect;
    shift: number;
    mask: string | null;
  } = $props();

  const [x, y, width, height] = $derived(effect.box);
  const bulbSize = $derived(
    effect.kind === "bulbs" && effect.points.length > 8 ? "4cqw" : "7cqw",
  );
  const maskImage = $derived(mask ? `url("${mask}")` : undefined);
</script>

<div
  class="living-poster-fx"
  class:is-overlay={effect.kind === "shimmer"}
  style:--s={shift}
>
  <div
    class="living-poster-fx-box"
    style:left="{x}%"
    style:top="{y}%"
    style:width="{width}%"
    style:height="{height}%"
    style:--i={effect.intensity}
    style:--c={effect.color ?? "#ffffff"}
    style:--b={bulbSize}
  >
    {#if effect.kind === "haze"}
      <div class="living-poster-haze"></div>
    {:else if effect.kind === "glow"}
      <div class="living-poster-glow"></div>
    {:else if effect.kind === "flicker"}
      <div class="living-poster-glow" data-flicker="true"></div>
    {:else if effect.kind === "bulbs"}
      {#each effect.points as [pointX, pointY], index (index)}
        <div
          class="living-poster-bulb"
          style:left="{pointX}%"
          style:top="{pointY}%"
          style:animation-delay="{(index * 1.37) % 4}s"
          style:animation-duration="{2.6 + ((index * 0.53) % 1.8)}s"
        ></div>
      {/each}
    {:else if effect.kind === "foil" && maskImage}
      <div
        class="living-poster-foil"
        style:mask-image={maskImage}
        style:-webkit-mask-image={maskImage}
      ></div>
    {:else if effect.kind === "shimmer" && maskImage}
      <div
        class="living-poster-shine"
        style:mask-image={maskImage}
        style:-webkit-mask-image={maskImage}
      ></div>
    {/if}
  </div>
</div>

<style>
  @keyframes breathe {
    0%,
    100% {
      opacity: calc(var(--i) * 0.55);
    }
    50% {
      opacity: var(--i);
    }
  }

  @keyframes flicker {
    0%,
    100% {
      opacity: var(--i);
    }
    7% {
      opacity: calc(var(--i) * 0.3);
    }
    9% {
      opacity: var(--i);
    }
    41% {
      opacity: calc(var(--i) * 0.75);
    }
    44% {
      opacity: var(--i);
    }
    70% {
      opacity: calc(var(--i) * 0.4);
    }
    72% {
      opacity: var(--i);
    }
  }

  @keyframes bulb {
    0%,
    100% {
      opacity: 0;
      transform: scale(0.7);
    }
    20% {
      opacity: var(--i);
      transform: scale(1);
    }
    32% {
      opacity: calc(var(--i) * 0.35);
    }
    42% {
      opacity: var(--i);
    }
    70% {
      opacity: 0;
      transform: scale(0.8);
    }
  }

  @keyframes sweep {
    0% {
      transform: translateX(-90%);
      animation-timing-function: ease-in-out;
    }
    21%,
    100% {
      transform: translateX(90%);
    }
  }

  .living-poster-fx {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    transform: translate3d(
      calc(var(--rx) * var(--s) * -1.9%),
      calc(var(--ry) * var(--s) * -1.9%),
      0
    );
  }

  .living-poster-fx.is-overlay {
    mix-blend-mode: overlay;
  }

  .living-poster-fx-box {
    position: absolute;
    container-type: size;
  }

  .living-poster-haze {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, var(--c), transparent 55%);
    mix-blend-mode: screen;
    animation: breathe 7s ease-in-out infinite;
  }

  .living-poster-glow {
    position: absolute;
    inset: -40%;
    background: radial-gradient(closest-side, var(--c), transparent);
    mix-blend-mode: screen;
    animation: breathe 4.5s ease-in-out infinite;

    &[data-flicker="true"] {
      animation: flicker 3.2s steps(1) infinite;
    }
  }

  .living-poster-bulb {
    position: absolute;
    width: var(--b);
    height: var(--b);
    margin: calc(var(--b) / -2) 0 0 calc(var(--b) / -2);
    border-radius: 50%;
    background: radial-gradient(
      closest-side,
      var(--c),
      color-mix(in srgb, var(--c) 35%, transparent) 40%,
      transparent
    );
    mix-blend-mode: screen;
    opacity: 0;
    animation: bulb 3s ease-in-out infinite;
  }

  .living-poster-foil,
  .living-poster-shine {
    position: absolute;
    inset: 0;
    overflow: hidden;
    mask-size: 100% 100%;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    -webkit-mask-repeat: no-repeat;
  }

  .living-poster-foil {
    mix-blend-mode: color-dodge;
    opacity: calc(var(--i) * (0.35 + var(--lift) * 0.65));
    background: linear-gradient(
      calc(110deg + var(--rx) * 40deg),
      transparent 20%,
      rgba(255, 120, 180, 0.55) 34%,
      rgba(120, 220, 255, 0.6) 44%,
      rgba(255, 240, 140, 0.6) 54%,
      rgba(160, 120, 255, 0.5) 64%,
      transparent 78%
    );
    background-size: 220% 100%;
    background-position: calc(50% + var(--rx) * 60%) 50%;
  }

  .living-poster-shine {
    opacity: calc(var(--i) * 0.9);
    background: radial-gradient(
      70% 45% at calc(50% - var(--rx) * 45%) calc(35% - var(--ry) * 45%),
      rgb(255 255 255 / calc(0.1 + var(--reach) * 0.4)),
      transparent 70%
    );

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        108deg,
        transparent 37%,
        rgba(255, 247, 228, 0.8) 50%,
        transparent 63%
      );
      transform: translateX(-90%);
      animation: sweep 8.5s infinite;
    }
  }
</style>
