<script lang="ts">
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import type { MovieSummary } from "$lib/requests/queries/movies/movieSummaryQuery";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";
  import { useWatchlist } from "$lib/stores/useWatchlist";
  import MediaSummaryContainer from "./components/MediaSummaryContainer.svelte";
  import MediaSummaryInfo from "./components/MediaSummaryInfo.svelte";
  import type { MediaSummaryProps } from "./components/MediaSummaryProps";

  const { media: movie, ratings }: MediaSummaryProps<MovieSummary> = $props();

  const type = "movie";

  const { markAsWatched, isMarkingAsWatched, isWatched } = useMarkAsWatched({
    type,
    id: movie.id,
  });

  const {
    isWatchlistUpdating,
    isWatchlisted,
    addToWatchlist,
    removeFromWatchlist,
  } = useWatchlist({
    type,
    id: movie.id,
  });
</script>

<BackgroundCoverImage src={movie.cover.url} {type} />

<MediaSummaryContainer>
  {#snippet poster()}
    <SummaryPoster src={movie.poster.url} alt={movie.title}>
      {#snippet actions()}
        <WatchlistButton
          title={movie.title}
          isWatchlistUpdating={$isWatchlistUpdating}
          isWatchlisted={$isWatchlisted}
          onAdd={addToWatchlist}
          onRemove={removeFromWatchlist}
        />

        <MarkAsWatchedButton
          title={movie.title}
          isMarkingAsWatched={$isMarkingAsWatched}
          isWatched={$isWatched}
          onWatch={markAsWatched}
        />
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <MediaSummaryInfo media={movie} {ratings} />
</MediaSummaryContainer>
