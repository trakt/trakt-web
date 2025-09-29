<script lang="ts">
  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import type { MediaInput } from "$lib/models/MediaInput";
  import { attachWarning } from "$lib/sections/media-actions/_internal/attachWarning";
  import { getWarningMessage } from "$lib/sections/media-actions/mark-as-watched/_internal/getWarningMessage";
  import MarkAsWatchedSwipeIndicator from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedSwipeIndicator.svelte";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";
  import { useWatchlist } from "$lib/sections/media-actions/watchlist/useWatchlist";
  import WatchlistIndicator from "$lib/sections/media-actions/watchlist/WatchlistIndicator.svelte";

  type MediaSwipeProps = MediaInput &
    ChildrenProps & {
      style?: "cover" | "summary";
    };

  const { type, media, style, children }: MediaSwipeProps = $props();

  if (type === "episode") {
    throw new Error("MediaSwipe does not support episode type");
  }

  const target = $derived({ type, media });

  const { markAsWatched } = $derived(useMarkAsWatched(target));

  const warningMessage = $derived(getWarningMessage(media.title, target));

  /**
   * TODO: @seferturan Single source of truth for warning messages
   */
  const onWatchHandler = $derived(
    warningMessage
      ? attachWarning(markAsWatched, warningMessage)
      : markAsWatched,
  );

  const { addToWatchlist, isWatchlisted } = $derived(
    useWatchlist({
      type,
      media,
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
        onWatchHandler();
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
