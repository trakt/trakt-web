<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import BlockIcon from "$lib/components/icons/BlockIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DisplayableProfileProps } from "$lib/sections/profile/DisplayableProfileProps";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { useBlockUser } from "./useBlockUser";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { blocked } = useUser();
  const isBlocked = $derived($blocked.has(slug));

  const blockActions = useBlockUser();
  const { isRequestingBlock } = blockActions;

  const userDisplayName = $derived(toDisplayableName(profile));

  const { confirm } = useConfirm();
  const confirmBlock = $derived(
    confirm({
      type: ConfirmationType.BlockUser,
      username: userDisplayName,
      onConfirm: () => blockActions.blockUser(slug),
    }),
  );

  const {
    color,
    variant: _,
    ...events
  } = $derived(useDangerButton({ isActive: true, color: "default" }));

  const blockButtonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_block({ username: userDisplayName }),
    color: $color,
    variant: "secondary",
    onclick: confirmBlock,
    disabled: $isRequestingBlock,
    ...events,
  });
</script>

<PopupMenu
  label={m.button_label_profile_actions({ username: userDisplayName })}
  mode="standalone"
>
  {#snippet items()}
    {#if isBlocked}
      <DropdownItem
        style="flat"
        color="default"
        variant="secondary"
        label={m.button_label_unblock({ username: userDisplayName })}
        onclick={() => blockActions.unblockUser(slug)}
        disabled={$isRequestingBlock}
      >
        {m.button_text_unblock()}
        {#snippet icon()}
          <BlockIcon />
        {/snippet}
      </DropdownItem>
    {:else}
      <DropdownItem style="flat" {...blockButtonProps}>
        {m.button_text_block()}
        {#snippet icon()}
          <BlockIcon />
        {/snippet}
      </DropdownItem>
    {/if}
  {/snippet}
</PopupMenu>
