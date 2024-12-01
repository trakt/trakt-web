<script lang="ts">
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import MarkAsWatchedActionButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedActionButton.svelte";
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import WatchlistActionButton from "$lib/components/buttons/watchlist/WatchlistActionButton.svelte";
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import AvailableOn from "$lib/components/responsive/AvailableOn.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import type { ShowSummary } from "$lib/requests/queries/movies/showSummaryQuery";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";
  import { useWatchlist } from "$lib/stores/useWatchlist";
  import MediaSummaryContainer from "./components/MediaSummaryContainer.svelte";
  import MediaSummaryInfo from "./components/MediaSummaryInfo.svelte";
  import type { MediaSummaryProps } from "./components/MediaSummaryProps";

  const { media: show, ratings }: MediaSummaryProps<ShowSummary> = $props();

  const type = "movie";

  const { markAsWatched, isMarkingAsWatched, isWatched } = useMarkAsWatched({
    type,
    id: show.id,
  });

  const {
    isWatchlistUpdating,
    isWatchlisted,
    addToWatchlist,
    removeFromWatchlist,
  } = useWatchlist({
    type,
    id: show.id,
  });
</script>

<BackgroundCoverImage src={show.cover.url} {type} />

<MediaSummaryContainer>
  {#snippet poster()}
    <SummaryPoster src={show.poster.url} alt={show.title}>
      {#snippet actions()}
        <AvailableOn device={["desktop"]}>
          <WatchlistButton
            title={show.title}
            isWatchlistUpdating={$isWatchlistUpdating}
            isWatchlisted={$isWatchlisted}
            onAdd={addToWatchlist}
            onRemove={removeFromWatchlist}
          />

          <MarkAsWatchedButton
            title={show.title}
            isMarkingAsWatched={$isMarkingAsWatched}
            isWatched={$isWatched}
            onWatch={markAsWatched}
          />
        </AvailableOn>
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <MediaSummaryInfo media={show} {ratings} />

  <AvailableOn device={["mobile", "tablet"]}>
    <div class="trakt-media-action-container">
      <WatchlistActionButton
        title={show.title}
        isWatchlistUpdating={$isWatchlistUpdating}
        isWatchlisted={$isWatchlisted}
        onAdd={addToWatchlist}
        onRemove={removeFromWatchlist}
      />

      <MarkAsWatchedActionButton
        title={show.title}
        isMarkingAsWatched={$isMarkingAsWatched}
        isWatched={$isWatched}
        onWatch={markAsWatched}
      />
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
