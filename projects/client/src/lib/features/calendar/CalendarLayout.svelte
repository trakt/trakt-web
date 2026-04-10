<script lang="ts" generics="T extends { key: string }">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { useLazyLoader } from "$lib/sections/lists/drilldown/_internal/useLazyLoader";
  import { trackElementBottom } from "$lib/utils/actions/trackElementBottom";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";
  import CalendarDays from "./_internal/CalendarDays.svelte";
  import CalendarHeader from "./_internal/CalendarHeader.svelte";
  import CalendarItems from "./_internal/CalendarItems.svelte";
  import { dateKey } from "./_internal/dateKey";
  import EmptyPeriod from "./_internal/EmptyPeriod.svelte";
  import ScrollSpy from "./_internal/ScrollSpy.svelte";
  import { getCalendarContext } from "./context/getCalendarContext";
  import type { CalendarLayoutProps } from "./models/CalendarLayoutProps";

  const {
    activeDate,
    isLoading,
    onNext,
    onPrevious,
    onReset,
    item,
    layout = "grid",
    maxDate,
    order = "chronological",
    periods,
    onLoadMore,
  }: CalendarLayoutProps<T> = $props();

  const { visibleDate } = getCalendarContext();

  let activeScrollDate = $state<Date | null>(null);

  const allDays = $derived(periods.flatMap((p) => p.calendar));

  function handleScrollSpyUpdate(id: string) {
    const entry = allDays.find((d) => dateKey(d.date) === id);
    if (!entry) return;
    activeScrollDate = entry.date;
    visibleDate.next(entry.date);
  }

  function handleNavigation(action: () => void) {
    activeScrollDate = null;
    action();
    document
      .getElementById(dateKey(activeDate))
      ?.scrollIntoView({ block: "start" });
  }

  function handleNext() {
    handleNavigation(onNext);
  }

  function handlePrevious() {
    handleNavigation(onPrevious);
  }

  function handleReset() {
    handleNavigation(onReset);
  }

  const visiblePeriodCalendar = $derived.by(() => {
    const firstPeriod = periods.at(0)?.calendar ?? [];
    if (!activeScrollDate) return firstPeriod;

    const scrollKey = dateKey(activeScrollDate);
    const match = periods.find((p) =>
      p.calendar.some((d) => dateKey(d.date) === scrollKey),
    );

    return match?.calendar ?? firstPeriod;
  });

  const selectedDate = $derived(activeScrollDate ?? activeDate);

  const loadMore = () => {
    if (isLoading) return;
    onLoadMore();
  };

  const { observeDimension } = useLazyLoader({ loadMore, parent: null });

  const isInitialPeriod = $derived(periods.length <= 1);
</script>

<div class="calendar-layout-container" use:observeDimension>
  <div
    class="calendar-navigation"
    use:trackWindowScroll={"is-scrolled"}
    use:trackElementBottom={"--calendar-nav-bottom"}
  >
    <CalendarHeader
      onNext={handleNext}
      onPrevious={handlePrevious}
      onReset={handleReset}
      {maxDate}
      activeDate={selectedDate}
    />
    <CalendarDays
      calendar={visiblePeriodCalendar}
      onNext={handleNext}
      onPrevious={handlePrevious}
      {maxDate}
      activeDate={selectedDate}
    />
  </div>

  {#if isLoading && isInitialPeriod}
    <div class="loading-wrapper">
      <LoadingIndicator />
    </div>
  {:else}
    <ScrollSpy
      selector=".calendar-day-anchor"
      initialId={dateKey(activeDate)}
      onUpdate={handleScrollSpyUpdate}
    >
      {#each periods as period (period.key)}
        <CalendarItems calendar={period.calendar} {order} {item} {layout}>
          {#snippet empty()}
            {#if !isLoading}
              <EmptyPeriod />
            {/if}
          {/snippet}
        </CalendarItems>
      {/each}
    </ScrollSpy>

    {#if isLoading}
      <div class="loading-wrapper">
        <LoadingIndicator />
      </div>
    {/if}
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .calendar-layout-container {
    display: flex;
    flex-direction: column;

    gap: var(--gap-s);

    margin-left: var(--layout-distance-side);
    margin-right: var(--layout-distance-side);

    flex-grow: 1;
  }

  .calendar-navigation {
    --sticky-top: calc(env(safe-area-inset-top, 0) + var(--gap-m));

    box-shadow: var(--shadow-raised);

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

  .loading-wrapper {
    display: flex;
    justify-content: center;
    padding: var(--gap-l);
  }
</style>
