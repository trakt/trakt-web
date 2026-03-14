<script lang="ts">
  import { addNoteDrawerStore } from "./_internal/addNoteDrawerStore";
  import AddNoteDrawer from "./AddNoteDrawer.svelte";
</script>

{#if $addNoteDrawerStore}
  <AddNoteDrawer
    onClose={addNoteDrawerStore.close}
    type={$addNoteDrawerStore.type}
    title={$addNoteDrawerStore.title}
    id={$addNoteDrawerStore.id}
    mediaType={$addNoteDrawerStore.mediaType}
  />
{/if}
