<script lang="ts">
  import type { MovieSummary } from "$lib/requests/models/MovieSummary";
  import MediaSummary from "./components/MediaSummary.svelte";
  import type { MediaSummaryProps } from "./components/MediaSummaryProps";

  const { media, ratings, intl }: MediaSummaryProps<MovieSummary> = $props();
</script>

<MediaSummary {media} {ratings} {intl} type="movie" />
