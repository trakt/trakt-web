<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
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
  import TrailerOverlay from "../overlay/TrailerOverlay.svelte";
  import WatchNowOverlay from "../overlay/WatchNowOverlay.svelte";
  import RateNow from "../rating/RateNow.svelte";
  import SummaryActions from "../summary/SummaryActions.svelte";
  import SummaryContainer from "../summary/SummaryContainer.svelte";
  import SummaryHeader from "../summary/SummaryHeader.svelte";
  import SummaryOverview from "../summary/SummaryOverview.svelte";
  import SummaryTitle from "../summary/SummaryTitle.svelte";
  import MediaDetails from "./MediaDetails.svelte";
  import type { MediaSummaryProps } from "./MediaSummaryProps";
  import MediaWatchNowServices from "./MediaWatchNowServices.svelte";

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

  const { watchNow } = $derived(
    useWatchNow({
      type,
      id: media.id,
    }),
  );
</script>

{#snippet mediaActions(device: "mobile" | "other" = "other")}
  <WatchlistAction
    {...watchlistProps}
    style={device === "mobile" ? "action" : "normal"}
  />
  <MarkAsWatchedAction
    {...markWasWatchedProps}
    size={device === "mobile" ? "small" : "normal"}
  />
{/snippet}

<CoverImageSetter src={media.cover.url.medium} {type} />

<SummaryContainer {contextualContent}>
  {#snippet poster()}
    <SummaryPoster
      src={media.poster.url.medium}
      alt={title}
      href={$watchNow?.preferred?.link ?? media.trailer}
    >
      {#snippet hoverOverlay()}
        {#if $watchNow?.preferred}
          <WatchNowOverlay service={$watchNow?.preferred} />
        {:else}
          <TrailerOverlay trailer={media.trailer} />
        {/if}
      {/snippet}
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
    {media}
    {ratings}
    {stats}
    {watchers}
    {type}
  />

  <Spoiler {media} {type}>
    <SummaryOverview {title} overview={intl.overview ?? media.overview} />
  </Spoiler>

  <RenderFor audience="authenticated">
    <SummaryActions>
      <RenderFor device={["tablet-sm"]} audience="authenticated">
        {@render mediaActions()}
      </RenderFor>

      <RenderFor device={["mobile"]} audience="authenticated">
        {@render mediaActions("mobile")}
      </RenderFor>

      {#snippet contextualActions()}
        {#if type === "movie"}
          <RateNow {type} {media} />
        {/if}
      {/snippet}
    </SummaryActions>
  </RenderFor>
</SummaryContainer>

<SummaryContainer>
  <MediaDetails {media} {studios} {crew} />
  <MediaWatchNowServices
    services={$watchNow?.services}
    preferred={$watchNow?.preferred}
  />
</SummaryContainer>
