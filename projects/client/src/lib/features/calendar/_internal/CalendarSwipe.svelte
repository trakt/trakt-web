<script lang="ts">
  import type { SwipeDirection } from "$lib/components/gestures/models/SwipeDirection";
  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import CalendarSwipeIndicator from "./CalendarSwipeIndicator.svelte";

  const {
    children,
    onNextPeriod,
    onPreviousPeriod,
    directions = ["left", "right"],
  }: {
    onNextPeriod: () => void;
    onPreviousPeriod: () => void;
    directions?: SwipeDirection[];
  } & ChildrenProps = $props();
</script>

<SwipeX
  {children}
  {directions}
  classList="trakt-calendar-swiper"
  onSwipe={(state) => {
    if (state.direction === "left") {
      onNextPeriod();
    }

    if (state.direction === "right") {
      onPreviousPeriod();
    }
  }}
  --indicator-height="100%"
>
  {#snippet indicator({ direction })}
    <CalendarSwipeIndicator {direction} />
  {/snippet}
</SwipeX>
