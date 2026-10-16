<script lang="ts">
  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import DropSwipeIndicator from "$lib/sections/media-actions/drop/DropSwipeIndicator.svelte";
  import { useDrop } from "$lib/sections/media-actions/drop/useDrop";
  import MarkAsWatchedSwipeIndicator from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedSwipeIndicator.svelte";
  import {
    useMarkAsWatched,
    type MarkAsWatchedStoreProps,
  } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";

  type UpNextSwipeGestureProps = {
    target: MarkAsWatchedStoreProps;
    show: ShowEntry;
    indicatorHeight: string;
  } & ChildrenProps;

  const { target, show, indicatorHeight, children }: UpNextSwipeGestureProps =
    $props();

  const { markAsWatched } = $derived(useMarkAsWatched(target));

  const { drop } = $derived(
    useDrop({
      id: show.id,
      type: "show",
      title: show.title,
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
  --indicator-height={indicatorHeight}
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
