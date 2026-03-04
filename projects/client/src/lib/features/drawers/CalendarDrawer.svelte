<script lang="ts">
  import { page } from "$app/state";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import {
    drawerNavigation,
    Drawers,
  } from "$lib/features/drawers/drawerNavigation";
  import * as m from "$lib/features/i18n/messages";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import ActivityPaginatedList from "$lib/sections/lists/activity/ActivityPaginatedList.svelte";
  import PersonalHistoryPaginatedList from "$lib/sections/lists/history/PersonalHistoryPaginatedList.svelte";
  import Calendar from "../calendar/Calendar.svelte";
  import CalendarProvider from "../calendar/CalendarProvider.svelte";
  import { useDiscover } from "../discover/useDiscover";

  const CALENDAR_DRAWERS: ReadonlyArray<Drawers> = [
    Drawers.History,
    Drawers.Activity,
    Drawers.Calendar,
  ];

  const { mode } = useDiscover();
  const { drawer, close } = $derived(drawerNavigation(page.url.searchParams));

  const isCalendarDrawerOpen = $derived(
    drawer && CALENDAR_DRAWERS.includes(drawer),
  );

  const drawerTitle = $derived.by(() => {
    switch (drawer) {
      case Drawers.History:
        return m.list_title_history();
      case Drawers.Activity:
        return m.list_title_social_activity();
      case Drawers.Calendar:
        return m.list_title_upcoming_schedule();
    }
  });

  const initialDate = null;
  // TODO streamline, get rid of paginated components
  // TODO initial dates
</script>

{#snippet badge()}
  <DiscoverToggles />
{/snippet}

<!-- {#if isCalendarDrawerOpen}
  <Drawer size="large" onClose={close} title={drawerTitle}>
    {#snippet badge()}
      <DiscoverToggles />
    {/snippet}

    <CalendarProvider {initialDate}>
      <DrawerCalendar mode={$mode} />
    </CalendarProvider>
  </Drawer>
{/if} -->

{#if drawer === Drawers.History}
  <Drawer size="large" {badge} onClose={close} title={m.list_title_history()}>
    <CalendarProvider {initialDate}>
      <PersonalHistoryPaginatedList mode={$mode} />
    </CalendarProvider>
  </Drawer>
{/if}

{#if drawer === Drawers.Activity}
  <Drawer
    size="large"
    {badge}
    onClose={close}
    title={m.list_title_social_activity()}
  >
    <CalendarProvider {initialDate}>
      <ActivityPaginatedList mode={$mode} />
    </CalendarProvider>
  </Drawer>
{/if}

{#if drawer === Drawers.Calendar}
  <Drawer
    size="large"
    {badge}
    onClose={close}
    title={m.list_title_upcoming_schedule()}
  >
    <CalendarProvider {initialDate}>
      <Calendar mode={$mode} />
    </CalendarProvider>
  </Drawer>
{/if}
