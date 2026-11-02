<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import RealityTierPill from "$lib/sections/components/reality-check/RealityTierPill.svelte";
  import RealityTierPillSkeleton from "$lib/sections/components/reality-check/RealityTierPillSkeleton.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import type { TodayMedia } from "./models/TodayMedia.ts";
  import TodaySentimentInsights from "./TodaySentimentInsights.svelte";
  import { useTodayDetails } from "./useTodayDetails.ts";
  import { toMediaMeta } from "./_internal/toMediaMeta.ts";

  const { media, kicker = null }: { media: TodayMedia; kicker?: string | null } =
    $props();

  const { ratings, isRatingsLoading, sentiment, realityCheck } =
    useTodayDetails(fromRune(() => media));

  const meta = $derived(toMediaMeta(media));
</script>

<div class="trakt-today-poster-details">
  <div class="details-header">
    <CrossOriginImage src={media.cover.url.medium} alt="" />
    <div class="details-heading">
      {#if kicker}
        <p class="tag uppercase bold ellipsis details-kicker">{kicker}</p>
      {/if}
      <h3 class="ellipsis">{media.title}</h3>
      <p class="small secondary ellipsis">{meta}</p>
    </div>
  </div>

  <div class="details-body">
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
      <p class="small" use:lineClamp={{ lines: 5 }}>{media.overview}</p>
    {/if}

    {#if $sentiment}
      <div class="details-sentiment">
        <TodaySentimentInsights sentiment={$sentiment} />
      </div>
    {/if}

    {#if $realityCheck !== null}
      <div class="details-reality-check">
        <p class="tag uppercase bold details-kicker">
          {m.header_reality_check()}
        </p>
        {#if $realityCheck}
          <RealityTierPill tier={$realityCheck.verdict} variant="compact" />
        {:else}
          <RealityTierPillSkeleton variant="compact" />
        {/if}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .trakt-today-poster-details {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    height: var(--height-poster-details, 100%);
    overflow: hidden;

    .details-header {
      position: relative;
      flex: 0 0 var(--height-poster-details-cover, max(var(--ni-120), 35%));

      :global(img) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          transparent 30%,
          var(--color-card-background) 100%
        );
      }
    }

    .details-heading {
      position: absolute;
      inset-inline: var(--gap-m);
      bottom: var(--gap-xs);
      z-index: var(--layer-raised);

      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);

      h3 {
        margin: 0;
      }
    }

    .details-body {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      flex-shrink: 0;

      padding: var(--gap-s) var(--gap-m) var(--gap-m);
    }

    .details-ratings {
      min-height: var(--ni-32);
    }

    .details-sentiment {
      padding-top: var(--gap-s);
      border-top: var(--border-thickness-xxs) solid var(--color-border);
    }

    .details-reality-check {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-xs);

      min-height: var(--ni-24);
      padding-top: var(--gap-s);
      border-top: var(--border-thickness-xxs) solid var(--color-border);
    }

    .details-kicker {
      color: var(--color-text-emphasis);
    }
  }
</style>
