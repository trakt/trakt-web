<script lang="ts" generics="T extends { key: string }">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { useLazyLoader } from "$lib/sections/lists/drilldown/_internal/useLazyLoader";
  import CalendarItems from "./_internal/CalendarItems.svelte";
  import CalendarWeekItems from "./_internal/CalendarWeekItems.svelte";
  import { dateKey } from "./_internal/dateKey";
  import EmptyPeriod from "./_internal/EmptyPeriod.svelte";
  import ScrollSpy from "./_internal/ScrollSpy.svelte";
  import { getCalendarContext } from "./context/getCalendarContext";
  import type { CalendarLayoutProps } from "./models/CalendarLayoutProps";

  const {
    activeDate,
    isLoading,
    item,
    layout = "grid",
    order = "chronological",
    view = "day",
    periods,
    onLoadMore,
  }: CalendarLayoutProps<T> = $props();

  const { visibleDate } = getCalendarContext();

  const allDays = $derived(periods.flatMap((p) => p.calendar));

  function handleScrollSpyUpdate(id: string) {
    const entry = allDays.find((d) => dateKey(d.date) === id);
    if (!entry) return;
    visibleDate.next(entry.date);
  }

  const loadMore = () => {
    if (isLoading) return;
    onLoadMore();
  };

  const { observeDimension } = useLazyLoader({ loadMore, parent: null });

  const isInitialPeriod = $derived(periods.length <= 1);
  const isInitialLoad = $derived(isInitialPeriod && isLoading);
</script>

<div class="calendar-layout-container" use:observeDimension>
  {#if isInitialLoad}
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
        {#if view === "week"}
          <CalendarWeekItems calendar={period.calendar} {item} />
        {:else}
          <CalendarItems calendar={period.calendar} {order} {item} {layout}>
            {#snippet empty()}
              {#if !isLoading}
                <EmptyPeriod />
              {/if}
            {/snippet}
          </CalendarItems>
        {/if}
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

  .loading-wrapper {
    display: flex;
    justify-content: center;
    padding: var(--gap-l);
  }
</style>
