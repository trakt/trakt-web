<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import type { MarkAsWatchedButtonProps } from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonProps";
  import WatchNowButton from "$lib/components/buttons/watch-now/WatchNowButton.svelte";
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import type { WatchlistButtonProps } from "$lib/components/buttons/watchlist/WatchlistButtonProps";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaStats } from "$lib/models/MediaStats";
  import type { MediaStudio } from "$lib/models/MediaStudio";
  import type { MediaType } from "$lib/models/MediaType";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";
  import { useWatchlist } from "$lib/stores/useWatchlist";
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

  const { markAsWatched, removeWatched, isMarkingAsWatched, isWatched } =
    $derived(
      useMarkAsWatched({
        type,
        media,
      }),
    );

  const {
    isWatchlistUpdating,
    isWatchlisted,
    addToWatchlist,
    removeFromWatchlist,
  } = $derived(
    useWatchlist({
      type,
      media,
    }),
  );

  const title = $derived(intl.title ?? media.title);

  const watchlistProps: WatchlistButtonProps = $derived({
    type: "normal",
    title,
    isWatchlistUpdating: $isWatchlistUpdating,
    isWatchlisted: $isWatchlisted,
    onAdd: addToWatchlist,
    onRemove: removeFromWatchlist,
  });

  const markWasWatchedProps: MarkAsWatchedButtonProps = $derived({
    type: "normal",
    title,
    isMarkingAsWatched: $isMarkingAsWatched,
    isWatched: $isWatched,
    onWatch: markAsWatched,
    onRemove: removeWatched,
  });

  const { watchNow, isLoading } = useWatchNow({ type, id: media.slug });
</script>

{#snippet mediaActions()}
  <WatchNowButton
    isLoading={$isLoading}
    streamingLink={$watchNow?.link}
    mediaTitle={media.title}
  />
  <WatchlistButton {...watchlistProps} />
  <MarkAsWatchedButton {...markWasWatchedProps} />
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

  <RenderFor device={["mobile", "tablet-sm"]} audience="authenticated">
    <MediaSummaryActions>
      {@render mediaActions()}
    </MediaSummaryActions>
  </RenderFor>
</MediaSummaryContainer>

<MediaSummaryContainer>
  <MediaDetails {media} {studios} {crew} />
</MediaSummaryContainer>
