<script lang="ts">
  import MarkAsWatchedDrawer from "./_internal/MarkAsWatchedDrawer.svelte";
  import { markAsWatchedDrawerStore } from "./_internal/markAsWatchedDrawerStore";
</script>

{#if $markAsWatchedDrawerStore?.isOpen}
  <MarkAsWatchedDrawer
    onClose={markAsWatchedDrawerStore.close}
    title={$markAsWatchedDrawerStore.title}
    {...$markAsWatchedDrawerStore.mediaStore}
  />
{/if}
