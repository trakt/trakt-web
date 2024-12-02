<script lang="ts">
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import MarkAsWatchedActionButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedActionButton.svelte";
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import type { MarkAsWatchedButtonProps } from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonProps";
  import WatchlistActionButton from "$lib/components/buttons/watchlist/WatchlistActionButton.svelte";
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import type { WatchlistButtonProps } from "$lib/components/buttons/watchlist/WatchlistButtonProps";
  import AvailableOn from "$lib/components/responsive/AvailableOn.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";
  import { useWatchlist } from "$lib/stores/useWatchlist";
  import type { Snippet } from "svelte";
  import type { MediaSummary } from "./MediaSummary";
  import MediaSummaryContainer from "./MediaSummaryContainer.svelte";
  import MediaSummaryInfo from "./MediaSummaryInfo.svelte";
  import type { MediaSummaryProps } from "./MediaSummaryProps";

  const {
    media,
    ratings,
    type,
    contextualContent,
  }: MediaSummaryProps<MediaSummary> & {
    type: MediaType;
    contextualContent?: Snippet;
  } = $props();

  const { markAsWatched, isMarkingAsWatched, isWatched } = useMarkAsWatched({
    type,
    id: media.id,
  });

  const {
    isWatchlistUpdating,
    isWatchlisted,
    addToWatchlist,
    removeFromWatchlist,
  } = useWatchlist({
    type,
    id: media.id,
  });

  const watchlistProps: WatchlistButtonProps = $derived({
    title: media.title,
    isWatchlistUpdating: $isWatchlistUpdating,
    isWatchlisted: $isWatchlisted,
    onAdd: addToWatchlist,
    onRemove: removeFromWatchlist,
  });

  const markWasWatchedProps: MarkAsWatchedButtonProps = {
    title: media.title,
    isMarkingAsWatched: $isMarkingAsWatched,
    isWatched: $isWatched,
    onWatch: markAsWatched,
  };
</script>

<BackgroundCoverImage src={media.cover.url} {type} />

<MediaSummaryContainer {contextualContent}>
  {#snippet poster()}
    <SummaryPoster src={media.poster.url} alt={media.title}>
      {#snippet actions()}
        <AvailableOn device={["desktop"]}>
          <WatchlistButton {...watchlistProps} />
          <MarkAsWatchedButton {...markWasWatchedProps} />
        </AvailableOn>
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <MediaSummaryInfo {media} {ratings} />

  <AvailableOn device={["mobile", "tablet"]}>
    <div class="trakt-media-action-container">
      <WatchlistActionButton {...watchlistProps} />
      <MarkAsWatchedActionButton {...markWasWatchedProps} />
    </div>
    <div class="trakt-media-action-spacer"></div>
  </AvailableOn>
</MediaSummaryContainer>

<style>
  .trakt-media-action-container {
    width: calc(100% - var(--ni-56) - var(--ni-16));
    height: var(--ni-96);
    padding-bottom: var(--ni-16);

    position: fixed;
    bottom: 0;

    display: flex;
    align-items: end;
    justify-content: end;
    gap: var(--ni-16);

    background: linear-gradient(
      180deg,
      transparent 0%,
      color-mix(in srgb, var(--color-background) 68%, transparent 32%) 29.5%,
      var(--color-background) 100%
    );
  }

  .trakt-media-action-spacer {
    padding: var(--ni-16);
    flex: 1;
  }
</style>
