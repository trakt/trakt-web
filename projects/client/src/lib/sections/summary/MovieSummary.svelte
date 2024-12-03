<script lang="ts">
  import type { ShowSummary } from "$lib/requests/queries/shows/showSummaryQuery";
  import MediaSummary from "./components/MediaSummary.svelte";
  import type { MediaSummaryProps } from "./components/MediaSummaryProps";

  const { media, ratings, intl }: MediaSummaryProps<ShowSummary> = $props();
</script>

<MediaSummary {media} {ratings} {intl} type="movie" />
