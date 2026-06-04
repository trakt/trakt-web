<script lang="ts">
  import MarkAsWatchedDrawerHost from "./_internal/MarkAsWatchedDrawerHost.svelte";
  import { markAsWatchedDrawerStore } from "./_internal/markAsWatchedDrawerStore";
</script>

{#if $markAsWatchedDrawerStore?.isOpen}
  <MarkAsWatchedDrawerHost
    onClose={markAsWatchedDrawerStore.close}
    title={$markAsWatchedDrawerStore.title}
    {...$markAsWatchedDrawerStore.mediaStore}
  />
{/if}
