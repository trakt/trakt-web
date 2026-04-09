<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DeleteIcon from "$lib/components/icons/DeleteIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { useDeleteComment } from "./useDeleteComment";

  const { comment, type }: { comment: MediaComment; type: ExtendedMediaType } =
    $props();

  const { confirm } = useConfirm();
  const { isDeleting, deleteComment } = $derived(
    useDeleteComment({ comment, type }),
  );

  const confirmDelete = $derived(
    confirm({
      type: ConfirmationType.DeleteComment,
      onConfirm: () => deleteComment(),
    }),
  );
</script>

<DropdownItem
  onclick={confirmDelete}
  label={m.button_label_delete_comment()}
  color="default"
  style="flat"
  variant="secondary"
  disabled={$isDeleting}
>
  {m.button_text_delete_comment()}

  {#snippet icon()}
    <DeleteIcon />
  {/snippet}
</DropdownItem>
