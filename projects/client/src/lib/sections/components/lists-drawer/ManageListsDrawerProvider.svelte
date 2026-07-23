<script lang="ts">
  import ListsDrawer from "./ListsDrawer.svelte";
  import { manageListsDrawerStore } from "./manageListsDrawerStore";
</script>

{#if $manageListsDrawerStore?.isOpen}
  <ListsDrawer
    onClose={manageListsDrawerStore.close}
    media={$manageListsDrawerStore.media}
    title={$manageListsDrawerStore.title}
  />
{/if}
