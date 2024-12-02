<script lang="ts">
  import type { ShowSummary } from "$lib/requests/queries/movies/showSummaryQuery";
  import MediaSummary from "./components/MediaSummary.svelte";
  import type { MediaSummaryProps } from "./components/MediaSummaryProps";

  const { media, ratings }: MediaSummaryProps<ShowSummary> = $props();
</script>

<MediaSummary {media} {ratings} type="show" />
