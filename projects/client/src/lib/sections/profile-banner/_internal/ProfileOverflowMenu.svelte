<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import BlockIcon from "$lib/components/icons/BlockIcon.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import FollowIcon from "$lib/components/icons/FollowIcon.svelte";
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import ReportButton from "$lib/features/report/ReportButton.svelte";
  import { ReportableType } from "$lib/features/report/models/ReportableType.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ModerateAction from "$lib/sections/components/admin/ModerateAction.svelte";
  import type { DisplayableProfileProps } from "$lib/sections/profile/DisplayableProfileProps";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { useBlockUser } from "./useBlockUser";
  import { useFollowUserRequest } from "./useFollowUser";

  const { profile, slug }: DisplayableProfileProps = $props();

  let snackbarOpen = $state(false);
  let snackbarMessage = $state("");

  const { blocked } = useUser();
  const isBlocked = $derived($blocked.has(slug));

  const blockActions = useBlockUser();
  const { isRequestingBlock } = blockActions;

  const {
    isRequestingFollow,
    incomingFollowRequest,
    followStatus,
    followUser,
    unfollowUser,
    cancelFollowRequest,
    approveIncomingFollowRequest,
    denyIncomingFollowRequest,
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

  const openSnackbar = (message: string) => {
    snackbarMessage = message;
    snackbarOpen = true;
  };

  const closeSnackbar = () => {
    snackbarOpen = false;
  };

  const handleFollowRequest = async (
    action: (requestId: number) => Promise<boolean>,
    successMessage: (params: { username: string }) => string,
  ) => {
    const requestId = $incomingFollowRequest?.id;
    if (requestId == null) return;

    const succeeded = await action(requestId);
    if (!succeeded) return;

    openSnackbar(successMessage({ username: userDisplayName }));
  };

  const approveRequest = () =>
    handleFollowRequest(
      approveIncomingFollowRequest,
      m.text_info_follow_request_approved,
    );

  const denyRequest = () =>
    handleFollowRequest(
      denyIncomingFollowRequest,
      m.text_info_follow_request_rejected,
    );
</script>

<PopupMenu
  label={m.button_label_profile_actions({ username: userDisplayName })}
  mode="standalone"
  size="normal"
  title={userDisplayName}
>
  {#snippet items()}
    {#if $incomingFollowRequest}
      <DropdownItem
        style="flat"
        color="default"
        variant="secondary"
        label={m.button_label_approve_follow_request({
          username: userDisplayName,
        })}
        onclick={approveRequest}
        disabled={$isRequestingFollow}
      >
        {m.button_text_approve_follow_request()}
        {#snippet icon()}
          <CheckIcon />
        {/snippet}
      </DropdownItem>
      <DropdownItem
        style="flat"
        color="red"
        variant="secondary"
        label={m.button_label_reject_follow_request({
          username: userDisplayName,
        })}
        onclick={denyRequest}
        disabled={$isRequestingFollow}
      >
        {m.button_text_reject_follow_request()}
        {#snippet icon()}
          <CloseIcon />
        {/snippet}
      </DropdownItem>
    {/if}

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

    <RenderFor audience="authenticated">
      <ReportButton
        params={{ type: ReportableType.User, id: slug }}
        label={m.button_label_report_user({ username: userDisplayName })}
      />
    </RenderFor>

    <ModerateAction variant="secondary" />
  {/snippet}
</PopupMenu>

<Snackbar
  open={snackbarOpen}
  onDismiss={closeSnackbar}
  title={m.button_label_follow_requests()}
  message={snackbarMessage}
/>
