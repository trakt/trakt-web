<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaRating } from "$lib/requests/models/MediaRating.ts";
  import { getLocale } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { toTraktRating } from "$lib/utils/formatting/number/toTraktRating";
  import { STAR_RATINGS } from "../constants/index.ts";

  type RatingsDistributionProps = {
    trakt: NonNullable<MediaRating["trakt"]>;
  };

  const { trakt }: RatingsDistributionProps = $props();

  type DistributionKey =
    & keyof NonNullable<typeof trakt.distribution>
    & string;

  const starBuckets = $derived(
    STAR_RATINGS.map((star) => {
      const low = String(star.range.min + 1) as DistributionKey;
      const high = String(star.range.max) as DistributionKey;
      const value = (trakt.distribution?.[low] ?? 0) +
        (trakt.distribution?.[high] ?? 0);
      return { star: star.index, value };
    }),
  );

  const maxValue = $derived(
    Math.max(...starBuckets.map((b) => b.value), 1),
  );

  function toIntensity(value: number, max: number): 0 | 1 | 2 | 3 | 4 {
    if (value <= 0) return 0;
    const ratio = value / max;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  }

  const traktPercent = $derived(toTraktRating(trakt.rating, getLocale()));
  const voteCountText = $derived(toHumanNumber(trakt.votes, getLocale()));
</script>

<section class="trakt-ratings-distribution">
  <h3 class="card-title bold secondary">{m.header_ratings_trakt()}</h3>

  <div class="ratings-row">
    <div class="trakt-display">
      <p class="trakt-rating-value bold">{traktPercent}</p>
      <p class="trakt-rating-votes secondary uppercase tag">
        {m.text_ratings_votes({ count: voteCountText })}
      </p>
    </div>

    <div class="trakt-histogram" aria-hidden="true">
      <div class="histogram-bars">
        {#each starBuckets as bucket (bucket.star)}
          <div class="histogram-bar-slot">
            <div
              class="histogram-bar"
              data-intensity={toIntensity(bucket.value, maxValue)}
              style="--bar-height: {(bucket.value / maxValue) * 100}%"
            ></div>
            <span class="bar-tooltip tag bold">
              {toHumanNumber(bucket.value, getLocale())}
            </span>
          </div>
        {/each}
      </div>
      <div class="histogram-scale tag secondary">
        {#each starBuckets as bucket (bucket.star)}
          <span>{bucket.star}</span>
        {/each}
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-ratings-distribution {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--ni-12) var(--ni-16);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
  }

  .card-title {
    color: var(--color-text-secondary);
    margin: 0;
    font-size: var(--font-size-text-small);
  }

  .ratings-row {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: var(--gap-m);
  }

  .trakt-display {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .trakt-rating-value {
    font-size: var(--ni-32);
    line-height: 100%;
  }

  .trakt-rating-votes {
    color: var(--color-text-secondary);
  }

  .trakt-histogram {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
  }

  .histogram-bars {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: var(--ni-4);
    height: var(--ni-48);
  }

  .histogram-bar-slot {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 100%;
    transform-origin: bottom;
    transition: transform calc(0.5 * var(--transition-increment)) ease-in-out;

    @include for-mouse {
      &:hover {
        transform: scale(1.1);

        .histogram-bar {
          background: var(--color-text-primary);
        }

        .bar-tooltip {
          opacity: 1;
          transform: translate(-50%, calc(-1 * var(--ni-6)));
        }
      }
    }
  }

  .histogram-bar {
    width: 70%;
    height: var(--bar-height);
    min-height: var(--ni-2);
    border-radius: var(--border-radius-xs);
    transform-origin: bottom;
    animation: rating-bar-rise 650ms cubic-bezier(0.16, 1, 0.3, 1) 250ms both;
    transition: background var(--transition-increment) ease-in-out;

    &[data-intensity="0"] {
      background: var(--color-heatmap-empty);
    }
    &[data-intensity="1"] {
      background: var(--color-heatmap-l1);
    }
    &[data-intensity="2"] {
      background: var(--color-heatmap-l2);
    }
    &[data-intensity="3"] {
      background: var(--color-heatmap-l3);
    }
    &[data-intensity="4"] {
      background: var(--color-heatmap-l4);
    }
  }

  .bar-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translate(-50%, 0);
    padding: var(--ni-2) var(--ni-6);
    border-radius: var(--border-radius-xs);
    background: var(--color-tooltip-background);
    color: var(--color-tooltip-text);
    opacity: 0;
    pointer-events: none;
    white-space: nowrap;
    transition: opacity var(--transition-increment) ease-in-out,
      transform var(--transition-increment) ease-in-out;
  }

  .histogram-scale {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    color: var(--color-text-secondary);

    span {
      text-align: center;
    }
  }

  @keyframes rating-bar-rise {
    from {
      transform: scaleY(0);
    }
    to {
      transform: scaleY(1);
    }
  }
</style>
