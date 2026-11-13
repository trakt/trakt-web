<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp.ts";
  import TodaySentimentInsights from "$lib/sections/today/TodaySentimentInsights.svelte";
  import { useTodayDetails } from "$lib/sections/today/useTodayDetails.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import type { MixtapeStageDetailsProps } from "./MixtapeStageDetailsProps.ts";
  import MixtapeStageGuidance from "./MixtapeStageGuidance.svelte";
  import { toMixtapeMeta } from "./toMixtapeMeta.ts";

  const OVERVIEW_LINES = 3;
  const OVERVIEW_LINES_PHONE = 2;
  const HIGHLIGHT_LINES = 2;

  const { media, kicker }: MixtapeStageDetailsProps = $props();

  const { ratings, isRatingsLoading, sentiment } = useTodayDetails(
    fromRune(() => media),
  );

  const isPhone = useMedia(WellKnownMediaQuery.mobile);

  const meta = $derived(toMixtapeMeta(media));
  const overviewLines = $derived(
    $isPhone ? OVERVIEW_LINES_PHONE : OVERVIEW_LINES,
  );
</script>

<div class="trakt-mixtape-stage-details">
  <div class="details-heading">
    {#if kicker}
      <p class="tag uppercase bold ellipsis details-kicker">{kicker}</p>
    {/if}
    <h2 class="details-title">{media.title}</h2>
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

  {#if media.overview}
    <p class="small details-overview" use:lineClamp={{ lines: overviewLines }}>
      {media.overview}
    </p>
  {/if}

  {#if $sentiment}
    <div class="details-insights">
      <TodaySentimentInsights
        sentiment={$sentiment}
        highlightLines={HIGHLIGHT_LINES}
        variant={$isPhone ? "headline" : "full"}
      />
    </div>
  {/if}

  <MixtapeStageGuidance {media} />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

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

    .details-ratings {
      min-height: var(--ni-32);
    }

    .details-insights {
      padding-block-start: var(--gap-m);
      border-block-start: var(--border-thickness-xxs) solid var(--color-border);
    }

    /*
      Phones: a centred hero heading, then the reading blocks start-aligned
      and tightened so the whole stage fits one screen without scrolling.
    */
    @include for-mobile {
      --gap-mixtape-guidance: var(--gap-xs);

      gap: var(--gap-xs);

      .details-heading {
        align-items: center;
        gap: var(--ni-4);
        text-align: center;
      }

      .details-title {
        font-size: var(--ni-22);
      }

      .details-ratings {
        min-height: var(--ni-24);
      }

      .details-ratings :global(.trakt-summary-ratings) {
        justify-content: center;
      }

      .details-insights {
        padding-block-start: var(--gap-xs);
      }
    }
  }
</style>
