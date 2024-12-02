<script lang="ts">
  import AvailableOn from "$lib/components/responsive/AvailableOn.svelte";
  import type { EpisodeProgressEntry } from "$lib/models/EpisodeProgressEntry";
  import type { ShowSummary } from "$lib/requests/queries/shows/showSummaryQuery";
  import EpisodeProgressItem from "../up-next/EpisodeProgressItem.svelte";
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
  <AvailableOn device={["desktop"]}>
    {#if progress}
      <EpisodeProgressItem episode={progress} show={media} {onMarkAsWatched} />
    {/if}
  </AvailableOn>
{/snippet}

<MediaSummary {media} {ratings} type="show" {contextualContent} />
