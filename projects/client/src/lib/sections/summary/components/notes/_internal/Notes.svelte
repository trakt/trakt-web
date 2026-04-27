<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { UserNote } from "$lib/requests/models/UserNote";
  import NoteCard from "./NoteCard.svelte";
  import NotePlaceholder from "./NotePlaceholder.svelte";

  const { notes, media }: { notes: UserNote[]; media: MediaEntry } = $props();
</script>

<div class="trakt-notes">
  {#if notes.length === 0}
    <NotePlaceholder />
  {/if}

  {#each notes as note (note.id)}
    <NoteCard {note} {media} />
  {/each}
</div>

<style>
  .trakt-notes {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
