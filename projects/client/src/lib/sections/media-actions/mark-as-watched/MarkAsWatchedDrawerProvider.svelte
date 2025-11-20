<script lang="ts">
  import MarkAsWatchedDrawer from "./_internal/MarkAsWatchedDrawer.svelte";
  import { markAsWatchedDrawerStore } from "./_internal/markAsWatchedDrawerStore";

  const drawerState = $derived(markAsWatchedDrawerStore);
</script>

{#if $drawerState}
  <MarkAsWatchedDrawer
    onClose={markAsWatchedDrawerStore.close}
    title={$drawerState.title}
    {...$drawerState.mediaStore}
  />
{/if}
