<script lang="ts">
  import { page } from "$app/state";
  import MyStatsDrawer from "../stats/MyStatsDrawer.svelte";
  import {
    ProfileDrawers,
    profileDrawerNavigation,
  } from "./_internal/profileDrawerNavigation.ts";
  import ActivityDrawer from "./components/_internal/drawers/ActivityDrawer.svelte";

  const { drawer, sourceCommentId, close } = $derived(
    profileDrawerNavigation(page.url.searchParams),
  );
</script>

{#if drawer === ProfileDrawers.MyStats}
  <MyStatsDrawer onClose={close} />
{:else if drawer === ProfileDrawers.Activity}
  <ActivityDrawer {sourceCommentId} onClose={close} />
{/if}
