<script lang="ts">
  import type { MovieProgressEntry } from "$lib/requests/queries/sync/movieProgressQuery";
  import DefaultMediaItem from "../../components/DefaultMediaItem.svelte";

  const {
    movie,
    style,
  }: { movie: MovieProgressEntry; style: "cover" | "summary" } = $props();
</script>

<DefaultMediaItem
  type="movie"
  media={movie}
  variant="next"
  {style}
  progress={movie.progress ?? 0}
  minutesLeft={movie.minutesLeft}
/>
