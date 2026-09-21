<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import LogoutIcon from "$lib/components/icons/LogoutIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { map } from "rxjs";
  import { useLeaveCollaboration } from "./useLeaveCollaboration.ts";

  const { list }: { list: MediaListSummary } = $props();

  const target$ = fromRune(() => list).pipe(
    map((currentList) => ({ listId: currentList.id })),
  );

  const { isCollaborator, isLeaving, leaveCollaboration } =
    useLeaveCollaboration(target$);

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

{#if $isCollaborator}
  <!-- Deliberately not behind FeatureFlag.ListCollaborators, unlike
       ManageCollaboratorsButton - someone else's owner account can add you
       as a collaborator regardless of your own flag state, so leaving can't
       depend on it either. -->
  <DropdownItem
    label={m.button_label_leave_collaboration({ name: list.name })}
    style="flat"
    color={$color as "default" | "red"}
    variant="secondary"
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
