<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MatchKind } from "$lib/requests/models/MatchKind.ts";
  import MatchAvatar from "./MatchAvatar.svelte";
  import { matchLevel } from "./matchLevel.ts";
  import { matchTiers } from "./matchTiers.ts";

  const {
    score,
    kind = "match",
    size = "card",
  }: {
    score: number | null;
    kind?: MatchKind;
    size?: "card" | "drawer";
  } = $props();

  const TRAIL_SPARKS = ["trail-1", "trail-2", "trail-3"] as const;
  const ALL_SPARKS = [...TRAIL_SPARKS, "idle"] as const;

  const level = $derived(matchLevel(score, kind));
  const tier = $derived(level === 0 ? null : matchTiers(kind)[level]);
  const isFlame = $derived(kind === "hype");
  const sparks = $derived.by(() => {
    if (level === 4) return ALL_SPARKS;
    if (level === 3) return TRAIL_SPARKS;
    return [];
  });
  const label = $derived.by(() => {
    if (kind === "hype") {
      return score === null
        ? m.image_alt_hype_unknown()
        : m.image_alt_hype_score({ percent: score });
    }
    return score === null
      ? m.image_alt_match_unknown()
      : m.image_alt_match_score({ percent: score });
  });
</script>

<span
  class="trakt-match-orbit"
  data-level={level}
  data-kind={kind}
  data-size={size}
  style:--match-orbit-color={tier?.color}
  style:--match-orbit-glow={tier?.glow ?? 0}
  style:--match-orbit-sweep={tier?.sweep ?? 0}
  role="img"
  aria-label={label}
