<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { useStoredFilters } from "$lib/features/filters/useStoredFilters.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import FilterTabs from "$lib/sections/navbar/components/filter/FilterTabs.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import CalendarDays from "./_internal/CalendarDays.svelte";
  import CalendarHeader from "./_internal/CalendarHeader.svelte";
  import type { Calendar } from "./models/Calendar.ts";
  import type { CalendarNavigationProps } from "./models/CalendarNavigationProps.ts";

  const {
    activeDate,
    calendar,
    maxDate,
    navigation,
    onClose,
  }: {
    activeDate: Date;
    calendar: Calendar<unknown>;
    maxDate?: Date;
    navigation?: CalendarNavigationProps["navigation"];
    onClose: () => void;
  } = $props();

  const { activeMode, setActiveMode } = useStoredFilters();
  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isSmallTablet = useMedia(WellKnownMediaQuery.tabletSmall);
  const tabPosition = $derived.by(() =>
    $isMobile || $isSmallTablet ? "bottom" : "top",
  );
</script>

{#snippet badge()}
  <div class="trakt-calendar-drawer-badge">
    <DiscoverToggles />
  </div>
{/snippet}

<Drawer
  {onClose}
  title={m.header_calendar()}
  size="auto"
  hasAutoClose={false}
  classList="trakt-calendar-drawer"
  {badge}
>
  <div class="trakt-calendar-drawer-content">
    <div class="trakt-calendar-drawer-navigation">
      <CalendarHeader {navigation} {activeDate} {maxDate} />
      <CalendarDays {calendar} {navigation} {activeDate} {maxDate} />
    </div>
    <div class="trakt-calendar-drawer-filters">
      <FilterTabs
        activeMode={$activeMode}
        {setActiveMode}
        {tabPosition}
        useAdvancedSimpleFilters={true}
      />
    </div>
  </div>
</Drawer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-calendar-drawer {
    :global(.trakt-drawer-content) {
      display: flex;
      flex-direction: column;
      gap: var(--gap-l);
    }
  }

  .trakt-calendar-drawer-badge {
    display: flex;
    justify-content: flex-end;
  }

  .trakt-calendar-drawer-navigation {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    padding-bottom: var(--gap-s);
    border-bottom: var(--ni-1) solid var(--color-drawer-border);
  }

  .trakt-calendar-drawer-filters {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

  @include for-mobile {
    .trakt-calendar-drawer-navigation {
      padding-bottom: var(--gap-m);
    }
  }
</style>
