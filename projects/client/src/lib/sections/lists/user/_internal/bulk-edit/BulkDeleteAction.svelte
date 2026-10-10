<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import DeleteIcon from "$lib/components/icons/DeleteIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { BulkEditActionProps } from "./BulkEditActionProps.ts";
  import { useBulkDeleteFromList } from "./useBulkDeleteFromList.ts";

  const { list, items, onDone }: BulkEditActionProps = $props();

  const { isDeleting, deleteItems } = $derived(useBulkDeleteFromList(list));

  const { confirm } = useConfirm();

  async function handleDeleted() {
    await deleteItems([...items]);
    onDone();
  }

  const confirmDelete = $derived(
    confirm({
      type: ConfirmationType.BulkRemoveFromList,
      count: items.length,
      name: list.name,
      onConfirm: handleDeleted,
    }),
  );

  const { color, variant: _variant, ...dangerEvents } = $derived(
    useDangerButton({ isActive: true, color: "default" }),
  );
</script>

<Button
  size="small"
  color={$color}
  disabled={items.length === 0 || $isDeleting}
  label={m.button_label_delete_selected_list_items({
    count: items.length,
    name: list.name,
  })}
  onclick={confirmDelete}
  {...dangerEvents}
>
  {m.button_text_delete_selected()}
  {#snippet icon()}
    <DeleteIcon />
  {/snippet}
</Button>
