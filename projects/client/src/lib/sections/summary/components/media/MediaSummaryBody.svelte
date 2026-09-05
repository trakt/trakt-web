<script lang="ts">
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaIntl } from "$lib/requests/models/MediaIntl";
  import { useIsDropped } from "$lib/sections/media-actions/drop/useIsDropped";
  import { useIsRewatching } from "$lib/sections/media-actions/rewatching/useIsRewatching";
  import { useIsWatchlisted } from "$lib/stores/useIsWatchlisted";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import type { Snippet } from "svelte";
  import SpoilerSection from "../_internal/SpoilerSection.svelte";
  import Summary from "../_internal/Summary.svelte";
  import SummaryPosterTags from "../_internal/SummaryPosterTags.svelte";
  import SummaryTitle from "../_internal/SummaryTitle.svelte";
  import { useIsStarted } from "../_internal/useIsStarted";
  import type { MediaSummaryEntry } from "./models/MediaSummaryEntry";
  import { useMediaMetaInfo } from "./useMediaMetaInfo";

  const {
    intl,
    crew,
    actions,
    sideActions,
    variant = "page",
    color,
    titleHref,
    hasDetails = true,
    hasReservedRows = false,
    ratingsDrilldown,
    ...target
  }: {
    intl: MediaIntl;
    crew: MediaCrew;
    actions?: Snippet;
    sideActions?: Snippet;
    variant?: "page" | "drawer";
    color?: string;
    titleHref?: string;
    hasDetails?: boolean;
    hasReservedRows?: boolean;
    ratingsDrilldown?: {
      href: string;
      noscroll: boolean;
      replacestate: boolean;
    };
  } & MediaSummaryEntry = $props();

  const media = $derived(target.media);
  const title = $derived(intl?.title ?? media?.title ?? "");

  const { ratings, isLoading } = $derived(useMediaMetaInfo(target));
  const { watchCount } = $derived(useWatchCount(target));
  const { isDropped } = $derived(useIsDropped(media));
  const { isStarted } = $derived(useIsStarted(target));
  const { isRewatching } = $derived(useIsRewatching(target));
  const { isWatchlisted } = $derived(useIsWatchlisted(target));
</script>

{#snippet tags()}
  <SummaryPosterTags
    postCreditsCount={media.postCredits?.length ?? 0}
    watchCount={$watchCount}
    isDropped={$isDropped}
    isStarted={$isStarted}
    isRewatching={$isRewatching}
    isWatchlisted={$isWatchlisted}
  />
{/snippet}

<Summary {variant} {color} {sideActions}>
  {#snippet poster()}
    <SummaryPoster
      src={media.poster.url.medium}
      alt={title}
      href={titleHref}
      target={titleHref ? "_self" : undefined}
      {tags}
    />
  {/snippet}


  {#snippet meta()}
    <SummaryTitle
      {title}
      {crew}
      href={titleHref}
      {hasDetails}
      {hasReservedRows}
      {...target}
    />

    <div class="trakt-media-summary-ratings">
      <RatingList
        ratings={$ratings}
        entry={media}
        drilldown={ratingsDrilldown}
        isLoading={$isLoading}
      />
    </div>

    {@render actions?.()}
  {/snippet}

  <div class="trakt-media-summary-overview">
    <SpoilerSection {media} type={media.type}>
      <p class="secondary small">{intl?.overview ?? media.overview}</p>
    </SpoilerSection>
  </div>
</Summary>

<style lang="scss">
  :global(.trakt-summary[data-variant="drawer"]) {
    .trakt-media-summary-ratings {
      display: flex;
      justify-content: center;

      min-height: var(--glance-ratings-height);
    }

    .trakt-media-summary-overview {
      min-height: var(--glance-overview-height);

      :global(p) {
        display: -webkit-box;

        line-clamp: var(--glance-overview-lines);
        -webkit-line-clamp: var(--glance-overview-lines);
        -webkit-box-orient: vertical;

        overflow: hidden;
      }
    }
  }
</style>
