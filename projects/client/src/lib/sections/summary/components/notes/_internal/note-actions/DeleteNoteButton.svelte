<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DeleteIcon from "$lib/components/icons/DeleteIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useDeleteNote } from "$lib/features/notes/_internal/useDeleteNote";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { UserNote } from "$lib/requests/models/UserNote";

  const { note, media }: { note: UserNote; media: MediaEntry } = $props();

  const { confirm } = useConfirm();
  const { isDeleting, deleteNote } = useDeleteNote();

  const confirmDelete = $derived(
    confirm({
      type: ConfirmationType.DeleteNote,
      onConfirm: () =>
        deleteNote({
          id: note.id,
          media: { type: media.type, id: media.id },
          type: note.type,
        }),
    }),
  );
</script>

<DropdownItem
  onclick={confirmDelete}
  label={m.button_label_delete_note()}
  color="default"
  style="flat"
  variant="secondary"
  disabled={$isDeleting}
>
  {m.button_text_delete_note()}

  {#snippet icon()}
    <DeleteIcon />
  {/snippet}
</DropdownItem>
