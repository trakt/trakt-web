<script lang="ts">
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
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
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <MediaSummaryInfo media={show} {ratings} />
</MediaSummaryContainer>
