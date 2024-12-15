<script lang="ts">
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import MarkAsWatchedActionButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedActionButton.svelte";
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import type { MarkAsWatchedButtonProps } from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonProps";
  import WatchlistActionButton from "$lib/components/buttons/watchlist/WatchlistActionButton.svelte";
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import type { WatchlistButtonProps } from "$lib/components/buttons/watchlist/WatchlistButtonProps";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
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
    intl,
    contextualContent,
  }: MediaSummaryProps<MediaSummary> & {
    type: MediaType;
    contextualContent?: Snippet;
  } = $props();

  const { markAsWatched, isMarkingAsWatched, isWatched } = $derived(
    useMarkAsWatched({
      type,
      id: media.id,
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
      id: media.id,
    }),
  );

  const watchlistProps: WatchlistButtonProps = $derived({
    title: intl.title,
    isWatchlistUpdating: $isWatchlistUpdating,
    isWatchlisted: $isWatchlisted,
    onAdd: addToWatchlist,
    onRemove: removeFromWatchlist,
  });

  const markWasWatchedProps: MarkAsWatchedButtonProps = $derived({
    title: intl.title,
    isMarkingAsWatched: $isMarkingAsWatched,
    isWatched: $isWatched,
    onWatch: markAsWatched,
  });
</script>

<BackgroundCoverImage src={media.cover.url.medium} {type} />

<MediaSummaryContainer {contextualContent}>
  {#snippet poster()}
    <SummaryPoster src={media.poster.url.medium} alt={intl.title}>
      {#snippet actions()}
        <RenderFor device={["tablet-lg", "desktop"]} audience="authenticated">
          <WatchlistButton {...watchlistProps} />
          <MarkAsWatchedButton {...markWasWatchedProps} />
        </RenderFor>
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <MediaSummaryInfo {media} {ratings} {intl} />

  <RenderFor device={["mobile", "tablet-sm"]} audience="authenticated">
    <div class="trakt-media-action-container">
      <WatchlistActionButton {...watchlistProps} />
      <MarkAsWatchedActionButton {...markWasWatchedProps} />
    </div>
    <div class="trakt-media-action-spacer"></div>
  </RenderFor>
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

    @media (max-width: 480px) {
      bottom: var(--ni-72);
    }
  }

  .trakt-media-action-spacer {
    padding: var(--ni-16);
    flex: 1;
  }
</style>
