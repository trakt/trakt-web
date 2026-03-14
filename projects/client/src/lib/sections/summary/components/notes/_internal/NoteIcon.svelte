<script lang="ts">
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import NotesIcon from "$lib/components/icons/NotesIcon.svelte";
  import type { UserNote } from "$lib/requests/models/UserNote";

  const { note }: { note: UserNote } = $props();
</script>

<div class="trakt-note-icon">
  {#if note.type === "note"}
    <NotesIcon />
  {/if}

  {#if note.type === "favorites"}
    <FavoriteIcon />
  {/if}
</div>

<style>
  .trakt-note-icon {
    width: var(--ni-32);
    height: var(--ni-32);

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 50%;
    border: 1px solid var(--color-border);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }
</style>
