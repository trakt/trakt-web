<script lang="ts">
  import { mapToNoteDrawerType } from "$lib/features/notes/_internal/mapToNoteDrawerType";
  import AddNoteDrawer from "$lib/features/notes/AddNoteDrawer.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { UserNote } from "$lib/requests/models/UserNote";
  import TextCard from "../../_internal/TextCard.svelte";
  import NoteActions from "./note-actions/NoteActions.svelte";
  import NoteHeader from "./NoteHeader.svelte";

  const { note, media }: { note: UserNote; media: MediaEntry } = $props();

  let isEditOpen = $state(false);
</script>

<TextCard --width-card="100%" --height-card="fit-content">
  {#snippet header()}
    <NoteHeader {note}>
      {#snippet actions()}
        <NoteActions {note} {media} onEdit={() => (isEditOpen = true)} />
      {/snippet}
    </NoteHeader>
  {/snippet}

  <div class="trakt-user-note-content">
    <p>
      {note.notes}
    </p>
  </div>
</TextCard>

{#if isEditOpen}
  <AddNoteDrawer
    onClose={() => (isEditOpen = false)}
    mode="edit"
    {note}
    type={mapToNoteDrawerType(note.type)}
    title={media.title}
    id={media.id}
    mediaType={media.type}
  />
{/if}
