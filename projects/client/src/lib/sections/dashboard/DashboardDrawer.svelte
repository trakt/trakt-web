<script lang="ts">
  import { page } from "$app/state";
  import StreakDrawer from "../stats/StreakDrawer.svelte";
  import WeeklyPulseDrawer from "../stats/WeeklyPulseDrawer.svelte";
  import {
    DashboardDrawers,
    dashboardDrawerNavigation,
  } from "./_internal/dashboardDrawerNavigation";

  const { drawer, close } = $derived(
    dashboardDrawerNavigation(page.url.searchParams),
  );
</script>

{#if drawer === DashboardDrawers.WeeklyPulse}
  <WeeklyPulseDrawer onClose={close} />
{:else if drawer === DashboardDrawers.Streak}
  <StreakDrawer onClose={close} />
{/if}
