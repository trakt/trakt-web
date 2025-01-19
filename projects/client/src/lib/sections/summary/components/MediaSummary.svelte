<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import WatchNowButton from "$lib/components/buttons/watch-now/WatchNowButton.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaStats } from "$lib/models/MediaStats";
  import type { MediaStudio } from "$lib/models/MediaStudio";
  import type { MediaType } from "$lib/models/MediaType";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import { useWatchNow } from "$lib/stores/useWatchNow";
  import type { Snippet } from "svelte";
  import MediaDetails from "./MediaDetails.svelte";
  import MediaMetaInfo from "./MediaMetaInfo.svelte";
  import MediaOverview from "./MediaOverview.svelte";
  import type { MediaSummary } from "./MediaSummary";
  import MediaSummaryActions from "./MediaSummaryActions.svelte";
  import MediaSummaryContainer from "./MediaSummaryContainer.svelte";
  import MediaSummaryHeader from "./MediaSummaryHeader.svelte";
  import type { MediaSummaryProps } from "./MediaSummaryProps";
  import MediaTitle from "./MediaTitle.svelte";
  import RateNowButton from "./RateNowButton.svelte";

  const {
    media,
    ratings,
    type,
    intl,
    contextualContent,
    stats,
    watchers,
    studios,
    crew,
  }: MediaSummaryProps<MediaSummary> & {
    type: MediaType;
    contextualContent?: Snippet;
    stats: MediaStats;
    studios: MediaStudio[];
    crew: MediaCrew;
  } = $props();

  const title = $derived(intl.title ?? media.title);

  const watchlistProps = $derived({
    style: "normal" as const,
    title,
    type,
    media,
  });

  const markWasWatchedProps = $derived({
    style: "normal" as const,
    title,
    type,
    media,
  });

  const { watchNow, isLoading } = useWatchNow({ type, id: media.slug });
</script>

{#snippet mediaActions()}
  <WatchNowButton
    isLoading={$isLoading}
    streamingLink={$watchNow?.link}
    mediaTitle={media.title}
  />
  <WatchlistAction {...watchlistProps} />
  <MarkAsWatchedAction {...markWasWatchedProps} />
{/snippet}

<CoverImageSetter src={media.cover.url.medium} {type} />

<MediaSummaryContainer {contextualContent}>
  {#snippet poster()}
    <SummaryPoster src={media.poster.url.medium} alt={title}>
      {#snippet actions()}
        <RenderFor device={["tablet-lg", "desktop"]} audience="authenticated">
          {@render mediaActions()}
        </RenderFor>
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <MediaSummaryHeader {title}>
    <MediaTitle {title} />
    <GenreList genres={media.genres} />
  </MediaSummaryHeader>

  <MediaMetaInfo
    certification={media.certification}
    year={media.year}
    airDate={media.airDate}
    {ratings}
    {stats}
    {watchers}
  />

  <MediaOverview {title} overview={intl.overview ?? media.overview} />

  {#if type === "movie"}
    <RenderFor audience="authenticated">
      <MediaSummaryActions>
        <RateNowButton {type} id={media.id} />

        <RenderFor device={["mobile", "tablet-sm"]} audience="authenticated">
          {@render mediaActions()}
        </RenderFor>
      </MediaSummaryActions>
    </RenderFor>
  {/if}
</MediaSummaryContainer>

<MediaSummaryContainer>
  <MediaDetails {media} {studios} {crew} />
</MediaSummaryContainer>
