<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeProgressEntry } from "$lib/models/EpisodeProgressEntry";
  import type { MediaStats } from "$lib/models/MediaStats";
  import type { ShowSummary } from "$lib/requests/models/ShowSummary";
  import NextEpisodeItem from "$lib/sections/lists/components/NextEpisodeItem.svelte";
  import MediaSummary from "./components/MediaSummary.svelte";
  import type { MediaSummaryProps } from "./components/MediaSummaryProps";

  type ShowSummaryProps = MediaSummaryProps<ShowSummary> & {
    progress?: EpisodeProgressEntry;
    stats: MediaStats;
  };

  const { media, ratings, stats, intl, progress }: ShowSummaryProps = $props();
</script>

{#snippet contextualContent()}
  <RenderFor device={["desktop"]} audience="authenticated">
    {#if progress}
      <NextEpisodeItem episode={progress} show={media} />
    {/if}
  </RenderFor>
{/snippet}

<MediaSummary
  {media}
  {ratings}
  {stats}
  {intl}
  type="show"
  {contextualContent}
/>
