<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import SummaryPosterTags from "../_internal/SummaryPosterTags.svelte";
  import SummaryTitle from "../_internal/SummaryTitle.svelte";
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

  const { ratings } = $derived(useMediaMetaInfo(target));

  const posterUrl = $derived(streamOn?.preferred?.link ?? media.trailer);
</script>

{#snippet tags()}
  <SummaryPosterTags {postCreditsCount} watchCount={$watchCount} />
{/snippet}

<CoverImageSetter src={media.cover.url.medium} colors={media.colors} {type} />

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
        {/if}

        {#if media.trailer != null}
          <TrailerOverlay />
        {/if}
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <SummaryHeader {title}>
    <SummaryTitle {title} {crew} {...target} />
    <RatingList ratings={$ratings} airDate={media.airDate} />
  </SummaryHeader>

  <Spoiler {media} {type}>
    <SummaryOverview {title} overview={intl.overview ?? media.overview} />
  </Spoiler>

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
