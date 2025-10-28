<script lang="ts">
  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry";
  import MarkAsWatchedSwipeIndicator from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedSwipeIndicator.svelte";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";
  import { useWatchlist } from "$lib/sections/media-actions/watchlist/useWatchlist";
  import WatchlistSwipeIndicator from "$lib/sections/media-actions/watchlist/WatchlistSwipeIndicator.svelte";

  type StartWatchingMovieProps = {
    media: MovieEntry;
    style: "cover" | "summary";
  } & ChildrenProps;

  const { media, style, children }: StartWatchingMovieProps = $props();

  const { markAsWatched } = $derived(
    useMarkAsWatched({
      type: "movie",
      media,
    }),
  );

  const { removeFromWatchlist } = $derived(
    useWatchlist({ type: "movie", media }),
  );

  const { confirm } = useConfirm();
  const confirmRemove = $derived(
    confirm({
      type: ConfirmationType.RemoveFromWatchList,
      title: media.title,
      onConfirm: removeFromWatchlist,
    }),
  );
</script>

{#if style === "summary"}
  <SwipeX
    {children}
    directions={["left", "right"]}
    classList="trakt-start-watching-movie"
    onSwipe={(state) => {
      if (state.direction === "left") {
        markAsWatched();
      }

      if (state.direction === "right") {
        confirmRemove();
      }
    }}
    --indicator-height="var(--height-summary-card-cover)"
  >
    {#snippet indicator({ isActive, direction })}
      {#if direction === "left"}
        <MarkAsWatchedSwipeIndicator {isActive} />
      {/if}

      {#if direction === "right"}
        <WatchlistSwipeIndicator {isActive} />
      {/if}
    {/snippet}
  </SwipeX>
{:else}
  {@render children()}
{/if}
