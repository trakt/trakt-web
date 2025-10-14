<script lang="ts">
  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import type { EpisodeProgressEntry } from "$lib/requests/models/EpisodeProgressEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import DropSwipeIndicator from "$lib/sections/media-actions/drop/DropSwipeIndicator.svelte";
  import { useDrop } from "$lib/sections/media-actions/drop/useDrop";
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
      media: episode,
      show: show,
    }),
  );

  const { drop } = $derived(
    useDrop({
      ids: [show.id],
    }),
  );

  const { confirm } = useConfirm();
  const confirmDrop = $derived(
    confirm({
      type: ConfirmationType.DropShow,
      title: show.title,
      onConfirm: drop,
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
