<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
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

  const { ratings } = $derived(useMediaMetaInfo(target));
</script>

<CoverImageSetter src={media.cover.url.medium} colors={media.colors} {type} />

<SummaryContainer {contextualContent}>
  {#snippet poster()}
    <SummaryPoster
      src={media.poster.url.medium}
      alt={title}
      href={streamOn?.preferred?.link ?? media.trailer}
    >
      {#snippet hoverOverlay()}
        {#if streamOn?.preferred}
          <StreamOnOverlay service={streamOn.preferred} />
        {:else}
          <TrailerOverlay trailer={media.trailer} />
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
