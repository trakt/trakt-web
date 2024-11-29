<script lang="ts">
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import * as m from "$lib/features/i18n/messages";
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

  const { isAddingToWatchlist, watchlist, isWatchlisted } = useWatchlist({
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
          isAddingToWatchlist={$isAddingToWatchlist}
          isWatchlisted={$isWatchlisted}
          onAdd={() => watchlist()}
          onRemove={() => alert("TODO: Implement remove from watchlist")}
        />

        <Button
          label={m.mark_as_watched_label({ title: movie.title })}
          variant="custom"
          onclick={() => markAsWatched()}
          disabled={$isMarkingAsWatched || $isWatched}
          --color-background-button="var(--purple-100)"
          --color-foreground-button="var(--purple-600)"
        >
          {m.mark_as_watched()}
          {#snippet icon()}
            <CheckIcon size="small" />
          {/snippet}
        </Button>
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <MediaSummaryInfo media={movie} {ratings} />
</MediaSummaryContainer>
