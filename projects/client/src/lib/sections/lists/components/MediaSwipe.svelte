<script lang="ts">
  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import type { MediaInput } from "$lib/models/MediaInput";
  import MarkAsWatchedSwipeIndicator from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedSwipeIndicator.svelte";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";
  import { useWatchlist } from "$lib/sections/media-actions/watchlist/useWatchlist";
  import WatchlistIndicator from "$lib/sections/media-actions/watchlist/WatchlistIndicator.svelte";

  type MediaSwipeProps = MediaInput &
    ChildrenProps & {
      style?: "cover" | "summary";
      title: string;
    };

  const { type, media, style, children, title }: MediaSwipeProps = $props();

  if (type === "episode") {
    throw new Error("MediaSwipe does not support episode type");
  }

  const target = $derived({ type, media });

  const { markAsWatched } = $derived(useMarkAsWatched({ ...target, title }));

  const { addToWatchlist, isWatchlisted } = $derived(
    useWatchlist({
      type,
      media,
      title,
    }),
  );
</script>

{#if style === "summary"}
  <SwipeX
    {children}
    directions={["left", "right"]}
    classList="trakt-up-next-episode"
    onSwipe={(state) => {
      if (state.direction === "left") {
        markAsWatched();
      }

      if (state.direction === "right") {
        addToWatchlist();
      }
    }}
    --indicator-height="var(--height-summary-card-cover)"
  >
    {#snippet indicator({ isActive, direction })}
      {#if direction === "left"}
        <MarkAsWatchedSwipeIndicator {isActive} />
      {/if}

      {#if direction === "right"}
        <WatchlistIndicator {isActive} isWatchlisted={$isWatchlisted} />
      {/if}
    {/snippet}
  </SwipeX>
{:else}
  {@render children()}
{/if}
