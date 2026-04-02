<script lang="ts">
  import { page } from "$app/state";
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
{/if}
