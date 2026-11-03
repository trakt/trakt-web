<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp.ts";
  import TodaySentimentInsights from "$lib/sections/today/TodaySentimentInsights.svelte";
  import { useTodayDetails } from "$lib/sections/today/useTodayDetails.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import type { MixtapeStageDetailsProps } from "./MixtapeStageDetailsProps.ts";
  import MixtapeStageGuidance from "./MixtapeStageGuidance.svelte";
  import { toMixtapeMeta } from "./toMixtapeMeta.ts";

  const OVERVIEW_LINES = 3;
  const HIGHLIGHT_LINES = 2;

  const { media, kicker, variant, onExpand }: MixtapeStageDetailsProps =
    $props();

  const { ratings, isRatingsLoading, sentiment } = useTodayDetails(
    fromRune(() => media),
  );

  const meta = $derived(toMixtapeMeta(media));
  const isBrief = $derived(variant === "brief");
</script>

<div class="trakt-mixtape-stage-details" data-variant={variant}>
  <div class="details-heading">
    {#if kicker}
      <p class="tag uppercase bold ellipsis details-kicker">{kicker}</p>
    {/if}
    {#if isBrief}
      <button
        type="button"
        class="details-title-button"
        aria-haspopup="dialog"
        onclick={onExpand}
      >
        <h2 class="details-title ellipsis">{media.title}</h2>
        <CaretRightIcon />
      </button>
    {:else}
      <h2 class="details-title">{media.title}</h2>
    {/if}
    <p class="small secondary ellipsis">{meta}</p>
  </div>

  <div class="details-ratings">
    {#if $ratings}
      <RatingList
        ratings={$ratings}
        entry={media}
        isLoading={$isRatingsLoading}
      />
    {:else if $isRatingsLoading}
      <Skeleton height="var(--ni-32)" />
    {/if}
  </div>

  {#if !isBrief}
    {#if media.overview}
      <p
        class="small details-overview"
        use:lineClamp={{ lines: OVERVIEW_LINES }}
      >
        {media.overview}
      </p>
    {/if}

    {#if $sentiment}
      <div class="details-insights">
        <TodaySentimentInsights
          sentiment={$sentiment}
          highlightLines={HIGHLIGHT_LINES}
        />
      </div>
    {/if}

    <MixtapeStageGuidance {media} />
  {/if}
</div>

<style lang="scss">
  .trakt-mixtape-stage-details {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    min-width: 0;

    p,
    h2 {
      margin: 0;
    }

    .details-heading {
      display: flex;
      flex-direction: column;
      gap: var(--ni-6);
      min-width: 0;
    }

    .details-kicker {
      color: var(--color-text-emphasis);
    }

    .details-title {
      font-size: var(--ni-30);
      line-height: 1.15;
      letter-spacing: -0.02em;
      text-wrap: balance;
    }

    .details-title-button {
      all: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--gap-xs);
      min-width: 0;
      cursor: pointer;

      :global(svg) {
        flex: none;
        width: var(--ni-16);
        height: var(--ni-16);
        color: var(--color-text-secondary);
      }

      &:focus-visible {
        border-radius: var(--border-radius-s);
        outline: var(--border-thickness-xs) solid var(--purple-300);
        outline-offset: var(--ni-4);
      }
    }

    .details-ratings {
      min-height: var(--ni-32);
    }

    .details-insights {
      padding-block-start: var(--gap-m);
      border-block-start: var(--border-thickness-xxs) solid var(--color-border);
    }

    &[data-variant="brief"] {
      align-items: center;
      gap: var(--gap-s);
      text-align: center;

      .details-heading {
        align-items: center;
      }

      .details-title {
        font-size: var(--ni-24);
      }

      .details-ratings :global(.trakt-summary-ratings) {
        justify-content: center;
      }
    }
  }
</style>
