<script lang="ts">
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useIsDropped } from "$lib/sections/media-actions/drop/useIsDropped";
  import { useIsRewatching } from "$lib/sections/media-actions/rewatching/useIsRewatching";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import {
    SummaryDrawers,
    summaryDrawerNavigation,
  } from "../../_internal/summaryDrawerNavigation";
  import SocialActivitiesButton from "../_internal/SocialActivitiesButton.svelte";
  import SummaryCover from "../_internal/SummaryCover.svelte";
  import SummaryPosterTags from "../_internal/SummaryPosterTags.svelte";
  import SummaryTitle from "../_internal/SummaryTitle.svelte";
  import { useIsStarted } from "../_internal/useIsStarted";
  import StreamOnOverlay from "../overlay/StreamOnOverlay.svelte";
  import TrailerOverlay from "../overlay/TrailerOverlay.svelte";
  import RateNow from "../rating/RateNow.svelte";
  import SummaryActions from "../summary/SummaryActions.svelte";
  import SummaryContainer from "../summary/SummaryContainer.svelte";
  import SummaryHeader from "../summary/SummaryHeader.svelte";
  import SummaryOverview from "../summary/SummaryOverview.svelte";
  import type { MediaSummaryProps } from "./MediaSummaryProps";
  import { useMediaMetaInfo } from "./useMediaMetaInfo";
  import MediaActions from "./v2/_internal/MediaActions.svelte";

  const {
    intl,
    contextualContent,
    streamOn,
    crew,
    ...target
  }: MediaSummaryProps = $props();

  const media = $derived(target.media);
  const type = $derived(media.type);

  const title = $derived(intl?.title ?? media?.title ?? "");
  const { watchCount } = $derived(useWatchCount(target));
  const postCreditsCount = $derived(media.postCredits?.length ?? 0);
  const socialTarget = $derived({
    type: target.type,
    slug: media.slug,
  });

  const { ratings, isLoading } = $derived(useMediaMetaInfo(target));
  const { isDropped } = $derived(useIsDropped(media));
  const { isStarted } = $derived(useIsStarted(target));
  const { isRewatching } = $derived(useIsRewatching(target));

  const { buildDrawerLink } = summaryDrawerNavigation();
  const ratingsDrawerLink = $derived(buildDrawerLink(SummaryDrawers.Ratings));

  const posterUrl = $derived(streamOn?.preferred?.link ?? media.trailer);
</script>

{#snippet tags()}
  <SummaryPosterTags
    {postCreditsCount}
    watchCount={$watchCount}
    isDropped={$isDropped}
    isStarted={$isStarted}
    isRewatching={$isRewatching}
  />
{/snippet}

<SummaryCover src={media.cover.url.medium} colors={media.colors} {type} />

<SummaryContainer {contextualContent}>
  {#snippet poster()}
    <SummaryPoster
      src={media.poster.url.medium}
      alt={title}
      href={posterUrl}
      {tags}
    >
      {#snippet hoverOverlay()}
        {#if streamOn?.preferred != null}
          <StreamOnOverlay service={streamOn.preferred} />
        {:else if media.trailer != null}
          <TrailerOverlay />
        {/if}
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <div class="trakt-summary-main-content">
    <SummaryHeader {title}>
      <SummaryTitle {title} {crew} {...target} />
      <RatingList
        ratings={$ratings}
        entry={media}
        drilldown={ratingsDrawerLink}
        isLoading={$isLoading}
      />

      <RenderFor audience="authenticated">
        <SocialActivitiesButton target={socialTarget} {title} />
      </RenderFor>
    </SummaryHeader>

    <Spoiler {media} {type}>
      <SummaryOverview {title} overview={intl.overview ?? media.overview} />
    </Spoiler>
  </div>

  <RenderFor audience="authenticated">
    <SummaryActions>
      <RenderFor audience="authenticated">
        <MediaActions {media} {title} />
      </RenderFor>

      {#snippet contextualActions()}
        <RenderFor audience="authenticated">
          <RateNow {type} {media} />
        </RenderFor>
      {/snippet}
    </SummaryActions>
  </RenderFor>
</SummaryContainer>

<style>
  .trakt-summary-main-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
    flex: 1;
  }
</style>
