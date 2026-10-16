<script lang="ts">
  import { useLargeScreenCards } from "$lib/features/large-screen-cards/useLargeScreenCards.ts";
  import { hasSwipeGesture } from "$lib/sections/lists/utils/hasSwipeGesture.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { swipeIndicatorHeight } from "$lib/sections/lists/utils/swipeIndicatorHeight.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import type { MarkAsWatchedStoreProps } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";
  import UpNextSwipeGesture from "./UpNextSwipeGesture.svelte";

  type UpNextEpisodeProps = {
    target: MarkAsWatchedStoreProps;
    show: ShowEntry;
    style: "cover" | "summary";
  } & ChildrenProps;

  const { target, show, style, children }: UpNextEpisodeProps = $props();

  const isLargeScreenCards = useLargeScreenCards();
  const isMouse = useMedia(WellKnownMediaQuery.mouse);

  const hasSwipe = $derived(
    hasSwipeGesture({
      style,
      isLargeScreenCards: $isLargeScreenCards,
      isMouse: $isMouse,
    }),
  );
</script>

{#if hasSwipe}
  <UpNextSwipeGesture
    {target}
    {show}
    {children}
    indicatorHeight={swipeIndicatorHeight($isLargeScreenCards)}
  />
{:else}
  {@render children()}
{/if}
