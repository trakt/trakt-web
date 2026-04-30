<script lang="ts">
  import { page } from "$app/state";
  import {
    ProfileDrawers,
    profileDrawerNavigation,
  } from "./_internal/profileDrawerNavigation.ts";
  import ActivityDrawer from "./components/_internal/drawers/ActivityDrawer.svelte";

  const { drawer, sourceCommentId, close } = $derived(
    profileDrawerNavigation(page.url.searchParams),
  );
</script>

{#if drawer === ProfileDrawers.Activity}
  <ActivityDrawer {sourceCommentId} onClose={close} />
{/if}
