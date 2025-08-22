<script lang="ts">
  import LoadingIndicator from "$lib/sections/lists/drilldown/_internal/LoadingIndicator.svelte";
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";
  import CalendarDays from "./_internal/CalendarDays.svelte";
  import CalendarHeader from "./_internal/CalendarHeader.svelte";
  import CalendarItems from "./_internal/CalendarItems.svelte";
  import { useCalendar } from "./_internal/useCalendar";
  import { useCalendarPeriod } from "./context/useCalendarPeriod";

  const { startDate, days } = useCalendarPeriod();

  const { isLoading, calendar } = $derived(
    useCalendar({ start: $startDate, days }),
  );

  const { observedDimension, observeDimension } =
    useDimensionObserver("bottom");
</script>

<trakt-calendar>
  <div
    class="calendar-navigation"
    use:observeDimension
    use:trackWindowScroll={"is-scrolled"}
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

    @include backdrop-filter-blur(var(--ni-8));

    @include for-mobile {
      --sticky-top: calc(env(safe-area-inset-top, 0) + var(--ni-4));
      transition: gap var(--transition-increment) ease-in-out;

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
</style>
