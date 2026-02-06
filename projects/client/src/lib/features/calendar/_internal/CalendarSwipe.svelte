<script lang="ts">
  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import CalendarSwipeIndicator from "./CalendarSwipeIndicator.svelte";

  const {
    children,
    onNextPeriod,
    onPreviousPeriod,
  }: {
    onNextPeriod: () => void;
    onPreviousPeriod: () => void;
  } & ChildrenProps = $props();
</script>

<SwipeX
  {children}
  directions={["left", "right"]}
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
