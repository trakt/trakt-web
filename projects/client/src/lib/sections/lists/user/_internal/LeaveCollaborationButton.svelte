<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import LogoutIcon from "$lib/components/icons/LogoutIcon.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { toUserSlug } from "$lib/utils/profile/toUserSlug";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { map } from "rxjs";
  import { useLeaveCollaboration } from "./useLeaveCollaboration.ts";

  const { list }: { list: MediaListSummary } = $props();

  const { isMe: isOwner } = $derived(useIsMe(toUserSlug(list.user)));

  const target$ = fromRune(() => list).pipe(
    map((currentList) => ({ listId: currentList.id })),
  );

  const { isLeaving, leaveCollaboration } = useLeaveCollaboration(target$);

  const {
    color,
    variant: _variant,
    ...dangerEvents
  } = $derived(useDangerButton({ isActive: true, color: "default" }));

  const { confirm } = useConfirm();
  const confirmLeave = $derived(
    confirm({
      type: ConfirmationType.LeaveCollaboration,
      name: list.name,
      onConfirm: leaveCollaboration,
    }),
  );
</script>

{#if !$isOwner}
  <DropdownItem
    label={m.button_label_leave_collaboration({ name: list.name })}
    color={$color as "default" | "red"}
    disabled={$isLeaving}
    onclick={confirmLeave}
    {...dangerEvents}
  >
    {m.button_text_leave_collaboration()}

    {#snippet icon()}
      <LogoutIcon />
    {/snippet}
  </DropdownItem>
{/if}
