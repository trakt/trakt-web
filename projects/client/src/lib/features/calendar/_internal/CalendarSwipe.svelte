<script lang="ts">
  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import { useCalendarPeriod } from "../context/useCalendarPeriod";
  import CalendarSwipeIndicator from "./CalendarSwipeIndicator.svelte";

  const { children }: ChildrenProps = $props();

  const { next, previous } = useCalendarPeriod();
</script>

<SwipeX
  {children}
  directions={["left", "right"]}
  classList="trakt-calendar-swiper"
  onSwipe={(state) => {
    if (state.direction === "left") {
      next();
    }

    if (state.direction === "right") {
      previous();
    }
  }}
  --indicator-height="100%"
>
  {#snippet indicator({ direction })}
    <CalendarSwipeIndicator {direction} />
  {/snippet}
</SwipeX>
