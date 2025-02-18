<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
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
    date={media.watchedAt}
    variant="activity"
    {style}
  >
    {#snippet popupActions()}
      <RenderFor audience="authenticated">
        <MarkAsWatchedAction
          style="dropdown-item"
          type="episode"
          title={media.episode.title}
          show={media.show}
          episode={media.episode}
          media={media.episode}
        />
      </RenderFor>
    {/snippet}
  </EpisodeCard>
{/if}

{#if media.type === "movie"}
  <MediaCard
    type={media.type}
    media={media.movie}
    {style}
    date={media.watchedAt}
    variant="activity"
  />
{/if}
