<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeProgressEntry } from "$lib/models/EpisodeProgressEntry";
  import type { MediaStats } from "$lib/models/MediaStats";
  import type { ShowSummary } from "$lib/requests/models/ShowSummary";
  import NextEpisodeItem from "$lib/sections/lists/components/NextEpisodeItem.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import MediaSummary from "./components/MediaSummary.svelte";
  import type { MediaSummaryProps } from "./components/MediaSummaryProps";

  type ShowSummaryProps = MediaSummaryProps<ShowSummary> & {
    progress?: EpisodeProgressEntry;
    stats: MediaStats;
  };

  const { media, ratings, stats, watchers, intl, progress }: ShowSummaryProps =
    $props();
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
  {watchers}
  {intl}
  type="show"
  {contextualContent}
/>

<RelatedList title={m.related_shows_title()} slug={media.slug} type="show" />
