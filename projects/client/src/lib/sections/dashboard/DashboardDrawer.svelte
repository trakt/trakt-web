<script lang="ts">
  import { page } from "$app/state";
  import StreakDrawerHost from "../stats/StreakDrawerHost.svelte";
  import NextStepsDrawerHost from "./_internal/NextStepsDrawerHost.svelte";
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
{:else if drawer === DashboardDrawers.NextSteps}
  <NextStepsDrawerHost onClose={close} />
{/if}
