<script lang="ts">
  import type { MediaStats } from "$lib/models/MediaStats";
  import type { MovieSummary } from "$lib/requests/models/MovieSummary";
  import MediaSummary from "./components/MediaSummary.svelte";
  import type { MediaSummaryProps } from "./components/MediaSummaryProps";

  const {
    media,
    ratings,
    stats,
    intl,
  }: MediaSummaryProps<MovieSummary> & { stats: MediaStats } = $props();
</script>

<MediaSummary {media} {ratings} {stats} {intl} type="movie" />
