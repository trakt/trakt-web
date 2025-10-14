<script lang="ts">
  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import type { MediaInput } from "$lib/models/MediaInput";
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

  const { confirm } = useConfirm();
  const confirmMarkAsWatched = $derived(
    confirm({
      type: ConfirmationType.MarkAsWatched,
      title: media.title,
      target,
      onConfirm: markAsWatched,
    }),
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
        confirmMarkAsWatched();
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
