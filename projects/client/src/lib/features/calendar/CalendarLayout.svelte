<script lang="ts" generics="T extends { key: string }">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { trackElementBottom } from "$lib/utils/actions/trackElementBottom";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";
  import CalendarDays from "./_internal/CalendarDays.svelte";
  import CalendarHeader from "./_internal/CalendarHeader.svelte";
  import CalendarItems from "./_internal/CalendarItems.svelte";
  import { dateKey } from "./_internal/dateKey";
  import ScrollSpy from "./_internal/ScrollSpy.svelte";
  import type { CalendarLayoutProps } from "./models/CalendarLayoutProps";

  const {
    calendar,
    activeDate,
    isLoading,
    onNext,
    onPrevious,
    onReset,
    item,
    layout = "grid",
  }: CalendarLayoutProps<T> = $props();

  let activeScrollDate = $state<Date | null>(null);

  function handleScrollSpyUpdate(id: string) {
    const entry = calendar.find((d) => dateKey(d.date) === id);
    if (entry) {
      activeScrollDate = entry.date;
    }
  }

  const displayActiveDate = $derived(activeScrollDate ?? activeDate);
</script>

<div class="calendar-layout-container">
  <div
    class="calendar-navigation"
    use:trackWindowScroll={"is-scrolled"}
    use:trackElementBottom={"--calendar-nav-bottom"}
  >
    <CalendarHeader
      {onNext}
      {onPrevious}
      {onReset}
      activeDate={displayActiveDate}
    />
    <CalendarDays
      {calendar}
      {onNext}
      {onPrevious}
      activeDate={displayActiveDate}
    />
  </div>

  {#if isLoading}
    <div class="loading-wrapper">
      <LoadingIndicator />
    </div>
  {:else}
    <ScrollSpy
      selector=".calendar-day-anchor"
      initialId={dateKey(activeDate)}
      onUpdate={handleScrollSpyUpdate}
    >
      <CalendarItems {calendar} {item} {layout} />
    </ScrollSpy>
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
