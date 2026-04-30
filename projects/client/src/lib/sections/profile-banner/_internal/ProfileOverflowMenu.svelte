<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import BlockIcon from "$lib/components/icons/BlockIcon.svelte";
  import FollowIcon from "$lib/components/icons/FollowIcon.svelte";
  import MoreIcon from "$lib/components/icons/MoreIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DisplayableProfileProps } from "$lib/sections/profile/DisplayableProfileProps";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { useBlockUser } from "./useBlockUser";
  import { useFollowUserRequest } from "./useFollowUser";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { blocked } = useUser();
  const isBlocked = $derived($blocked.has(slug));

  const blockActions = useBlockUser();
  const { isRequestingBlock } = blockActions;

  const {
    isRequestingFollow,
    followStatus,
    followUser,
    unfollowUser,
    cancelFollowRequest,
  } = $derived(useFollowUserRequest(slug));

  const userDisplayName = $derived(toDisplayableName(profile));

  const { confirm } = useConfirm();
  const confirmBlock = $derived(
    confirm({
      type: ConfirmationType.BlockUser,
      username: userDisplayName,
      onConfirm: () => blockActions.blockUser(slug),
    }),
  );

  const confirmUnfollow = $derived(
    confirm({
      type: ConfirmationType.UnfollowUser,
      username: userDisplayName,
      onConfirm: unfollowUser,
    }),
  );

  const followItem = $derived.by(() => {
    switch ($followStatus) {
      case "following":
        return {
          label: m.button_label_unfollow({ username: userDisplayName }),
          text: m.button_text_unfollow(),
          onClick: confirmUnfollow,
          iconState: "followed" as const,
        };
      case "pending":
        return {
          label: m.button_label_cancel_follow_request({
            username: userDisplayName,
          }),
          text: m.button_text_cancel_follow_request(),
          onClick: cancelFollowRequest,
          iconState: "unfollowed" as const,
        };
      default:
        return {
          label: m.button_label_follow({ username: userDisplayName }),
          text: m.button_text_follow(),
          onClick: followUser,
          iconState: "unfollowed" as const,
        };
    }
  });

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
  size="normal"
>
  {#snippet icon()}
    <MoreIcon size="normal" />
  {/snippet}
  {#snippet items()}
    {#if !isBlocked}
      <DropdownItem
        style="flat"
        color="default"
        variant="secondary"
        label={followItem.label}
        onclick={followItem.onClick}
        disabled={$isRequestingFollow}
      >
        {followItem.text}
        {#snippet icon()}
          <FollowIcon state={followItem.iconState} />
        {/snippet}
      </DropdownItem>
    {/if}
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
