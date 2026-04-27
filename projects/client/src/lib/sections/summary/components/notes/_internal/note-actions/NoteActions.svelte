<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { UserNote } from "$lib/requests/models/UserNote";
  import DeleteNoteButton from "./DeleteNoteButton.svelte";
  import EditNoteButton from "./EditNoteButton.svelte";

  type NoteActionsProps = {
    note: UserNote;
    media: MediaEntry;
    onEdit: () => void;
  };

  const { note, media, onEdit }: NoteActionsProps = $props();
</script>

<PopupMenu label={m.button_label_popup_menu_notes()} mode="standalone">
  {#snippet items()}
    <EditNoteButton onclick={onEdit} />
    <DeleteNoteButton {note} {media} />
  {/snippet}
</PopupMenu>
