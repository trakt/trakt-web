<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DeleteIcon from "$lib/components/icons/DeleteIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";

  const {
    list,
    isDeleting,
    onDelete,
  }: {
    list: MediaListSummary;
    isDeleting: boolean;
    onDelete: () => {};
  } = $props();

  const {
    color,
    variant: _,
    ...events
  } = $derived(useDangerButton({ isActive: true, color: "default" }));

  const { confirm } = useConfirm();
  const confirmDelete = $derived(
    confirm({
      type: ConfirmationType.DeleteList,
      name: list.name,
      onConfirm: onDelete,
    }),
  );

  const buttonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_delete_list({ name: list.name }),
    color: $color,
    onclick: confirmDelete,
    disabled: isDeleting,
    variant: "secondary",
    ...events,
  });
</script>

<DropdownItem style="flat" {...buttonProps}>
  {m.button_text_delete_list()}

  {#snippet icon()}
    <DeleteIcon />
  {/snippet}
</DropdownItem>
