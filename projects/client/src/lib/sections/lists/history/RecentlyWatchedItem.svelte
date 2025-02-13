<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MarkAsWatchedAction from "../../media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import EpisodeCard from "../components/EpisodeCard.svelte";
  import MediaCard from "../components/MediaCard.svelte";
  import type { HistoryEntry } from "../stores/useRecentlyWatchedList";

  type RecentlyWatchedItemProps = {
    media: HistoryEntry;
    style?: "summary" | "cover";
  };

  const { media, style = "cover" }: RecentlyWatchedItemProps = $props();
</script>

{#if media.type === "episode"}
  <EpisodeCard
    episode={media.episode}
    show={media.show}
    {style}
    context="standalone"
    variant="default"
  />
{/if}

{#if media.type === "movie"}
  <MediaCard type={media.type} media={media.movie} {style}>
    {#snippet action()}
      <RenderFor audience="authenticated">
        <MarkAsWatchedAction
          style="action"
          title={media.movie.title}
          type={media.type}
          media={media.movie}
        />
      </RenderFor>
    {/snippet}
  </MediaCard>
{/if}
