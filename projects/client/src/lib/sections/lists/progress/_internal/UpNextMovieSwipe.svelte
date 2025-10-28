<script lang="ts">
  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry";
  import DropSwipeIndicator from "$lib/sections/media-actions/drop/DropSwipeIndicator.svelte";
  import { useDrop } from "$lib/sections/media-actions/drop/useDrop";
  import MarkAsWatchedSwipeIndicator from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedSwipeIndicator.svelte";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";

  type UpNextMovieSwipeProps = {
    movie: MovieEntry;
    playbackId: number;
    style: "cover" | "summary";
  } & ChildrenProps;

  const { movie, playbackId, style, children }: UpNextMovieSwipeProps =
    $props();

  const { markAsWatched } = $derived(
    useMarkAsWatched({
      type: "movie",
      media: movie,
    }),
  );

  const { drop } = $derived(
    useDrop({
      id: playbackId,
      type: "movie",
    }),
  );

  const { confirm } = useConfirm();
  const confirmDrop = $derived(
    confirm({
      type: ConfirmationType.DropMovie,
      title: movie.title,
      onConfirm: drop,
    }),
  );
</script>

{#if style === "summary"}
  <SwipeX
    {children}
    directions={["left", "right"]}
    classList="trakt-up-next-movie"
    onSwipe={(state) => {
      if (state.direction === "left") {
        drop();
        markAsWatched();
      }

      if (state.direction === "right") {
        confirmDrop();
      }
    }}
    --indicator-height="var(--height-summary-card-cover)"
  >
    {#snippet indicator({ isActive, direction })}
      {#if direction === "left"}
        <MarkAsWatchedSwipeIndicator {isActive} />
      {/if}

      {#if direction === "right"}
        <DropSwipeIndicator {isActive} />
      {/if}
    {/snippet}
  </SwipeX>
{:else}
  {@render children()}
{/if}
