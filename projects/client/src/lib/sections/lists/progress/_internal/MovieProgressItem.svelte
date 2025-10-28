<script lang="ts">
  import type { MovieProgressEntry } from "$lib/requests/queries/sync/movieProgressQuery";
  import DropAction from "$lib/sections/media-actions/drop/DropAction.svelte";
  import MediaItem from "../../components/MediaItem.svelte";
  import MarkAsCompletedAction from "./MarkAsCompletedAction.svelte";
  import UpNextMovieSwipe from "./UpNextMovieSwipe.svelte";

  const {
    movie,
    playbackId,
    style,
  }: {
    movie: MovieProgressEntry;
    playbackId: number;
    style: "cover" | "summary";
  } = $props();
</script>

{#snippet action()}
  <MarkAsCompletedAction
    style="action"
    size="small"
    media={movie}
    {playbackId}
  />
{/snippet}

{#snippet popupActions()}
  <MarkAsCompletedAction style="dropdown-item" media={movie} {playbackId} />

  <DropAction
    style="dropdown-item"
    title={movie.title}
    id={playbackId}
    type="movie"
  />
{/snippet}

<UpNextMovieSwipe {movie} {style} {playbackId}>
  <MediaItem
    type="movie"
    media={movie}
    variant="next"
    {style}
    {action}
    {popupActions}
    progress={movie.progress ?? 0}
    minutesLeft={movie.minutesLeft}
  />
</UpNextMovieSwipe>
