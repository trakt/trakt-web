<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeProgressEntry } from "$lib/models/EpisodeProgressEntry";
  import type { ShowSummary } from "$lib/requests/queries/shows/showSummaryQuery";
  import NextEpisodeItem from "../up-next/NextEpisodeItem.svelte";
  import MediaSummary from "./components/MediaSummary.svelte";
  import type { MediaSummaryProps } from "./components/MediaSummaryProps";

  type ShowSummaryProps = MediaSummaryProps<ShowSummary> & {
    progress?: EpisodeProgressEntry;
    onMarkAsWatched: () => void;
  };

  const { media, ratings, progress, onMarkAsWatched }: ShowSummaryProps =
    $props();
</script>

{#snippet contextualContent()}
  <RenderFor device={["desktop"]}>
    {#if progress}
      <NextEpisodeItem episode={progress} show={media} {onMarkAsWatched} />
    {/if}
  </RenderFor>
{/snippet}

<MediaSummary {media} {ratings} type="show" {contextualContent} />
