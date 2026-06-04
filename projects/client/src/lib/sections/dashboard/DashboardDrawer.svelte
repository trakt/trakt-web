<script lang="ts">
  import { page } from "$app/state";
  import StreakDrawerHost from "../stats/StreakDrawerHost.svelte";
  import {
    DashboardDrawers,
    dashboardDrawerNavigation,
  } from "./_internal/dashboardDrawerNavigation";

  const { drawer, close } = $derived(
    dashboardDrawerNavigation(page.url.searchParams),
  );
</script>

{#if drawer === DashboardDrawers.Streak}
  <StreakDrawerHost onClose={close} />
{/if}
