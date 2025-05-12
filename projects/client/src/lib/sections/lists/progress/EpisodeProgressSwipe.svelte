<script lang="ts">
  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import type { EpisodeProgressEntry } from "$lib/requests/models/EpisodeProgressEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import MarkAsWatchedSwipeIndicator from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedSwipeIndicator.svelte";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";

  type UpNextEpisodeProps = {
    episode: EpisodeProgressEntry;
    show: ShowEntry;
    style: "cover" | "summary";
  } & ChildrenProps;

  const { episode, show, style, children }: UpNextEpisodeProps = $props();

  const { markAsWatched } = $derived(
    useMarkAsWatched({
      type: "episode",
      media: [episode],
      show: show,
      episode: episode,
    }),
  );
</script>

{#if style === "summary"}
  <SwipeX
    {children}
    directions={["left"]}
    classList="trakt-up-next-episode"
    onSwipe={markAsWatched}
    --indicator-height="var(--height-summary-card-cover)"
  >
    {#snippet indicator({ isActive })}
      <MarkAsWatchedSwipeIndicator {isActive} />
    {/snippet}
  </SwipeX>
{:else}
  {@render children()}
{/if}
