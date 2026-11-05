<script lang="ts">
  import type { MatchRingProps } from "./MatchRingProps.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { MATCH_LOW_THRESHOLD } from "./constants/matchRing.ts";

  const RADIUS = 16;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const { score, size = "card", badge }: MatchRingProps = $props();

  const offset = $derived(CIRCUMFERENCE * (1 - (score ?? 0) / 100));
</script>

<span
  class="trakt-match-ring"
  class:is-low={score !== null && score < MATCH_LOW_THRESHOLD}
  data-size={size}
  role="img"
  aria-label={score === null
    ? m.image_alt_match_unknown()
    : m.image_alt_match_score({ percent: score })}
>
  <svg viewBox="0 0 40 40" aria-hidden="true">
    <circle class="trakt-match-ring-track" cx="20" cy="20" r={RADIUS} />
    {#if score !== null}
    <circle
      class="trakt-match-ring-value"
      cx="20"
      cy="20"
      r={RADIUS}
      stroke-dasharray={CIRCUMFERENCE}
      stroke-dashoffset={offset}
      transform="rotate(-90 20 20)"
    />
    {/if}
  </svg>
  <b class="trakt-match-ring-number" aria-hidden="true">
    {#if score === null}
      -
    {:else}
      {score}<small>%</small>
    {/if}
  </b>
  {#if badge}
    <span class="trakt-match-ring-badge">{@render badge()}</span>
  {/if}
</span>

<style>
  .trakt-match-ring {
    --match-ring-size: var(--width-sentiment-match-ring);
    --match-ring-font-size: var(--ni-12);

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    width: var(--match-ring-size);
    height: var(--match-ring-size);

    &[data-size="drawer"] {
      --match-ring-size: var(--ni-56);
      --match-ring-font-size: 0.9375rem;
    }

    &.is-low {
      --match-ring-color: var(--color-text-secondary);
    }
  }

  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    fill: none;
    stroke-width: 4;
  }

  .trakt-match-ring-track {
    stroke: color-mix(in srgb, var(--color-text-secondary) 25%, transparent);
  }

  .trakt-match-ring-value {
    stroke: var(--match-ring-color, var(--purple-400));
    stroke-linecap: round;
  }

  .trakt-match-ring-number {
    position: relative;
    font-size: var(--match-ring-font-size);
    line-height: 1;
    color: var(--color-text-primary);

    small {
      font-size: 0.75em;
    }
  }

  .trakt-match-ring-badge {
    position: absolute;
    inset-inline-end: calc(-1 * var(--ni-4));
    bottom: calc(-1 * var(--ni-4));

    display: flex;
    width: var(--ni-18);
    height: var(--ni-18);
  }
</style>
