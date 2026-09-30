<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CheckboxIcon from "$lib/components/icons/CheckboxIcon.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import {
    type BackgroundFlash,
    backgroundFlash,
  } from "$lib/utils/attachments/backgroundFlash";
  import { createAttachmentKey } from "svelte/attachments";
  import { ListDropdownItemIntlProvider } from "./ListDropdownItemIntlProvider";
  import type { ListDropdownItemProps } from "./ListDropdownItemProps";
  import { useList } from "./useList";

  const {
    title,
    list,
    i18n = ListDropdownItemIntlProvider,
    target,
    isListed,
  }: ListDropdownItemProps = $props();

  const { user } = useUser();

  const { addToList, removeFromList, isListUpdating } = $derived(
    useList({ list, ...target }),
  );

  let flash = $state<BackgroundFlash | null>(null);

  const add = async () => {
    if (await addToList()) {
      flash = { color: "purple" };
    }
  };

  const remove = async () => {
    if (await removeFromList()) {
      flash = { color: "red" };
    }
  };

  const isBelowLimit = $derived(list.count < $user.limits.lists.itemLimit);

  const { confirm } = useConfirm();
  const confirmRemove = $derived(
    confirm({
      type: ConfirmationType.RemoveFromList,
      title,
      name: list.name,
      onConfirm: remove,
    }),
  );

  const handler = $derived(isListed ? confirmRemove : add);
  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: isListed, color: "default" }),
  );

  const itemProps: Omit<ButtonProps, "children"> = $derived({
      style: "flat",
      label: i18n.label({ isListed, listName: list.name, title }),
      "aria-pressed": isListed ? "true" : "false",
      color: $color,
      variant: isListed ? variant : "primary",
      onclick: handler,
      disabled: $isListUpdating || (!isListed && !isBelowLimit),
      ...events,
      [createAttachmentKey()]: backgroundFlash(flash),
    });
</script>

<DropdownItem {...itemProps}>
  {i18n.text({ isListed, listName: list.name, title })}

  {#snippet icon()}
    {#if $isListUpdating}
      <LoadingIndicator />
    {:else}
      <CheckboxIcon state={isListed ? "checked" : "unchecked"} />
    {/if}
  {/snippet}

</DropdownItem>
