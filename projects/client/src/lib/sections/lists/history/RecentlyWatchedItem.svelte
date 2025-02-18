<script lang="ts">
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
  <MediaCard type={media.type} media={media.movie} {style} />
{/if}
