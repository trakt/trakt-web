<script lang="ts">
  import { useLargeScreenCards } from "$lib/features/large-screen-cards/useLargeScreenCards.ts";
  import { hasSwipeGesture } from "$lib/sections/lists/utils/hasSwipeGesture.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { swipeIndicatorHeight } from "$lib/sections/lists/utils/swipeIndicatorHeight.ts";
  import type { BaseMediaInput } from "$lib/models/MediaInput";
  import MediaSwipeGesture from "./MediaSwipeGesture.svelte";

  type MediaSwipeProps = BaseMediaInput &
    ChildrenProps & {
      style?: "cover" | "summary" | "compact" | "minimal";
    };

  const { type, media, style, children }: MediaSwipeProps = $props();

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
  <MediaSwipeGesture
    {type}
    {media}
    {children}
    indicatorHeight={swipeIndicatorHeight($isLargeScreenCards)}
  />
{:else}
  {@render children()}
{/if}
