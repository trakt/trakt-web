<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import SpoilerSection from "../../_internal/SpoilerSection.svelte";
  import Summary from "../../_internal/Summary.svelte";
  import SummaryDetails from "../../_internal/SummaryDetails.svelte";
  import SummaryPosterTags from "../../_internal/SummaryPosterTags.svelte";
  import SummaryRateNow from "../../_internal/SummaryRateNow.svelte";
  import MediaDetails from "../../details/MediaDetails.svelte";
  import { useIsRateable } from "../../rating/_internal/useIsRateable";
  import type { MediaSummaryProps } from "../MediaSummaryProps";
  import { useMediaMetaInfo } from "../useMediaMetaInfo";
  import MediaActions from "./_internal/MediaActions.svelte";
  import SideActions from "./_internal/SideActions.svelte";
  import SummaryTitle from "./_internal/SummaryTitle.svelte";

  const {
    media,
    type,
    intl,
    studios,
    crew,
  }: Omit<MediaSummaryProps<MediaEntry>, "streamOn"> & {
    type: MediaType;
    studios: MediaStudio[];
    crew: MediaCrew;
  } = $props();

  const { ratings } = $derived(useMediaMetaInfo({ media, type }));
  const title = $derived(intl?.title ?? media?.title ?? "");
  const { watchCount } = $derived(useWatchCount({ media, type: media.type }));
  const postCreditsCount = $derived(media.postCredits?.length ?? 0);

  const hasTags = $derived(postCreditsCount > 0 || $watchCount > 0);

  const status = $derived.by(() => {
    if (media.status !== "released") {
      return media.status;
    }

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return media.airDate > oneMonthAgo ? media.status : undefined;
  });

  const { isRateable } = $derived(useIsRateable({ type, media }));
</script>

{#snippet tags()}
  <SummaryPosterTags {postCreditsCount} watchCount={$watchCount} />
{/snippet}

<CoverImageSetter src={media.cover.url.medium} colors={media.colors} {type} />

{#if $isRateable}
  <NavbarStateSetter>
    {#snippet contextualActions()}
      <SummaryRateNow {type} {media} />
    {/snippet}
  </NavbarStateSetter>
{/if}

<Summary color={media.colors?.at(0)}>
  {#snippet poster()}
    <SummaryPoster
      src={media.poster.url.medium}
      alt={title}
      tags={hasTags ? tags : undefined}
    />
  {/snippet}

  {#snippet sideActions()}
    <SideActions {title} {type} />
  {/snippet}

  {#snippet meta()}
    <RatingList ratings={$ratings} airDate={media.airDate} />
    <SummaryTitle
      {title}
      {status}
      {type}
      {crew}
      genres={media.genres}
      year={media.year}
      certification={media.certification}
    />

    <RenderFor audience="authenticated">
      <MediaActions {media} {title} />
    </RenderFor>
  {/snippet}

  <SpoilerSection {media} type={media.type}>
    <p class="secondary">{intl.overview ?? media.overview}</p>
  </SpoilerSection>

  <SummaryDetails {type}>
    <MediaDetails {media} {studios} {crew} {type} />
  </SummaryDetails>
</Summary>
