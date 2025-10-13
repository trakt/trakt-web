<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import SpoilerSection from "../../_internal/SpoilerSection.svelte";
  import Summary from "../../_internal/Summary.svelte";
  import SummaryDetails from "../../_internal/SummaryDetails.svelte";
  import SummaryPosterTags from "../../_internal/SummaryPosterTags.svelte";
  import SummaryRateNow from "../../_internal/SummaryRateNow.svelte";
  import MediaDetails from "../../details/MediaDetails.svelte";
  import MediaStreamingServices from "../../details/MediaStreamingServices.svelte";
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
    streamOn,
  }: MediaSummaryProps<MediaEntry> & {
    type: MediaType;
    studios: MediaStudio[];
    crew: MediaCrew;
  } = $props();

  const { ratings } = $derived(useMediaMetaInfo({ media, type }));
  const title = $derived(intl?.title ?? media?.title ?? "");
  const { watchCount } = $derived(useWatchCount({ media, type: media.type }));
  const postCreditsCount = $derived(media.postCredits?.length ?? 0);

  const hasTags = $derived(postCreditsCount > 0 || $watchCount > 0);
</script>

{#snippet tags()}
  <SummaryPosterTags {postCreditsCount} watchCount={$watchCount} />
{/snippet}

<CoverImageSetter src={media.cover.url.medium} colors={media.colors} {type} />

<Summary color={media.colors?.at(0)}>
  {#snippet poster()}
    <SummaryPoster
      src={media.poster.url.medium}
      alt={title}
      tags={hasTags ? tags : undefined}
    />
  {/snippet}

  {#snippet sideActions()}
    <SideActions {title} {type} trailer={media.trailer} slug={media.slug} />
  {/snippet}

  {#snippet meta()}
    <RatingList ratings={$ratings} airDate={media.airDate} />
    <SummaryTitle
      {title}
      genres={media.genres}
      year={media.year}
      status={media.status}
    />

    <RenderFor audience="authenticated">
      <MediaActions {media} {streamOn} {title} />

      <SummaryRateNow {type} {media} />
    </RenderFor>
  {/snippet}

  <SpoilerSection {media} type={media.type}>
    <p class="secondary">{intl.overview ?? media.overview}</p>
  </SpoilerSection>

  <SummaryDetails>
    <MediaDetails {media} {studios} {crew} {type} />
  </SummaryDetails>

  {#if streamOn}
    <RenderFor audience="authenticated">
      <MediaStreamingServices
        services={streamOn.services}
        preferred={streamOn.preferred}
      />
    </RenderFor>
  {/if}
</Summary>
