<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { Confetti } from "svelte-confetti";
  import CrownIcon from "../../icons/CrownIcon.svelte";
  import { toVipTenureLabel } from "../utils/toVipTenureLabel.ts";

  const { vipMonths, chip }: { vipMonths: number; chip?: string | Nil } =
    $props();

  const SPARKLES = Array.from({ length: 8 }, (_, index) => index);
  const COLORS = [
    "var(--purple-300)",
    "var(--purple-500)",
    "var(--shade-10)",
    "var(--color-vip-popular-tag)",
    "var(--red-400)",
    "var(--blue-300)",
  ];

  let burstCount = $state(0);

  const celebrate = () => (burstCount += 1);

  const streak = $derived(
    chip ??
    (vipMonths < 1
      ? m.text_vip_cancel_kept_streak_new()
      : m.text_vip_cancel_kept_streak({ tenure: toVipTenureLabel(vipMonths) })),
  );
</script>

<div class="trakt-vip-cancel-kept-celebration">
  <div class="celebration-rain" aria-hidden="true">
    <Confetti
      x={[-5, 5]}
      y={[0, 0.1]}
      delay={[time.seconds(0.6), time.seconds(2.4)]}
      duration={time.seconds(3)}
      amount={180}
      fallDistance="760px"
      xSpread={0.3}
      colorArray={COLORS}
      disableForReducedMotion
    />
  </div>

  <div class="celebration-stage">
    <span class="celebration-rays" aria-hidden="true"></span>
    {#key burstCount}
      <span class="celebration-ring" aria-hidden="true"></span>
      <span class="celebration-ring is-late" aria-hidden="true"></span>
    {/key}

    {#each SPARKLES as index (index)}
      <span
        class="celebration-sparkle"
        style="--sparkle-index: {index}"
        aria-hidden="true"
      ></span>
    {/each}

    <button
      type="button"
      class="celebration-badge"
      data-bounce={burstCount === 0 ? null : burstCount % 2 ? "a" : "b"}
      aria-label={m.button_label_vip_cancel_celebrate()}
      onclick={celebrate}
    >
      <CrownIcon />
    </button>

    {#key burstCount}
      <span class="celebration-burst" aria-hidden="true">
        <Confetti
          x={[-1.6, 1.6]}
          y={[0.4, 2.2]}
          delay={burstCount === 0
            ? [time.seconds(0.3), time.seconds(0.55)]
            : [0, time.seconds(0.15)]}
        duration={time.seconds(2.2)}
        amount={140}
        cone
        rounded
        size={12}
        colorArray={COLORS}
        disableForReducedMotion
      />
    </span>
    {/key}
  </div>

  <p class="celebration-streak bold">
    <span class="streak-spark" aria-hidden="true"></span>
    {streak}
  </p>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-cancel-kept-celebration {
    display: grid;
    justify-items: center;
    gap: var(--ni-24);
  }

  .celebration-rain {
    position: absolute;
    inset-block-start: calc(-1 * var(--ni-20));
    inset-inline-start: 50%;
    width: 0;
    height: 0;
    pointer-events: none;
    z-index: 2;
  }

  .celebration-stage {
    --stage-size: var(--ni-320);
    --badge-size: var(--ni-136);

    position: relative;
    width: var(--stage-size);
    aspect-ratio: 1;
    display: grid;
    place-items: center;

    @container vip-cancel (max-width: 760px) {
      --stage-size: var(--ni-200);
      --badge-size: var(--ni-96);
    }
  }

  .celebration-rays {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: repeating-conic-gradient(
      from 0deg,
      color-mix(in oklch, var(--purple-300) 28%, transparent) 0deg
        9deg,
      transparent 9deg 22deg
    );
    mask: radial-gradient(closest-side, black 35%, transparent 100%);
    animation:
      rays-in 900ms cubic-bezier(0.2, 0.8, 0.2, 1) both,
      rays-spin 28s linear infinite;
  }

  .celebration-ring {
    position: absolute;
    width: var(--badge-size);
    aspect-ratio: 1;
    border-radius: 50%;
    border: var(--ni-3) solid var(--purple-300);
    opacity: 0;
    animation: ring-out 1300ms cubic-bezier(0.1, 0.7, 0.3, 1) 250ms;

    &.is-late {
      animation-delay: 550ms;
    }
  }

  .celebration-badge {
    all: unset;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    width: var(--badge-size);
    aspect-ratio: 1;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: var(--shade-10);
    background: radial-gradient(
      circle at 32% 28%,
      var(--purple-300),
      var(--purple-500) 55%,
      var(--purple-700)
    );
    box-shadow:
      0 0 0 var(--ni-6)
        color-mix(in oklch, var(--purple-300) 25%, transparent),
      0 var(--ni-24) var(--ni-48) calc(-1 * var(--ni-12))
        color-mix(in oklch, var(--shade-950) 60%, transparent);
    animation:
      badge-pop 900ms cubic-bezier(0.3, 1.6, 0.5, 1) both,
      badge-float 3.2s ease-in-out 1s infinite,
      badge-glow 2.4s ease-in-out 1s infinite;

    :global(svg) {
      width: 52%;
      height: 52%;
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--shade-10);
      outline-offset: var(--ni-6);
    }

    &[data-bounce] {
      animation:
        badge-bounce-a 600ms cubic-bezier(0.3, 1.6, 0.5, 1),
        badge-float 3.2s ease-in-out 600ms infinite,
        badge-glow 2.4s ease-in-out 600ms infinite;
    }

    &[data-bounce="b"] {
      animation-name: badge-bounce-b, badge-float, badge-glow;
    }

    @include for-mouse {
      &:hover {
        scale: 1.05;
      }
    }

    &:active {
      scale: 0.94;
    }
  }

  .celebration-sparkle {
    --sparkle-angle: calc(var(--sparkle-index) * 45deg);

    position: absolute;
    width: var(--ni-14);
    aspect-ratio: 1;
    background: var(--shade-10);
    clip-path: polygon(
      50% 0,
      62% 38%,
      100% 50%,
      62% 62%,
      50% 100%,
      38% 62%,
      0 50%,
      38% 38%
    );
    transform: rotate(var(--sparkle-angle))
      translateY(calc(var(--stage-size) * -0.4))
      rotate(calc(-1 * var(--sparkle-angle)));
    opacity: 0;
    animation: sparkle-twinkle 1.8s ease-in-out infinite;
    animation-delay: calc(700ms + var(--sparkle-index) * 220ms);

    &:nth-child(even) {
      width: var(--ni-10);
      background: var(--purple-300);
    }
  }

  .celebration-burst {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    width: 0;
    height: 0;
  }

  .celebration-streak {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
    padding: var(--ni-10) var(--ni-18);
    border-radius: var(--border-radius-xxl);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--shade-10) 16%, transparent);
    background: color-mix(in srgb, var(--shade-940) 60%, transparent);
    color: color-mix(in srgb, var(--shade-10) 72%, transparent);
    @include backdrop-filter-blur(var(--ni-10));
    animation: streak-in 700ms cubic-bezier(0.3, 1.5, 0.5, 1) 900ms both;
  }

  .streak-spark {
    width: var(--ni-12);
    aspect-ratio: 1;
    background: var(--purple-300);
    clip-path: polygon(
      50% 0,
      62% 38%,
      100% 50%,
      62% 62%,
      50% 100%,
      38% 62%,
      0 50%,
      38% 38%
    );
    animation: sparkle-spin 2.4s linear infinite;
  }

  @keyframes rays-in {
    from {
      opacity: 0;
      scale: 0.4;
    }
  }

  @keyframes rays-spin {
    to {
      rotate: 1turn;
    }
  }

  @keyframes ring-out {
    0% {
      opacity: 0.9;
      scale: 0.9;
    }
    100% {
      opacity: 0;
      scale: 2.4;
    }
  }

  @keyframes badge-pop {
    0% {
      scale: 0;
      rotate: -25deg;
    }
    60% {
      scale: 1.15;
      rotate: 6deg;
    }
    100% {
      scale: 1;
      rotate: 0deg;
    }
  }

  @keyframes badge-bounce-a {
    40% {
      scale: 1.2;
      rotate: -8deg;
    }
  }

  @keyframes badge-bounce-b {
    40% {
      scale: 1.2;
      rotate: 8deg;
    }
  }

  @keyframes badge-float {
    50% {
      translate: 0 calc(-1 * var(--ni-8));
    }
  }

  @keyframes badge-glow {
    50% {
      box-shadow:
        0 0 0 var(--ni-14)
          color-mix(in oklch, var(--purple-300) 12%, transparent),
        0 var(--ni-24) var(--ni-48) calc(-1 * var(--ni-12))
          color-mix(in oklch, var(--shade-950) 60%, transparent);
    }
  }

  @keyframes sparkle-twinkle {
    0%,
    100% {
      opacity: 0;
      scale: 0.3;
    }
    50% {
      opacity: 1;
      scale: 1.2;
    }
  }

  @keyframes sparkle-spin {
    to {
      rotate: 1turn;
    }
  }

  @keyframes streak-in {
    from {
      opacity: 0;
      translate: 0 var(--ni-16);
      scale: 0.9;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .celebration-rays,
    .celebration-ring,
    .celebration-badge,
    .celebration-badge[data-bounce],
    .celebration-sparkle,
    .celebration-streak,
    .streak-spark {
      animation: none;
    }

    .celebration-sparkle {
      opacity: 0.8;
    }
  }
</style>
