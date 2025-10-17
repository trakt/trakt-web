<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import LoadingIndicator from "$lib/sections/lists/drilldown/_internal/LoadingIndicator.svelte";
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";
  import { trackWindowScrollDirection } from "$lib/utils/actions/trackWindowScrollDirection";
  import { FeatureFlag } from "../feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "../feature-flag/useFeatureFlag";
  import CalendarDays from "./_internal/CalendarDays.svelte";
  import CalendarHeader from "./_internal/CalendarHeader.svelte";
  import CalendarItems from "./_internal/CalendarItems.svelte";
  import { useCalendar } from "./_internal/useCalendar";
  import { useCalendarPeriod } from "./context/useCalendarPeriod";

  const { startDate, days } = useCalendarPeriod();
  const { mode } = useDiscover();
  const { isEnabled } = $derived(useFeatureFlag(FeatureFlag.Discover));

  const { isLoading, calendar } = $derived(
    useCalendar({
      start: $startDate,
      days,
      type: $isEnabled ? $mode : undefined,
    }),
  );

  const { observedDimension, observeDimension } =
    useDimensionObserver("bottom");
</script>

<trakt-calendar>
  <div
    class="calendar-navigation"
    use:observeDimension
    use:trackWindowScroll={"is-scrolled"}
    use:trackWindowScrollDirection={{
      upClassName: "trakt-calendar-scroll-up",
      downClassName: "trakt-calendar-scroll-down",
      offsetVar: "var(--navbar-height)",
    }}
  >
    <CalendarHeader />
    <CalendarDays calendar={$calendar} />
  </div>

  {#if $isLoading}
    <LoadingIndicator />
  {:else}
    <CalendarItems calendar={$calendar} safeAreaOffset={$observedDimension} />
  {/if}
</trakt-calendar>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-calendar {
    display: flex;
    flex-direction: column;

    gap: var(--gap-s);

    margin-left: var(--layout-distance-side);
    margin-right: var(--layout-distance-side);
  }

  .calendar-navigation {
    --sticky-top: calc(env(safe-area-inset-top, 0) + var(--gap-m));

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    overflow: hidden;

    max-width: var(--ni-480);

    padding: var(--ni-10);
    border-radius: var(--border-radius-m);

    position: sticky;
    top: var(--sticky-top);
    z-index: var(--layer-overlay);

    background-color: var(--color-calendar-background);

    transition: var(--transition-increment) ease-in-out;
    transition-property: gap, top;

    backdrop-filter: blur(var(--ni-8));

    @include for-mobile {
      --sticky-top: calc(env(safe-area-inset-top, 0) + var(--ni-4));

      :global(.calendar-header) {
        transition: height var(--transition-increment) ease-in-out;
      }

      &:global(.is-scrolled) {
        gap: var(--ni-0);

        :global(.calendar-header) {
          height: var(--ni-0);
        }
      }
    }

    @include for-tablet-sm-and-below {
      top: calc(var(--navbar-height) + var(--sticky-top));
    }
  }

  .calendar-navigation {
    &:global(.trakt-calendar-scroll-down) {
      @include for-tablet-sm-and-below {
        top: var(--sticky-top);
      }
    }
  }
</style>
