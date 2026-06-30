<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaRating } from "$lib/requests/models/MediaRating.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { toTraktRating } from "$lib/utils/formatting/number/toTraktRating";
  import { ratio } from "$lib/utils/number/ratio.ts";
  import { STAR_RATINGS } from "../constants/index.ts";

  type RatingsDistributionProps = {
    trakt: NonNullable<MediaRating["trakt"]>;
  };

  const { trakt }: RatingsDistributionProps = $props();

  type DistributionKey =
    & keyof NonNullable<typeof trakt.distribution>
    & string;

  const buckets = $derived(
    STAR_RATINGS.map((star) => {
      const low = String(star.range.min + 1) as DistributionKey;
      const high = String(star.range.max) as DistributionKey;
      const value = (trakt.distribution?.[low] ?? 0) +
        (trakt.distribution?.[high] ?? 0);
      return { value, star: star.index };
    }),
  );

  const maxValue = $derived(Math.max(...buckets.map((b) => b.value), 1));

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

    <div class="trakt-histogram">
      {#each buckets as bucket, i (bucket.star)}
        <Tooltip
          content={toHumanNumber(bucket.value, getLocale())}
          variant="compact"
          sideOffset={4}
        >
          <div class="histogram-column">
            <div class="histogram-bar">
              <DistributionBar
                orientation="vertical"
                fraction={ratio({ value: bucket.value, total: maxValue })}
                active={bucket.value === maxValue && maxValue > 0}
                minVisible={0.04}
                index={i}
                label="{bucket.star}: {toHumanNumber(bucket.value, getLocale())}"
                --distribution-bar-thickness="100%"
              />
            </div>
            <span class="histogram-label tag secondary">{bucket.star}</span>
          </div>
        </Tooltip>
      {/each}
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
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: end;
    gap: var(--ni-4);

    :global(.trakt-tooltip-trigger) {
      transform-origin: bottom;
      transition: transform calc(0.5 * var(--transition-increment)) ease-in-out;

      @include for-mouse {
        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }

  .histogram-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-4);
    width: 100%;
  }

  .histogram-bar {
    width: 70%;
    height: var(--ni-48);
    display: flex;
    justify-content: center;
  }

  .histogram-label {
    color: var(--color-text-secondary);
  }
</style>