>
  <span class="trakt-match-orbit-track" aria-hidden="true"></span>
  {#if tier}
    <span class="trakt-match-orbit-tail" aria-hidden="true"></span>
    <span class="trakt-match-orbit-head" class:is-flame={isFlame} aria-hidden="true">
      {#if isFlame}
        <svg class="trakt-match-orbit-comet" viewBox="0 0 62 28">
          <path class="trakt-match-orbit-comet-outer" d="M50 2.5A9.5 9.5 0 0 1 50 21.5C34 22 18 26 4 23 18 18 34 2 50 2.5Z" />
          <path class="trakt-match-orbit-comet-mid" d="M50 5A7 7 0 0 1 50 19C38 19.5 26 22 16 20 26 16 38 4.5 50 5Z" />
          <path class="trakt-match-orbit-comet-core" d="M50 7.4A4.6 4.6 0 0 1 50 16.6C43 17 35 18.5 29 17 35 14.5 43 7 50 7.4Z" />
          <circle class="trakt-match-orbit-comet-hot" cx="51.5" cy="12" r="1.6" />
        </svg>
        {#each sparks as spark (spark)}
          <span class="trakt-match-orbit-spark" data-spark={spark}></span>
        {/each}
      {/if}
    </span>
  {/if}
  <span class="trakt-match-orbit-avatar">
    <MatchAvatar />
  </span>
</span>

<style>
  @property --match-orbit-progress {
    syntax: "<number>";
    inherits: true;
    initial-value: 0;
  }

  .trakt-match-orbit {
    --match-orbit-size: var(--ni-56);
    --match-orbit-stroke: var(--ni-4);
    --match-orbit-head-size: calc(var(--match-orbit-stroke) * 1.5);
    --match-orbit-progress: var(--match-orbit-sweep);
    --match-orbit-angle: calc(var(--match-orbit-progress) * 360deg);

    position: relative;
    display: inline-flex;
    flex-shrink: 0;

    width: var(--match-orbit-size);
    height: var(--match-orbit-size);

    animation: match-orbit-sweep calc(8 * var(--transition-increment))
      cubic-bezier(0.2, 0.8, 0.2, 1) both;

    &[data-size="drawer"] {
      margin-block: var(--ni-10);
      --match-orbit-size: var(--ni-96);
      --match-orbit-stroke: var(--ni-6);
    }
  }

  .trakt-match-orbit-track,
  .trakt-match-orbit-tail {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    mask: radial-gradient(
      farthest-side,
      transparent calc(100% - var(--match-orbit-stroke)),
      #000 calc(100% - var(--match-orbit-stroke) + 0.5px)
    );
  }

  .trakt-match-orbit-track {
    background: color-mix(
      in srgb,
      var(--color-text-secondary) 14%,
      transparent
    );
  }

  .trakt-match-orbit-tail {
    background: conic-gradient(
      color-mix(in srgb, var(--match-orbit-color) 35%, transparent) 0deg,
      var(--match-orbit-color) var(--match-orbit-angle),
      transparent var(--match-orbit-angle)
    );
    filter: drop-shadow(
      0 0 var(--ni-4)
        color-mix(
          in srgb,
          var(--match-orbit-color) calc(var(--match-orbit-glow) * 100%),
          transparent
        )
    );
  }

  .trakt-match-orbit-head {
    position: absolute;
    inset: 0;
    z-index: 1;
    transform: rotate(var(--match-orbit-angle));

    &::after {
      content: "";
      position: absolute;
      top: calc(var(--match-orbit-stroke) / 2);
      left: 50%;
      transform: translate(-50%, -50%);
      width: var(--match-orbit-head-size);
      height: var(--match-orbit-head-size);
      border-radius: 50%;
      background: var(--shade-10);
      box-shadow: 0 0 0 var(--ni-2)
        color-mix(in srgb, var(--match-orbit-color) 45%, transparent);
    }

    &.is-flame::after {
      content: none;
    }
  }

  .trakt-match-orbit-comet {
    --comet-scale: 1;

    position: absolute;
    top: calc(var(--match-orbit-stroke) / 2);
    left: 50%;
    width: calc(var(--match-orbit-stroke) * 8 * var(--comet-scale));
    height: calc(var(--match-orbit-stroke) * 3.6 * var(--comet-scale));
    overflow: visible;
    transform: translate(-80.645%, -42.857%);
    transform-origin: 80.645% 42.857%;
    filter: drop-shadow(0 0 var(--ni-6) var(--orange-500));
    animation: match-orbit-comet-rush calc(8 * var(--transition-increment))
      cubic-bezier(0.2, 0.8, 0.2, 1) both;

    path {
      transform-box: view-box;
      transform-origin: 50px 12px;
      animation: match-orbit-comet-lick var(--comet-lick, 1.1s) ease-in-out
        var(--comet-delay, 0s) infinite;
    }
  }

  .trakt-match-orbit-comet-outer {
    fill: var(--orange-500);
  }

  .trakt-match-orbit-comet-mid {
    --comet-lick: calc(8 * var(--transition-increment));
    --comet-delay: calc(-3 * var(--transition-increment));
    fill: var(--yellow-400);
  }

  .trakt-match-orbit-comet-core {
    --comet-lick: calc(6 * var(--transition-increment));
    --comet-delay: calc(-5 * var(--transition-increment));
    fill: var(--yellow-100);
  }

  .trakt-match-orbit-comet-hot {
    fill: var(--shade-10);
  }

  .trakt-match-orbit[data-level="3"] .trakt-match-orbit-comet {
    --comet-scale: 0.85;
  }

  .trakt-match-orbit[data-level="2"] .trakt-match-orbit-comet {
    --comet-scale: 0.7;

    filter: drop-shadow(0 0 var(--ni-2) var(--orange-500));

    path {
      animation-duration: calc(16 * var(--transition-increment));
    }
  }

  .trakt-match-orbit[data-level="1"] .trakt-match-orbit-comet {
    --comet-scale: 0.6;

    filter: none;
    opacity: 0.7;

    path {
      animation-duration: calc(24 * var(--transition-increment));
    }

    .trakt-match-orbit-comet-outer {
      fill: color-mix(in srgb, var(--color-text-secondary) 45%, transparent);
    }

    .trakt-match-orbit-comet-mid {
      fill: color-mix(in srgb, var(--color-text-secondary) 65%, transparent);
    }

    .trakt-match-orbit-comet-core {
      fill: var(--orange-300);
    }

    .trakt-match-orbit-comet-hot {
      display: none;
    }
  }

  .trakt-match-orbit-spark {
    --spark-size: calc(var(--match-orbit-stroke) * 0.4);

    position: absolute;
    top: calc(var(--match-orbit-stroke) / 2);
    left: 50%;
    width: var(--spark-size);
    height: var(--spark-size);
    margin: calc(var(--spark-size) / -2) 0 0 calc(var(--spark-size) / -2);
    border-radius: 50%;
    background: var(--orange-50);
    box-shadow: 0 0 var(--ni-4) var(--match-orbit-color);
    opacity: 0;
    animation: match-orbit-spark calc(7 * var(--transition-increment))
      ease-out 2 both;

    &[data-spark="trail-2"] {
      --spark-drift: -0.6;
      animation-delay: calc(2 * var(--transition-increment));
    }

    &[data-spark="trail-3"] {
      --spark-drift: 0.4;
      animation-delay: calc(4 * var(--transition-increment));
    }

    &[data-spark="idle"] {
      --spark-drift: -0.3;
      animation: match-orbit-spark calc(26 * var(--transition-increment))
        ease-out calc(10 * var(--transition-increment)) infinite;
    }
  }

  .trakt-match-orbit-avatar {
    position: absolute;
    inset: calc(var(--match-orbit-stroke) + var(--ni-2));
    display: flex;
  }

  @keyframes match-orbit-sweep {
    from {
      --match-orbit-progress: 0;
    }
  }

  @keyframes match-orbit-comet-rush {
    from {
      scale: 1.4 1;
    }
  }

  @keyframes match-orbit-comet-lick {
    0%,
    100% {
      transform: scaleX(1) skewY(0deg);
    }

    35% {
      transform: scaleX(1.09) skewY(-5deg);
    }

    70% {
      transform: scaleX(0.93) skewY(4deg);
    }
  }

  @keyframes match-orbit-spark {
    from {
      opacity: 1;
      translate: 0 0;
      scale: 1;
    }

    to {
      opacity: 0;
      translate: calc(var(--match-orbit-stroke) * -4.5)
        calc(var(--match-orbit-stroke) * var(--spark-drift, 0.2));
      scale: 0.3;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-match-orbit,
    .trakt-match-orbit-comet,
    .trakt-match-orbit-comet path {
      animation: none;
    }

    .trakt-match-orbit-spark {
      display: none;
    }
  }
</style>
