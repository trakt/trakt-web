<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaIntl } from "$lib/requests/models/MediaIntl";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import { useIsDropped } from "$lib/sections/media-actions/drop/useIsDropped";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import {
    SummaryDrawers,
    summaryDrawerNavigation,
  } from "../../../_internal/summaryDrawerNavigation";
  import SocialActivitiesButton from "../../_internal/SocialActivitiesButton.svelte";
  import SpoilerSection from "../../_internal/SpoilerSection.svelte";
  import Summary from "../../_internal/Summary.svelte";
  import SummaryPosterTags from "../../_internal/SummaryPosterTags.svelte";
  import SummaryRateNow from "../../_internal/SummaryRateNow.svelte";
  import SummaryTitle from "../../_internal/SummaryTitle.svelte";
  import { useIsStarted } from "../../_internal/useIsStarted";
  import { useIsRateable } from "../../rating/_internal/useIsRateable";
  import type { MediaSummaryEntry } from "../models/MediaSummaryEntry";
  import { useMediaMetaInfo } from "../useMediaMetaInfo";
  import MediaActions from "./_internal/MediaActions.svelte";
  import SideActions from "./_internal/SideActions.svelte";

  const {
    intl,
    studios,
    crew,
    ...target
  }: {
    intl: MediaIntl;
    studios: MediaStudio[];
    crew: MediaCrew;
  } & MediaSummaryEntry = $props();

  const media = $derived(target.media);

  const { ratings } = $derived(useMediaMetaInfo(target));
  const title = $derived(intl?.title ?? media?.title ?? "");
  const { watchCount } = $derived(useWatchCount(target));
  const postCreditsCount = $derived(media.postCredits?.length ?? 0);
  const socialTarget = $derived({
    type: target.type,
    slug: media.slug,
  });

  const { isRateable } = $derived(useIsRateable(target));
  const { isDropped } = $derived(useIsDropped(media));
  const { isStarted } = $derived(useIsStarted(target));

  const { buildDrawerLink } = summaryDrawerNavigation();
  const ratingsDrawerLink = $derived(buildDrawerLink(SummaryDrawers.Ratings));
</script>

{#snippet tags()}
  <SummaryPosterTags
    {postCreditsCount}
    watchCount={$watchCount}
    isDropped={$isDropped}
    isStarted={$isStarted}
  />
{/snippet}

<CoverImageSetter
  src={media.cover.url.medium}
  colors={media.colors}
  type={target.type}
/>

{#if $isRateable}
  <NavbarStateSetter>
    {#snippet contextualActions()}
      <SummaryRateNow {...target} />
    {/snippet}
  </NavbarStateSetter>
{/if}

<Summary color={media.colors?.at(0)}>
  {#snippet poster()}
    <SummaryPoster src={media.poster.url.medium} alt={title} {tags} />
  {/snippet}

  {#snippet sideActions()}
    <SideActions {title} type={target.type} {media} />
  {/snippet}

  {#snippet meta()}
    <SummaryTitle {title} {crew} {...target} />
    <RatingList
      ratings={$ratings}
      entry={media}
      drilldown={ratingsDrawerLink}
    />

    <RenderFor audience="authenticated">
      <SocialActivitiesButton target={socialTarget} {title} />
      <MediaActions {media} {title} />
    </RenderFor>
  {/snippet}

  <SpoilerSection {media} type={media.type}>
    <p class="secondary small">{intl.overview ?? media.overview}</p>
  </SpoilerSection>
</Summary>
