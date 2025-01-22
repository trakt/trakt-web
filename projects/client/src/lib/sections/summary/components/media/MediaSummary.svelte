<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import WatchNowButton from "$lib/components/buttons/watch-now/WatchNowButton.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaStats } from "$lib/requests/models/MediaStats";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import FavoriteAction from "$lib/sections/media-actions/favorite/FavoriteAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import { useWatchNow } from "$lib/stores/useWatchNow";
  import type { Snippet } from "svelte";
  import MediaMetaInfo from "../media/MediaMetaInfo.svelte";
  import RateNowButton from "../rating/RateNowButton.svelte";
  import SummaryActions from "../summary/SummaryActions.svelte";
  import SummaryContainer from "../summary/SummaryContainer.svelte";
  import SummaryHeader from "../summary/SummaryHeader.svelte";
  import SummaryOverview from "../summary/SummaryOverview.svelte";
  import SummaryTitle from "../summary/SummaryTitle.svelte";
  import MediaDetails from "./MediaDetails.svelte";
  import type { MediaSummaryProps } from "./MediaSummaryProps";

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
  }: MediaSummaryProps<MediaEntry> & {
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

  const { watchNow, isLoading } = useWatchNow({
    type,
    id: media.id,
  });
</script>

{#snippet mediaActions()}
  <WatchNowButton
    isLoading={$isLoading}
    favoriteService={$watchNow?.favoriteService}
    services={$watchNow?.services}
    mediaTitle={media.title}
  />
  <WatchlistAction {...watchlistProps} />
  <MarkAsWatchedAction {...markWasWatchedProps} />
{/snippet}

<CoverImageSetter src={media.cover.url.medium} {type} />

<SummaryContainer {contextualContent}>
  {#snippet poster()}
    <SummaryPoster src={media.poster.url.medium} alt={title}>
      {#snippet actions()}
        <RenderFor device={["tablet-lg", "desktop"]} audience="authenticated">
          {@render mediaActions()}
        </RenderFor>
      {/snippet}
    </SummaryPoster>
  {/snippet}

  {#snippet topActions()}
    <FavoriteAction style="normal" title={media.title} {type} id={media.id} />
  {/snippet}

  <SummaryHeader {title}>
    <SummaryTitle {title} />
    <GenreList genres={media.genres} />
  </SummaryHeader>

  <MediaMetaInfo
    certification={media.certification}
    year={media.year}
    airDate={media.airDate}
    {ratings}
    {stats}
    {watchers}
  />

  <SummaryOverview {title} overview={intl.overview ?? media.overview} />

  <RenderFor audience="authenticated">
    <SummaryActions>
      {#if type === "movie"}
        <RateNowButton {type} id={media.id} />
      {/if}

      <RenderFor device={["mobile", "tablet-sm"]} audience="authenticated">
        {@render mediaActions()}
      </RenderFor>
    </SummaryActions>
  </RenderFor>
</SummaryContainer>

<SummaryContainer>
  <MediaDetails {media} {studios} {crew} />
</SummaryContainer>
