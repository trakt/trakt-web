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

<div class="living-poster-fx" style:--s={shift}>
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
    {#if effect.kind === "fog"}
      <div class="living-poster-fog">
        <div class="living-poster-fog-bank"></div>
        <div class="living-poster-fog-bank" data-bank="second"></div>
      </div>
    {:else if effect.kind === "haze"}
      <div class="living-poster-haze"></div>
    {:else if effect.kind === "glow"}
      <div class="living-poster-glow"></div>
    {:else if effect.kind === "flicker"}
      <div class="living-poster-glow" data-flicker="true"></div>
    {:else if effect.kind === "lightning"}
      <div class="living-poster-bolt"></div>
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
    {:else if effect.kind === "flare"}
      <div
        class="living-poster-flare"
        style:left="{effect.at[0]}%"
        style:top="{effect.at[1]}%"
      ></div>
      {#each [{ k: 0.55, size: 9, color: "rgba(255, 170, 120, 0.22)" }, { k: 1.15, size: 5, color: "rgba(140, 200, 255, 0.25)" }, { k: 1.6, size: 14, color: "rgba(255, 230, 160, 0.12)" }] as ghost (ghost.k)}
        <div
          class="living-poster-ghost"
          style:--k={ghost.k}
          style:--ax={effect.at[0]}
          style:--ay={effect.at[1]}
          style:width="{ghost.size}cqw"
          style:height="{ghost.size}cqw"
          style:background="radial-gradient(closest-side, {ghost.color},
          transparent)"
        ></div>
      {/each}
    {:else if effect.kind === "foil" && maskImage}
      <div
        class="living-poster-foil"
        style:mask-image={maskImage}
        style:-webkit-mask-image={maskImage}
      >
        <div class="living-poster-sheen"></div>
      </div>
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

  @keyframes bolt {
    0%,
    88%,
    100% {
      opacity: 0;
    }
    89% {
      opacity: calc(var(--i) * 0.85);
    }
    90% {
      opacity: calc(var(--i) * 0.1);
    }
    92% {
      opacity: calc(var(--i) * 0.7);
    }
    95% {
      opacity: 0;
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

  @keyframes sway {
    from {
      transform: translate3d(-9%, 0, 0);
    }
    to {
      transform: translate3d(9%, 0, 0);
    }
  }

  @keyframes sweep {
    0% {
      transform: translateX(-140%);
    }
    55%,
    100% {
      transform: translateX(140%);
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

  .living-poster-fx-box {
    position: absolute;
    container-type: size;
  }

  .living-poster-fog {
    position: absolute;
    inset: 0;
    opacity: var(--i);
    mix-blend-mode: screen;
  }

  .living-poster-fog-bank {
    position: absolute;
    inset: 0 -30%;
    background:
      radial-gradient(40% 60% at 24% 60%, var(--c), transparent 70%),
      radial-gradient(40% 60% at 78% 55%, var(--c), transparent 70%);
    animation: sway 22s ease-in-out infinite alternate;

    &[data-bank="second"] {
      background:
        radial-gradient(35% 55% at 50% 50%, var(--c), transparent 70%),
        radial-gradient(30% 50% at 95% 60%, var(--c), transparent 70%);
      animation-duration: 31s;
      animation-direction: alternate-reverse;
    }
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

  .living-poster-bolt {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      70% 50% at 60% 10%,
      rgba(220, 230, 255, 0.9),
      transparent 70%
    );
    mix-blend-mode: screen;
    animation: bolt 7s linear infinite;
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

  .living-poster-flare {
    position: absolute;
    width: 0;
    height: 0;

    &::before {
      content: "";
      position: absolute;
      width: 46cqw;
      height: 46cqw;
      left: -23cqw;
      top: -23cqw;
      border-radius: 50%;
      background: radial-gradient(
        closest-side,
        rgba(255, 240, 215, calc(var(--i) * 0.9)),
        rgba(255, 180, 110, calc(var(--i) * 0.25)) 45%,
        transparent
      );
      mix-blend-mode: screen;
    }

    &::after {
      content: "";
      position: absolute;
      width: 70cqw;
      height: 2px;
      left: -35cqw;
      top: -1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 226, 190, calc(var(--i) * 0.8)),
        transparent
      );
      filter: blur(0.6px);
      mix-blend-mode: screen;
      transform: rotate(calc(var(--rx) * 6deg));
    }
  }

  .living-poster-ghost {
    --cx: calc(50 + var(--rx) * 20);
    --cy: calc(50 + var(--ry) * 20);

    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    mix-blend-mode: screen;
    transform: translate3d(
      calc((var(--ax) + (var(--cx) - var(--ax)) * var(--k)) * 1cqw - 4cqw),
      calc((var(--ay) + (var(--cy) - var(--ay)) * var(--k)) * 1cqh - 4cqw),
      0
    );
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
  }

  .living-poster-sheen {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -60%;
    width: 220%;
    background: linear-gradient(
      110deg,
      transparent 20%,
      rgba(255, 120, 180, 0.55) 34%,
      rgba(120, 220, 255, 0.6) 44%,
      rgba(255, 240, 140, 0.6) 54%,
      rgba(160, 120, 255, 0.5) 64%,
      transparent 78%
    );
    transform: translate3d(calc(var(--rx) * 22%), 0, 0)
      rotate(calc(var(--rx) * 6deg));
  }

  .living-poster-shine {
    opacity: var(--i);

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        105deg,
        transparent 35%,
        rgba(255, 255, 255, 0.85) 50%,
        transparent 65%
      );
      mix-blend-mode: overlay;
      animation: sweep 5.5s ease-in-out infinite;
    }
  }
</style>
