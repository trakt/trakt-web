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

  const level = $derived(matchLevel(score, kind));
  const tier = $derived(level === 0 ? null : matchTiers(kind)[level]);
  const isFlame = $derived(kind === "hype" && level > 1);
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
        <svg viewBox="0 0 10 13">
          <path
            d="M5 0C6 3 9 5 9 8.5a4 4 0 0 1-8 0C1 6 3 5 3 3c1 1 1.5 1.5 2 2 .5-1.5.5-3 0-5Z"
          />
          <path
            class="trakt-match-orbit-flame-core"
            d="M5 6c1 1.5 2 2.5 2 3.8a2 2 0 0 1-4 0C3 8.6 4.5 7.6 5 6Z"
          />
        </svg>
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
    transform: rotate(var(--match-orbit-angle));

    &::after,
    svg {
      position: absolute;
      top: calc(var(--match-orbit-stroke) / 2);
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &::after {
      content: "";
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

    svg {
      width: calc(var(--match-orbit-head-size) * 2);
      height: calc(var(--match-orbit-head-size) * 2.6);
      fill: var(--match-orbit-color);
      filter: drop-shadow(0 0 var(--ni-2) var(--match-orbit-color));
      transform-origin: 50% 80%;
      transform: translate(-50%, -70%) rotate(calc(-1 * var(--match-orbit-angle)));
      animation: match-orbit-flicker calc(6 * var(--transition-increment))
        ease-in-out infinite;
    }
  }

  .trakt-match-orbit-flame-core {
    fill: var(--orange-50);
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

  @keyframes match-orbit-flicker {
    50% {
      opacity: 0.8;
      scale: 1.15;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-match-orbit,
    .trakt-match-orbit-head svg {
      animation: none;
    }
  }
</style>
