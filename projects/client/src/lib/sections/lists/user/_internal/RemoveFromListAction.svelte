<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaStoreProps } from "$lib/models/MediaStoreProps";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { useRemoveFromList } from "./useRemoveFromList";

  type TargetProps = {
    title: string;
  } & ExtendedMediaStoreProps;

  const { list, target }: { list: MediaListSummary; target: TargetProps } =
    $props();

  const { isListUpdating, removeFromList } = $derived(
    useRemoveFromList({
      listId: list.slug,
      ...target,
    }),
  );

  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: true, color: "blue" }),
  );

  const { confirm } = useConfirm();
  const confirmRemove = $derived(
    confirm({
      type: ConfirmationType.RemoveFromList,
      title: target.title,
      name: list.name,
      onConfirm: removeFromList,
    }),
  );

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_remove_from_list({ title: target.title }),
    color: $color,
    variant,
    onclick: confirmRemove,
    disabled: $isListUpdating,
    ...events,
  });

  /*
  FIXME: this is here temporarily
  Will likely merge with watchlist action
  */
</script>

<DropdownItem {...commonProps} style="flat">
  {m.button_text_remove_from_list()}

  {#snippet icon()}
    <BookmarkIcon state="added" size="normal" />
  {/snippet}
</DropdownItem>
